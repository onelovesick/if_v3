/**
 * Bridge data layer. Primary path loads the Bow River bridge from
 * /models/bridge.json (1072 parts extracted from 15 federated IFC4X3
 * files by tools/ifc-convert/extract_bridge.py). Falls back to a
 * synthetic cable-stayed bridge generator if the JSON fetch fails so
 * the scene keeps rendering in dev when the asset is missing.
 *
 * Each part is represented as an oriented bounding box (position +
 * size + quaternion + material). Geometry detail is intentionally
 * coarse — the scene's job is to show 1000+ countable, sortable
 * parts exploding, not photoreal lighting.
 */

import * as THREE from "three";

export const BRIDGE_JSON_URL = "/models/bridge.json";

export type Material = "concrete" | "steel" | "plate" | "cable" | "rebar";

export interface Part {
  id: number;
  boq: number;
  material: Material;
  type: string;
  position: THREE.Vector3;
  size: THREE.Vector3;
  quaternion: THREE.Quaternion;
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

// Colours chosen to read on a deep-navy background. Metals get a
// slight cool tilt, rebar gets warm amber so it pops in the cluster
// view.
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

interface SerializedPart {
  id: number;
  boq: number;
  material: Material;
  type: string;
  position: [number, number, number];
  size: [number, number, number];
  quaternion: [number, number, number, number];
  guid?: string;
  source?: string;
}

interface SerializedBridge {
  partCount: number;
  bounds: { min: [number, number, number]; max: [number, number, number] };
  parts: SerializedPart[];
}

/**
 * Fetch the IFC-extracted bridge JSON. Returns null on failure so
 * the caller can fall back to the synthetic generator.
 */
export async function loadBridge(): Promise<BridgeData | null> {
  try {
    // No-store so iterating on the extractor + redeploy always serves
    // a fresh bridge.json instead of the browser-cached version.
    const res = await fetch(BRIDGE_JSON_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as SerializedBridge;
    if (!Array.isArray(data.parts) || data.parts.length === 0) return null;

    const parts: Part[] = data.parts.map((p) => ({
      id: p.id,
      boq: p.boq,
      material: p.material,
      type: p.type,
      position: new THREE.Vector3(...p.position),
      size: new THREE.Vector3(...p.size),
      quaternion: new THREE.Quaternion(
        p.quaternion[0],
        p.quaternion[1],
        p.quaternion[2],
        p.quaternion[3],
      ),
    }));

    const bounds = new THREE.Box3(
      new THREE.Vector3(...data.bounds.min),
      new THREE.Vector3(...data.bounds.max),
    );

    return { parts, bounds, source: "ifc" };
  } catch {
    return null;
  }
}

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

  const identity = new THREE.Quaternion();

  const addBox = (
    type: string,
    material: Material,
    position: [number, number, number],
    size: [number, number, number],
    quaternion: THREE.Quaternion = identity,
  ) => {
    boq += 1;
    parts.push({
      id: id++,
      boq,
      material,
      type,
      position: new THREE.Vector3(...position),
      size: new THREE.Vector3(...size),
      quaternion: quaternion.clone(),
    });
  };

  // 1) Substructure ─ piers (4) + abutments (2)
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

  // 2) Pylons (4) ─ two at each pylon station, on each side of deck
  for (const px of [PYLON_X1, PYLON_X2]) {
    const x = px - L / 2;
    addBox("pylon", "concrete", [x, DECK_Y + 14, -7], [3, 28, 3]);
    addBox("pylon", "concrete", [x, DECK_Y + 14, 7], [3, 28, 3]);
  }

  // 3) Deck slabs (50)
  for (let i = 0; i < SLAB_COUNT; i++) {
    const x = -L / 2 + (i + 0.5) * SLAB_LEN;
    addBox("deck", "concrete", [x, DECK_Y, 0], [SLAB_LEN, 1, W]);
  }

  // 4) Stringers (4 × 50 = 200) ─ under-deck longitudinal beams
  const stringerZs = [-5, -1.7, 1.7, 5];
  for (const z of stringerZs) {
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

  // 5) Cross beams (50)
  for (let i = 0; i < SLAB_COUNT; i++) {
    const x = -L / 2 + (i + 0.5) * SLAB_LEN;
    addBox("crossbeam", "steel", [x, DECK_Y - 1.4, 0], [0.5, 0.5, W]);
  }

  // 6) Cables (80) ─ 20 per pylon (10 per side), fanning out along deck
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

  // 7) Rails (100 = 50 each side)
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

  // 8) Rebar — fill the remaining slots up to exactly 1000.
  // Distributed inside the deck volume and the piers/pylons.
  while (id < 1000) {
    const r = id - 490; // first rebar index
    const slab = r % SLAB_COUNT;
    const col = Math.floor(r / SLAB_COUNT) % 6;
    const layer = Math.floor(r / (SLAB_COUNT * 6));
    const x = -L / 2 + (slab + 0.5) * SLAB_LEN;
    const z = -6 + col * 2.4;
    const y = DECK_Y + (layer === 0 ? 0.3 : -0.3);
    addBox(
      "rebar",
      "rebar",
      [x, y, z],
      [SLAB_LEN * 0.85, 0.08, 0.08],
    );
  }

  // Bounding box for camera framing.
  const bounds = new THREE.Box3();
  parts.forEach((p) => {
    const half = p.size.clone().multiplyScalar(0.5);
    bounds.expandByPoint(p.position.clone().sub(half));
    bounds.expandByPoint(p.position.clone().add(half));
  });

  return { parts, bounds, source: "synthetic" };
}

/**
 * BOQ explosion layout: parts sorted by their BOQ number, laid out in
 * a grid below the assembled bridge so the user reads it like an
 * estimator's schedule.
 */
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

/**
 * Material explosion layout: parts cluster by material, each material
 * gets its own zone laid out along X with its own grid.
 */
export function computeMaterialLayout(
  parts: Part[],
): Map<number, THREE.Vector3> {
  const out = new Map<number, THREE.Vector3>();
  const zones: Record<Material, { x: number; cols: number; spacing: number }> = {
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
