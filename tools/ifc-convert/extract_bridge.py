"""
Bow River Bridge IFC -> bridge.glb extractor.

Loads every IFC in the source directory (excluding *test*, *OGBR*,
*STR9*, *STR4-00002*), pulls each element's real triangulated mesh
via ifcopenshell.geom in world coords, recentres each part on its
own centroid, then writes a single binary glTF (GLB) with one node
per element. Node extras carry the assembled world position
(centroid), material class, BOQ number, source file, and IFC GUID
so the web scene can rebuild Part[] with real per-element geometry.

The whole federation is uniformly scaled so the longest horizontal
extent matches the synthetic bridge length (200 world units) and
recentred so the lowest point sits at Y = 0.

Run from tools/ifc-convert via:
    uv run python extract_bridge.py
"""

from __future__ import annotations

import multiprocessing
import struct
import sys
from collections import Counter
from pathlib import Path

import ifcopenshell
import ifcopenshell.geom
import ifcopenshell.util.element as ifc_elem
import numpy as np
import pygltflib


IFC_DIR = Path("C:/Users/yousi/Downloads/bow-river-ifc")
OUT_PATH = Path(__file__).resolve().parents[2] / "public" / "models" / "bridge.glb"
TARGET_LENGTH = 200.0
EXCLUDE_TOKENS = ("test", "ogbr", "str9", "str4-00002")

MAT_CONCRETE = "concrete"
MAT_STEEL = "steel"
MAT_PLATE = "plate"
MAT_CABLE = "cable"
MAT_REBAR = "rebar"
MAT_STONE = "stone"
DEFAULT_MATERIAL = MAT_CONCRETE


# Map the real IDD_MATERIAL strings the IFCs ship onto our visual
# material buckets. CONCRETE_REINFORCED is a synonym for
# REINFORCED_CONCRETE; both stay in the concrete bucket so the
# explosion view doesn't fragment the slab/abutment set.
IDD_MATERIAL_MAP: dict[str, str] = {
    "CONCRETE": MAT_CONCRETE,
    "REINFORCED_CONCRETE": MAT_CONCRETE,
    "CONCRETE_REINFORCED": MAT_CONCRETE,
    "STEEL": MAT_STEEL,
    "NATURAL_SOIL": MAT_STONE,
    "STONE": MAT_STONE,
    "CRUSHED_STONE": MAT_STONE,
    "CRUSHED_ROCK": MAT_STONE,
    "CRUSHED_ROCKS": MAT_STONE,
}


def _material_from_source(source: str) -> str:
    s = source.upper()
    if "TRK" in s:
        return MAT_STEEL
    if "CIV" in s or "BRA" in s or "OGBR" in s:
        return MAT_CONCRETE
    if "STR9" in s or "STR4-00002" in s:
        return MAT_PLATE
    if "STR" in s:
        return MAT_STEEL
    return DEFAULT_MATERIAL


def _read_idd(element) -> dict:
    """Pull the IDD_IR pset that ships on every Bow River element.
    Returns a dict (empty if the pset is missing) with the keys we
    care about: IDD_BOQ_ITEM, IDD_BOQ_DESCRIPTION, IDD_MATERIAL,
    IDD_DISCIPLINE, IDD_SUB_LOCATION, IDD_UNICLASS_DESCRIPTION,
    IDD_MASTERFORMAT_CODE."""
    try:
        psets = ifc_elem.get_psets(element)
    except Exception:
        return {}
    return psets.get("IDD_IR", {}) or {}


def _material_from_element(element, source: str, idd: dict) -> str:
    # Real IDD_MATERIAL wins.
    raw = (idd.get("IDD_MATERIAL") or "").upper().strip()
    if raw in IDD_MATERIAL_MAP:
        return IDD_MATERIAL_MAP[raw]
    # IFC type signals.
    ifc_type = element.is_a()
    if "Reinforc" in ifc_type:
        return MAT_REBAR
    if "Cable" in ifc_type or "Tendon" in ifc_type:
        return MAT_CABLE
    if ifc_type == "IfcPlate":
        return MAT_PLATE
    # Filename heuristic last.
    return _material_from_source(source)


# IFC right-handed Z-up -> Three.js right-handed Y-up: (x,y,z) -> (x,z,-y).
def _ifc_verts_to_three(verts: np.ndarray) -> np.ndarray:
    out = np.empty_like(verts, dtype=np.float32)
    out[:, 0] = verts[:, 0]
    out[:, 1] = verts[:, 2]
    out[:, 2] = -verts[:, 1]
    return out


