"""
Bow River Bridge IFC -> bridge.json extractor.

Loads every IFC in the source directory (excluding *test*), pulls one
oriented bounding box per geometric element, classifies its material
from IFC type + material associations, and writes a compact JSON the
web component can fetch and feed directly into the existing scene
controller (Part[] shape unchanged).

Coordinate convention is converted from IFC right-handed Z-up to
Three.js right-handed Y-up. The full model is recentred on origin and
uniformly scaled so the largest horizontal extent matches the
synthetic bridge length (200 world units) used by the camera path.

Run from tools/ifc-convert via:
    uv run python extract_bridge.py
"""

from __future__ import annotations

import json
import math
import multiprocessing
import sys
from collections import Counter
from pathlib import Path

import ifcopenshell
import ifcopenshell.geom
import numpy as np


IFC_DIR = Path("C:/Users/yousi/Downloads/bow-river-ifc")
OUT_PATH = Path(__file__).resolve().parents[2] / "public" / "models" / "bridge.json"
TARGET_LENGTH = 200.0  # world units along the longest horizontal axis
EXCLUDE_TOKEN = "test"


# ─── Material classification ────────────────────────────────────────
# We map every IFC element into one of five buckets that match the
# scene's InstancedMesh groups. Heuristic order:
#   1) explicit IFC entity type (rebar, plate, etc.)
#   2) associated material name (English / French keywords)
#   3) fallback by entity family

MAT_CONCRETE = "concrete"
MAT_STEEL = "steel"
MAT_PLATE = "plate"
MAT_CABLE = "cable"
MAT_REBAR = "rebar"

DEFAULT_MATERIAL = MAT_PLATE


def _material_from_name(name: str) -> str | None:
    n = name.lower()
    if "rebar" in n or "reinforc" in n or "armature" in n:
        return MAT_REBAR
    if "cable" in n or "tendon" in n or "câble" in n or "stay" in n:
        return MAT_CABLE
    if "concrete" in n or "béton" in n or "beton" in n:
        return MAT_CONCRETE
    if "steel" in n or "acier" in n:
        # Refine: plate vs structural steel
        if "plate" in n or "plaque" in n:
            return MAT_PLATE
        return MAT_STEEL
    if "plate" in n or "plaque" in n:
        return MAT_PLATE
    return None


def _material_from_source(source: str) -> str:
    """The Bow River IFCs ship with zero IfcMaterial entities, so we
    classify by file/discipline code: TRK = trackwork (steel rails),
    CIV / BRA / OGBR = concrete civil works, STR9 = large structural
    plates, other STR* = structural steel members."""
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


def _material_from_element(element, source: str, size_xyz) -> str:
    ifc_type = element.is_a()

    # Direct entity type signals win first.
    if "Reinforc" in ifc_type:
        return MAT_REBAR
    if "Cable" in ifc_type or "Tendon" in ifc_type:
        return MAT_CABLE
    if ifc_type == "IfcPlate":
        return MAT_PLATE

    # Walk material associations (no-op for these IFCs but keeps the
    # path open if the user re-runs against an IFC that has them).
    for assoc in getattr(element, "HasAssociations", None) or []:
        if not assoc.is_a("IfcRelAssociatesMaterial"):
            continue
        mat = assoc.RelatingMaterial
        names: list[str] = []
        if hasattr(mat, "Name") and mat.Name:
            names.append(mat.Name)
        if mat.is_a("IfcMaterialList"):
            for m in mat.Materials or []:
                if m.Name:
                    names.append(m.Name)
        if mat.is_a("IfcMaterialLayerSetUsage") or mat.is_a("IfcMaterialLayerSet"):
            layer_set = getattr(mat, "ForLayerSet", None) or mat
            for layer in layer_set.MaterialLayers or []:
                if layer.Material and layer.Material.Name:
                    names.append(layer.Material.Name)
        for n in names:
            hit = _material_from_name(n)
            if hit:
                return hit

    # Heuristic: tiny long-thin elements are most likely rebar.
    # size is (x, y, z) in IFC frame (Z-up), so longest dim vs
    # cross-section gives an aspect ratio.
    longest = max(size_xyz)
    cross = min(size_xyz[0], size_xyz[2])  # horizontal cross-section
    if longest > 0 and cross > 0:
        if cross < 0.04 and longest / cross > 12:
            return MAT_REBAR

    return _material_from_source(source)


