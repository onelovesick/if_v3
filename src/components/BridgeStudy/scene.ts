/**
 * Three.js scene controller for BridgeStudy. Owns the renderer,
 * camera, lights, and InstancedMesh-per-material rigging. Accepts a
 * BridgeData object up front so the React component can decide
 * whether to feed it the IFC-extracted data or the synthetic fallback.
 * Camera waypoints are computed from the bridge's own bounding box
 * so swapping models doesn't require hand-tuning.
 */

import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import {
  computeBoqLayout,
  computeMaterialLayout,
  MATERIAL_COLORS,
  MATERIALS,
  type BridgeData,
  type Material,
} from "./bridge";

export type Mode = "boq" | "material";

export interface SceneController {
  setProgress: (p: number) => void;
  setMode: (mode: Mode) => void;
  resize: () => void;
  dispose: () => void;
}

const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

function computeCameraWaypoints(bridge: BridgeData) {
  const center = bridge.bounds.getCenter(new THREE.Vector3());
  const size = bridge.bounds.getSize(new THREE.Vector3());
  const horizontal = Math.max(size.x, size.z, 1);

  // Distance derived loosely from horizontal extent so a 200u or a
  // 300u bridge both end up framed comfortably at the iso pose.
  const isoDist = horizontal * 1.5;

  const camIso = new THREE.Vector3(
    center.x + isoDist * 0.65,
    center.y + Math.max(size.y, horizontal * 0.35) + isoDist * 0.35,
    center.z + isoDist * 0.85,
  );
  const camTop = new THREE.Vector3(0, horizontal * 2.2, 0.001);
  const targetIso = center.clone();
  const targetTop = new THREE.Vector3(0, 0, 0);

  return { camIso, camTop, targetIso, targetTop };
}

export function createScene(
  canvas: HTMLCanvasElement,
  bridge: BridgeData,
): SceneController {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 8000);

  // Lighting: hemisphere fill + key directional + warm rim opposite.
  const hemi = new THREE.HemisphereLight(0xeaf3f8, 0x0b3c5d, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(120, 200, 100);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf4b740, 0.35);
  rim.position.set(-150, 60, -120);
  scene.add(rim);
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  // Bridge data + per-mode layouts.
  const { parts } = bridge;
  const boqMap = computeBoqLayout(parts);
  const matMap = computeMaterialLayout(parts);

  // One InstancedMesh per material; one BoxGeometry shared.
  const baseGeom = new THREE.BoxGeometry(1, 1, 1);
  const meshes = new Map<Material, THREE.InstancedMesh>();
  const slot = new Map<number, { mesh: THREE.InstancedMesh; index: number }>();

  for (const mat of MATERIALS) {
    const matParts = parts.filter((p) => p.material === mat);
    if (matParts.length === 0) continue;

    const isMetal = mat === "cable" || mat === "steel" || mat === "plate";
    const material = new THREE.MeshStandardMaterial({
      color: MATERIAL_COLORS[mat],
      roughness: isMetal ? 0.4 : 0.78,
      metalness: isMetal ? 0.55 : 0.05,
      flatShading: false,
    });

    const mesh = new THREE.InstancedMesh(baseGeom, material, matParts.length);
    mesh.frustumCulled = false;
    matParts.forEach((p, i) => {
      slot.set(p.id, { mesh, index: i });
    });
    scene.add(mesh);
    meshes.set(mat, mesh);
  }

  // Per-part references (no allocations in the hot loop).
  const assembledPos = new Map<number, THREE.Vector3>();
  const assembledQuat = new Map<number, THREE.Quaternion>();
  parts.forEach((p) => {
    assembledPos.set(p.id, p.position.clone());
    assembledQuat.set(p.id, p.quaternion.clone());
  });
  const identityQuat = new THREE.Quaternion();

  const { camIso, camTop, targetIso, targetTop } = computeCameraWaypoints(bridge);

  // React-driven state.
  let scrollP = 0;
  const modeBlend = { val: 0 };
  let modeTween: gsap.core.Tween | null = null;

  // Scratch.
  const sPos = new THREE.Vector3();
  const sQuat = new THREE.Quaternion();
  const sMat = new THREE.Matrix4();
  const camTarget = new THREE.Vector3();

  function updateMatrices() {
    const t = easeInOutQuart(scrollP);
    const blend = modeBlend.val;

    for (const part of parts) {
      const a = assembledPos.get(part.id)!;
      const b = boqMap.get(part.id)!;
      const m = matMap.get(part.id)!;
      const aQ = assembledQuat.get(part.id)!;

      const tx = b.x + (m.x - b.x) * blend;
      const ty = b.y + (m.y - b.y) * blend;
      const tz = b.z + (m.z - b.z) * blend;

      sPos.set(
        a.x + (tx - a.x) * t,
        a.y + (ty - a.y) * t,
        a.z + (tz - a.z) * t,
      );
      sQuat.copy(aQ).slerp(identityQuat, t);
      sMat.compose(sPos, sQuat, part.size);

      const s = slot.get(part.id)!;
      s.mesh.setMatrixAt(s.index, sMat);
    }

    meshes.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  function updateCamera() {
    const t = easeInOutQuart(scrollP);
    camera.position.set(
      camIso.x + (camTop.x - camIso.x) * t,
      camIso.y + (camTop.y - camIso.y) * t,
      camIso.z + (camTop.z - camIso.z) * t,
    );
    camTarget.set(
      targetIso.x + (targetTop.x - targetIso.x) * t,
      targetIso.y + (targetTop.y - targetIso.y) * t,
      targetIso.z + (targetTop.z - targetIso.z) * t,
    );
    camera.lookAt(camTarget);
  }

  let rafId = 0;
  function tick() {
    updateMatrices();
    updateCamera();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  resize();
  tick();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  return {
    setProgress: (p: number) => {
      scrollP = Math.max(0, Math.min(1, p));
    },
    setMode: (mode: Mode) => {
      modeTween?.kill();
      modeTween = gsap.to(modeBlend, {
        val: mode === "boq" ? 0 : 1,
        duration: 0.9,
        ease: "power2.inOut",
      });
    },
    resize,
    dispose: () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      modeTween?.kill();
      meshes.forEach((mesh) => {
        const m = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m.dispose();
      });
      baseGeom.dispose();
      renderer.dispose();
    },
  };
}