def extract() -> None:
    if not IFC_DIR.exists():
        print(f"IFC dir not found: {IFC_DIR}", file=sys.stderr)
        sys.exit(1)

    ifc_files = sorted(IFC_DIR.glob("*.ifc"))
    ifc_files = [
        f for f in ifc_files if not any(t in f.name.lower() for t in EXCLUDE_TOKENS)
    ]
    print(f"Processing {len(ifc_files)} IFC files (excluded: {EXCLUDE_TOKENS})")

    settings = ifcopenshell.geom.settings()
    settings.set("use-world-coords", True)

    # First pass: read every element's mesh, convert coords, centre on
    # its own centroid. Store everything in memory; total triangle
    # count for ~1000 parts of medium complexity is tractable.
    parts: list[dict] = []
    type_counter: Counter[str] = Counter()
    material_counter: Counter[str] = Counter()
    skipped = 0

    for ifc_path in ifc_files:
        print(f"  {ifc_path.name}")
        model = ifcopenshell.open(str(ifc_path))
        try:
            it = ifcopenshell.geom.iterator(
                settings, model, max(1, multiprocessing.cpu_count() - 1)
            )
        except Exception as e:
            print(f"    iterator init failed: {e}", file=sys.stderr)
            continue
        if not it.initialize():
            continue

        while True:
            shape = it.get()
            element = model.by_id(shape.id)
            geom = shape.geometry
            verts = np.asarray(geom.verts, dtype=np.float64)
            faces = np.asarray(geom.faces, dtype=np.uint32)
            if verts.size == 0 or faces.size == 0:
                skipped += 1
                if not it.next():
                    break
                continue

            verts = verts.reshape(-1, 3)
            verts_three = _ifc_verts_to_three(verts)
            centroid = verts_three.mean(axis=0)
            verts_centered = (verts_three - centroid).astype(np.float32)

            idd = _read_idd(element)
            material = _material_from_element(element, ifc_path.stem, idd)
            ifc_type = element.is_a()
            type_counter[ifc_type] += 1
            material_counter[material] += 1

            parts.append(
                {
                    "verts": verts_centered,
                    "indices": faces.astype(np.uint32),
                    "centroid": centroid.astype(np.float32),
                    "material": material,
                    "type": ifc_type,
                    "guid": element.GlobalId,
                    "source": ifc_path.stem,
                    "boqCode": str(idd.get("IDD_BOQ_ITEM") or "NA"),
                    "boqDescription": str(idd.get("IDD_BOQ_DESCRIPTION") or ""),
                    "discipline": str(idd.get("IDD_DISCIPLINE") or ""),
                    "subLocation": str(idd.get("IDD_SUB_LOCATION") or ""),
                    "uniclass": str(idd.get("IDD_UNICLASS_DESCRIPTION") or ""),
                }
            )
            if not it.next():
                break

    if not parts:
        print("No geometric parts extracted.", file=sys.stderr)
        sys.exit(1)

    # ─── Recentre + uniform scale based on world-aggregate bounds ───
    all_min = np.array([float("inf")] * 3, dtype=np.float64)
    all_max = np.array([float("-inf")] * 3, dtype=np.float64)
    for p in parts:
        v_world = p["verts"] + p["centroid"]
        all_min = np.minimum(all_min, v_world.min(axis=0))
        all_max = np.maximum(all_max, v_world.max(axis=0))

    centre = ((all_min + all_max) / 2.0).astype(np.float32)
    extent = all_max - all_min
    longest = float(max(extent[0], extent[2]))
    scale = TARGET_LENGTH / longest if longest > 0 else 1.0
    y_lift = -(all_min[1] - centre[1]) * scale

    for p in parts:
        c = p["centroid"]
        p["centroid"] = np.array(
            [
                (c[0] - centre[0]) * scale,
                (c[1] - centre[1]) * scale + y_lift,
                (c[2] - centre[2]) * scale,
            ],
            dtype=np.float32,
        )
        p["verts"] = (p["verts"] * scale).astype(np.float32)

    # ─── BOQ sort ──────────────────────────────────────────────────
    # Primary key is the real IDD_BOQ_ITEM code (e.g. "3.1.1") parsed
    # as a tuple of ints so "3.5.1" sorts before "31.1.1". Inside a
    # BOQ group, fall back to centroid Y then X so identical items
    # land in a natural left-to-right reading order.

    def _boq_sort_key(code: str) -> tuple:
        if code == "NA" or not code:
            return (10_000,)
        parts_str = code.split(".")
        out: list[int] = []
        for s in parts_str:
            try:
                out.append(int(s))
            except ValueError:
                out.append(0)
        return tuple(out)

    parts.sort(
        key=lambda p: (
            _boq_sort_key(p["boqCode"]),
            p["source"],
            float(p["centroid"][1]),
            float(p["centroid"][0]),
        )
    )

    # ─── Build GLB ─────────────────────────────────────────────────
    gltf = pygltflib.GLTF2()
    gltf.scene = 0
    gltf.scenes = [pygltflib.Scene(nodes=list(range(len(parts))))]
    gltf.buffers = [pygltflib.Buffer()]

    binary = bytearray()

    def append_blob(arr: np.ndarray) -> tuple[int, int]:
        """Append a numpy array's bytes to the binary buffer with
        4-byte padding and return (byteOffset, byteLength)."""
        data = arr.tobytes()
        offset = len(binary)
        binary.extend(data)
        pad = (4 - len(data) % 4) % 4
        if pad:
            binary.extend(b"\x00" * pad)
        return offset, len(data)

    for boq, p in enumerate(parts, start=1):
        verts_offset, verts_len = append_blob(p["verts"])
        idx_offset, idx_len = append_blob(p["indices"])

        verts_bv = pygltflib.BufferView(
            buffer=0,
            byteOffset=verts_offset,
            byteLength=verts_len,
            target=pygltflib.ARRAY_BUFFER,
        )
        idx_bv = pygltflib.BufferView(
            buffer=0,
            byteOffset=idx_offset,
            byteLength=idx_len,
            target=pygltflib.ELEMENT_ARRAY_BUFFER,
        )

        verts_bv_i = len(gltf.bufferViews)
        gltf.bufferViews.append(verts_bv)
        idx_bv_i = len(gltf.bufferViews)
        gltf.bufferViews.append(idx_bv)

        vmin = p["verts"].min(axis=0).tolist()
        vmax = p["verts"].max(axis=0).tolist()

        verts_acc = pygltflib.Accessor(
            bufferView=verts_bv_i,
            componentType=pygltflib.FLOAT,
            count=len(p["verts"]),
            type=pygltflib.VEC3,
            min=vmin,
            max=vmax,
        )
        idx_acc = pygltflib.Accessor(
            bufferView=idx_bv_i,
            componentType=pygltflib.UNSIGNED_INT,
            count=len(p["indices"]),
            type=pygltflib.SCALAR,
        )

        verts_acc_i = len(gltf.accessors)
        gltf.accessors.append(verts_acc)
        idx_acc_i = len(gltf.accessors)
        gltf.accessors.append(idx_acc)

        mesh = pygltflib.Mesh(
            primitives=[
                pygltflib.Primitive(
                    attributes=pygltflib.Attributes(POSITION=verts_acc_i),
                    indices=idx_acc_i,
                )
            ]
        )
        mesh_i = len(gltf.meshes)
        gltf.meshes.append(mesh)

        node = pygltflib.Node(
            mesh=mesh_i,
            translation=[
                float(p["centroid"][0]),
                float(p["centroid"][1]),
                float(p["centroid"][2]),
            ],
            extras={
                "boq": boq,
                "boqCode": p["boqCode"],
                "boqDescription": p["boqDescription"],
                "material": p["material"],
                "type": p["type"],
                "discipline": p["discipline"],
                "subLocation": p["subLocation"],
                "uniclass": p["uniclass"],
                "guid": p["guid"],
                "source": p["source"],
            },
        )
        gltf.nodes.append(node)

    gltf.buffers[0].byteLength = len(binary)
    gltf.set_binary_blob(bytes(binary))

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    gltf.save_binary(str(OUT_PATH))

    print()
    print(f"Wrote {len(parts)} parts to {OUT_PATH}")
    print(f"  Skipped (empty geometry): {skipped}")
    print(f"  Bounds X [{(all_min[0] - centre[0]) * scale:.1f}..{(all_max[0] - centre[0]) * scale:.1f}]")
    print(f"  Bounds Y [{(all_min[1] - centre[1]) * scale + y_lift:.1f}..{(all_max[1] - centre[1]) * scale + y_lift:.1f}]")
    print(f"  Bounds Z [{(all_min[2] - centre[2]) * scale:.1f}..{(all_max[2] - centre[2]) * scale:.1f}]")
    print(f"  Materials: {dict(material_counter)}")
    print(f"  Top types: {dict(type_counter.most_common(5))}")
    print(f"  File size: {OUT_PATH.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    extract()