def _world_aabb(verts: np.ndarray):
    """World-space axis-aligned bounding box. Each part loses its
    orientation in this representation, which is acceptable for the
    explosion view because the *quantity* and *spatial layout* of
    parts is what reads, not their individual rotation. Cables and
    other rotated elements will appear slightly chunkier than their
    true volume, which the scene's cable colour palette handles."""
    mn = verts.min(axis=0)
    mx = verts.max(axis=0)
    return (mn + mx) / 2.0, mx - mn


def _quat_from_matrix3(m: np.ndarray):
    """Three.js-style (x, y, z, w) quaternion from a 3x3 rotation matrix."""
    t = m[0, 0] + m[1, 1] + m[2, 2]
    if t > 0:
        s = math.sqrt(t + 1.0) * 2
        w = 0.25 * s
        x = (m[2, 1] - m[1, 2]) / s
        y = (m[0, 2] - m[2, 0]) / s
        z = (m[1, 0] - m[0, 1]) / s
    elif (m[0, 0] > m[1, 1]) and (m[0, 0] > m[2, 2]):
        s = math.sqrt(1.0 + m[0, 0] - m[1, 1] - m[2, 2]) * 2
        w = (m[2, 1] - m[1, 2]) / s
        x = 0.25 * s
        y = (m[0, 1] + m[1, 0]) / s
        z = (m[0, 2] + m[2, 0]) / s
    elif m[1, 1] > m[2, 2]:
        s = math.sqrt(1.0 + m[1, 1] - m[0, 0] - m[2, 2]) * 2
        w = (m[0, 2] - m[2, 0]) / s
        x = (m[0, 1] + m[1, 0]) / s
        y = 0.25 * s
        z = (m[1, 2] + m[2, 1]) / s
    else:
        s = math.sqrt(1.0 + m[2, 2] - m[0, 0] - m[1, 1]) * 2
        w = (m[1, 0] - m[0, 1]) / s
        x = (m[0, 2] + m[2, 0]) / s
        y = (m[1, 2] + m[2, 1]) / s
        z = 0.25 * s
    return [x, y, z, w]


# IFC right-handed Z-up -> Three.js right-handed Y-up.
# Rotation about X axis by -90 degrees: (x, y, z) -> (x, z, -y)
# Applied to position vectors, sizes (component swap), and quaternions
# (compose: q_three = q_xrot * q_ifc).
_X_NEG90_QUAT = np.array(
    [-math.sin(math.pi / 4), 0.0, 0.0, math.cos(math.pi / 4)],  # x, y, z, w
    dtype=np.float64,
)


