/**
 * Bridge data layer. Primary path loads the Bow River bridge from
 * /models/bridge.glb (985 parts extracted from 12 federated IFC4X3
 * files by tools/ifc-convert/extract_bridge.py). The extractor pulls
 * real triangulated mesh geometry per element, recentres each part on
 * its own centroid, encodes the centroid as the glTF node translation,
 * and stores BOQ + material + IFC metadata in node extras.
 *
 * Falls back to a synthetic generator that builds simple BoxGeometry
 * parts so the scene keeps rendering in dev when the GLB is missing.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const BRIDGE_GLB_URL = "/models/bridge.glb";

export type Material = "concrete" | "steel" | "plate" | "cable" | "rebar";

export interface Part {
  id: number;
  boq: number;
  material: Material;
  type: string;
  /** True triangulated mesh, vertices centred on the part's centroid. */
  geometry: THREE.BufferGeometry;
  /** Assembled-world centroid (where the mesh sits at scrollP = 0). */
  position: THREE.Vector3;
  source?: string;
  guid?: string;
}

export const MATERIALS: Material[] = [
  "concrete",
  "steel",
  "plate",
  "cable",
  "rebar",
];

export const MATERIAL_LABELS: Record<Material, string> = {
  concrete: "Concrete",
  steel: "Structural steel",
  plate: "Steel plate",
  cable: "Stay cables",
  rebar: "Rebar",
};

export const MATERIAL_COLORS: Record<Material, number> = {
  concrete: 0xb8c0c8,
  steel: 0x9aa3ad,
  plate: 0x6b7480,
  cable: 0xdde3ea,
  rebar: 0xd9a356,
};

export interface BridgeData {
  parts: Part[];
  bounds: THREE.Box3;
  source: "ifc" | "synthetic";
}

interface NodeExtras {
  boq?: number;
  material?: Material;
  type?: string;
  source?: string;
  guid?: string;
}

const gltfLoader = new GLTFLoader();

/**
 * Fetch the IFC-extracted GLB. Returns null on failure so the caller
 * can fall back to the synthetic generator.
 */
export async function loadBridge(): Promise<BridgeData | null> {
  try {
    const gltf = await gltfLoader.loadAsync(BRIDGE_GLB_URL);
    const parts: Part[] = [];
    const bounds = new THREE.Box3();

    // Each top-level node in the GLB is one IFC element. GLTFLoader
    // collapses our 1-mesh-no-children nodes directly into Meshes, so
    // the mesh itself carries the translation (.position) and the
    // extras (.userData). Walking obj.parent gives us gltf.scene
    // which has position (0,0,0) and would stack everything at the
    // origin — bug bait. Use obj.getWorldPosition + obj.userData.
    const worldPos = new THREE.Vector3();
    gltf.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      // Walk up the parent chain looking for extras (most nodes have
      // them on the mesh itself, but if GLTFLoader ever wraps a node
      // in an Object3D we still find them).
      let extras: NodeExtras = {};
      let cursor: THREE.Object3D | null = obj;
      while (cursor) {
        const ud = cursor.userData as NodeExtras;
        if (ud && (ud.boq !== undefined || ud.material)) {
          extras = ud;
          break;
        }
        cursor = cursor.parent;
      }

      const material = (extras.material ?? "plate") as Material;
      const id = parts.length;
      const boq = extras.boq ?? id + 1;

      const geometry = obj.geometry as THREE.BufferGeometry;
      geometry.computeVertexNormals();

      obj.getWorldPosition(worldPos);
      const pos = worldPos.clone();

      parts.push({
        id,
        boq,
        material,
        type: extras.type ?? "IfcBuiltElement",
        geometry,
        position: pos,
        source: extras.source,
        guid: extras.guid,
      });

      const localBox = new THREE.Box3().setFromBufferAttribute(
        geometry.getAttribute("position") as THREE.BufferAttribute,
      );
      bounds.expandByPoint(pos.clone().add(localBox.min));
      bounds.expandByPoint(pos.clone().add(localBox.max));
    });

    if (parts.length === 0) return null;
    return { parts, bounds, source: "ifc" };
  } catch (err) {
    if (typeof console !== "undefined") {
      console.warn("[BridgeStudy] GLB load failed, falling back:", err);
    }
    return null;
  }
}

/**
 * Synthetic fallback. Builds a small cable-stayed bridge from
 * BoxGeometry primitives. Used in dev when the GLB hasn't been built
 * yet; the user-facing render is always the IFC GLB in production.
 */