def _quat_mul(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    ax, ay, az, aw = a
    bx, by, bz, bw = b
    return np.array(
        [
            aw * bx + ax * bw + ay * bz - az * by,
            aw * by - ax * bz + ay * bw + az * bx,
            aw * bz + ax * by - ay * bx + az * bw,
            aw * bw - ax * bx - ay * by - az * bz,
        ]
    )


def _ifc_to_three_vec(v):
    return [v[0], v[2], -v[1]]


def _ifc_to_three_size(s):
    return [s[0], s[2], s[1]]


def _ifc_to_three_quat(q_ifc):
    return _quat_mul(_X_NEG90_QUAT, np.asarray(q_ifc)).tolist()


# ─── Main extraction ────────────────────────────────────────────────


def extract():
    if not IFC_DIR.exists():
        print(f"IFC dir not found: {IFC_DIR}", file=sys.stderr)
        sys.exit(1)

    ifc_files = sorted(IFC_DIR.glob("*.ifc"))
    ifc_files = [f for f in ifc_files if EXCLUDE_TOKEN not in f.name.lower()]
    print(f"Processing {len(ifc_files)} IFC files…")

    settings = ifcopenshell.geom.settings()
    settings.set("use-world-coords", True)  # AABB-in-world per element

    parts: list[dict] = []
    type_counter: Counter[str] = Counter()
    material_counter: Counter[str] = Counter()
    skipped = 0

    for ifc_path in ifc_files:
        print(f"  {ifc_path.name}")
        model = ifcopenshell.open(str(ifc_path))
        try:
            iterator = ifcopenshell.geom.iterator(
                settings, model, max(1, multiprocessing.cpu_count() - 1)
            )
        except Exception as e:
            print(f"    iterator failed: {e}; falling back to per-element")
            iterator = None

        def emit_for_element(element):
            nonlocal skipped
            try:
                shape = ifcopenshell.geom.create_shape(settings, element)
            except Exception:
                skipped += 1
                return
            _process_shape(element, shape)

        def _process_shape(element, shape):
            nonlocal skipped
            geom = shape.geometry
            verts_flat = np.asarray(geom.verts, dtype=np.float64)
            if verts_flat.size == 0:
                skipped += 1
                return
            verts = verts_flat.reshape(-1, 3)

            center_world, size = _world_aabb(verts)

            # Clamp degenerate sizes so a 0-thickness element still
            # renders as a thin shim instead of disappearing.
            size = np.maximum(size, 0.05)

            q_ifc = [0.0, 0.0, 0.0, 1.0]  # identity for world AABB
            material = _material_from_element(element, ifc_path.stem, size)
            ifc_type = element.is_a()

            type_counter[ifc_type] += 1
            material_counter[material] += 1

            parts.append(
                {
                    "id": len(parts),
                    "boq": 0,  # assigned after sorting
                    "material": material,
                    "type": ifc_type,
                    "position": _ifc_to_three_vec(center_world),
                    "size": _ifc_to_three_size(size),
                    "quaternion": _ifc_to_three_quat(q_ifc),
                    "guid": element.GlobalId,
                    "source": ifc_path.stem,
                }
            )

        if iterator and iterator.initialize():
            while True:
                shape = iterator.get()
                element = model.by_id(shape.id)
                _process_shape(element, shape)
                if not iterator.next():
                    break
        else:
            for element in model.by_type("IfcProduct"):
                if element.Representation is not None:
                    emit_for_element(element)

    if not parts:
        print("No geometric parts extracted.", file=sys.stderr)
        sys.exit(1)

    # ─── Recentre + uniform scale ──────────────────────────────────
    positions = np.array([p["position"] for p in parts])
    sizes = np.array([p["size"] for p in parts])
    mins = (positions - sizes / 2).min(axis=0)
    maxs = (positions + sizes / 2).max(axis=0)
    centre = (mins + maxs) / 2.0
    extent = maxs - mins
    longest_horizontal = max(extent[0], extent[2])
    scale = TARGET_LENGTH / longest_horizontal if longest_horizontal > 0 else 1.0

    # Drop everything onto the same world: subtract centre, then scale.
    # We keep Y resting at 0 (lowest point on the ground).
    y_lift = -(mins[1] - centre[1]) * scale

    for p in parts:
        p["position"] = [
            (p["position"][0] - centre[0]) * scale,
            (p["position"][1] - centre[1]) * scale + y_lift,
            (p["position"][2] - centre[2]) * scale,
        ]
        p["size"] = [s * scale for s in p["size"]]

    # ─── BOQ sort: group by type, then by source file, then by Y ───
    # gives the explosion a sensible reading order (subgrade items
    # before deck items before rails).
    type_order = {
        "IfcFooting": 0,
        "IfcPile": 1,
        "IfcPier": 2,
        "IfcColumn": 3,
        "IfcWall": 4,
        "IfcSlab": 5,
        "IfcBeam": 6,
        "IfcMember": 7,
        "IfcPlate": 8,
        "IfcCovering": 9,
        "IfcRailing": 10,
        "IfcReinforcingBar": 11,
        "IfcReinforcingMesh": 12,
    }
    parts.sort(
        key=lambda p: (
            type_order.get(p["type"], 99),
            p["source"],
            p["position"][1],
            p["position"][0],
        )
    )
    for i, p in enumerate(parts):
        p["boq"] = i + 1
        p["id"] = i

    # ─── Recompute bounds in world coords post-scale ───────────────
    positions = np.array([p["position"] for p in parts])
    sizes = np.array([p["size"] for p in parts])
    mins = (positions - sizes / 2).min(axis=0)
    maxs = (positions + sizes / 2).max(axis=0)

    out = {
        "partCount": len(parts),
        "bounds": {"min": mins.tolist(), "max": maxs.tolist()},
        "materials": dict(material_counter),
        "types": dict(type_counter.most_common(20)),
        "parts": parts,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, separators=(",", ":")))
    print()
    print(f"Wrote {len(parts)} parts to {OUT_PATH}")
    print(f"  Skipped (no/bad geometry): {skipped}")
    print(f"  Bounds: X [{mins[0]:.1f}..{maxs[0]:.1f}]")
    print(f"          Y [{mins[1]:.1f}..{maxs[1]:.1f}]")
    print(f"          Z [{mins[2]:.1f}..{maxs[2]:.1f}]")
    print(f"  Materials: {dict(material_counter)}")
    print(f"  Top types: {dict(type_counter.most_common(8))}")
    print(f"  File size: {OUT_PATH.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    extract()