export function generateBridge(): BridgeData {
  const parts: Part[] = [];
  let id = 0;
  let boq = 0;

  const L = 200;
  const W = 14;
  const DECK_Y = 25;
  const PYLON_X1 = L / 3;
  const PYLON_X2 = (2 * L) / 3;
  const SLAB_COUNT = 50;
  const SLAB_LEN = L / SLAB_COUNT;

  const addBox = (
    type: string,
    material: Material,
    position: [number, number, number],
    size: [number, number, number],
    rotation?: THREE.Quaternion,
  ) => {
    const geom = new THREE.BoxGeometry(size[0], size[1], size[2]);
    if (rotation) geom.applyQuaternion(rotation);
    boq += 1;
    parts.push({
      id: id++,
      boq,
      material,
      type,
      geometry: geom,
      position: new THREE.Vector3(...position),
    });
  };

  for (const px of [PYLON_X1, PYLON_X2]) {
    const x = px - L / 2;
    addBox("pier", "concrete", [x, (DECK_Y - 1) / 2, -7], [4, DECK_Y - 1, 4]);
    addBox("pier", "concrete", [x, (DECK_Y - 1) / 2, 7], [4, DECK_Y - 1, 4]);
  }
  for (const ax of [-L / 2 + 5, L / 2 - 5]) {
    addBox(
      "abutment",
      "concrete",
      [ax, (DECK_Y - 1) / 2, 0],
      [6, DECK_Y - 1, W + 4],
    );
  }
  for (const px of [PYLON_X1, PYLON_X2]) {
    const x = px - L / 2;
    addBox("pylon", "concrete", [x, DECK_Y + 14, -7], [3, 28, 3]);
    addBox("pylon", "concrete", [x, DECK_Y + 14, 7], [3, 28, 3]);
  }
  for (let i = 0; i < SLAB_COUNT; i++) {
    const x = -L / 2 + (i + 0.5) * SLAB_LEN;
    addBox("deck", "concrete", [x, DECK_Y, 0], [SLAB_LEN, 1, W]);
  }
  for (const z of [-5, -1.7, 1.7, 5]) {
    for (let i = 0; i < SLAB_COUNT; i++) {
      const x = -L / 2 + (i + 0.5) * SLAB_LEN;
      addBox(
        "stringer",
        "plate",
        [x, DECK_Y - 1, z],
        [SLAB_LEN * 0.95, 0.7, 0.6],
      );
    }
  }
  for (let i = 0; i < SLAB_COUNT; i++) {
    const x = -L / 2 + (i + 0.5) * SLAB_LEN;
    addBox("crossbeam", "steel", [x, DECK_Y - 1.4, 0], [0.5, 0.5, W]);
  }
  const cablesPerSide = 10;
  for (const px of [PYLON_X1, PYLON_X2]) {
    const pylonX = px - L / 2;
    for (const sideZ of [-7, 7]) {
      const top = new THREE.Vector3(pylonX, DECK_Y + 26, sideZ);
      for (let i = 0; i < cablesPerSide; i++) {
        const sign = i % 2 === 0 ? -1 : 1;
        const idx = Math.floor(i / 2) + 1;
        const deckPt = new THREE.Vector3(
          pylonX + sign * idx * 6,
          DECK_Y + 0.5,
          sideZ,
        );
        const mid = top.clone().add(deckPt).multiplyScalar(0.5);
        const dir = deckPt.clone().sub(top);
        const len = dir.length();
        dir.normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir,
        );
        addBox(
          "cable",
          "cable",
          [mid.x, mid.y, mid.z],
          [0.2, len, 0.2],
          q,
        );
      }
    }
  }
  for (const z of [-7, 7]) {
    for (let i = 0; i < SLAB_COUNT; i++) {
      const x = -L / 2 + (i + 0.5) * SLAB_LEN;
      addBox(
        "rail",
        "steel",
        [x, DECK_Y + 1.3, z],
        [SLAB_LEN * 0.95, 0.35, 0.18],
      );
    }
  }
  while (id < 1000) {
    const r = id - 490;
    const slab = r % SLAB_COUNT;
    const col = Math.floor(r / SLAB_COUNT) % 6;
    const layer = Math.floor(r / (SLAB_COUNT * 6));
    const x = -L / 2 + (slab + 0.5) * SLAB_LEN;
    const z = -6 + col * 2.4;
    const y = DECK_Y + (layer === 0 ? 0.3 : -0.3);
    addBox("rebar", "rebar", [x, y, z], [SLAB_LEN * 0.85, 0.08, 0.08]);
  }

  const bounds = new THREE.Box3();
  parts.forEach((p) => {
    const localBox = new THREE.Box3().setFromBufferAttribute(
      p.geometry.getAttribute("position") as THREE.BufferAttribute,
    );
    bounds.expandByPoint(p.position.clone().add(localBox.min));
    bounds.expandByPoint(p.position.clone().add(localBox.max));
  });

  return { parts, bounds, source: "synthetic" };
}

export function computeBoqLayout(parts: Part[]): Map<number, THREE.Vector3> {
  const out = new Map<number, THREE.Vector3>();
  const sorted = [...parts].sort((a, b) => a.boq - b.boq);
  const cols = 25;
  const spacing = 7;
  const rows = Math.ceil(sorted.length / cols);
  sorted.forEach((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    out.set(
      p.id,
      new THREE.Vector3(
        (col - (cols - 1) / 2) * spacing,
        0,
        (row - (rows - 1) / 2) * spacing,
      ),
    );
  });
  return out;
}

export function computeMaterialLayout(
  parts: Part[],
): Map<number, THREE.Vector3> {
  const out = new Map<number, THREE.Vector3>();
  const zones: Record<Material, { x: number; cols: number; spacing: number }> =
    {
      concrete: { x: -120, cols: 8, spacing: 5.5 },
      steel: { x: -60, cols: 12, spacing: 4 },
      plate: { x: 5, cols: 15, spacing: 4 },
      cable: { x: 70, cols: 9, spacing: 4 },
      rebar: { x: 135, cols: 25, spacing: 2.4 },
    };

  const byMat = new Map<Material, Part[]>();
  parts.forEach((p) => {
    if (!byMat.has(p.material)) byMat.set(p.material, []);
    byMat.get(p.material)!.push(p);
  });

  byMat.forEach((items, mat) => {
    const zone = zones[mat];
    const rows = Math.ceil(items.length / zone.cols);
    items.forEach((p, i) => {
      const col = i % zone.cols;
      const row = Math.floor(i / zone.cols);
      out.set(
        p.id,
        new THREE.Vector3(
          zone.x + (col - (zone.cols - 1) / 2) * zone.spacing,
          0,
          (row - (rows - 1) / 2) * zone.spacing,
        ),
      );
    });
  });

  return out;
}
