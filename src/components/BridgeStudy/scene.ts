/**
 * Three.js scene controller for BridgeStudy. Owns the renderer,
 * camera, lights, and InstancedMesh-per-material rigging. Exposes a
 * thin imperative API so the React component just calls setProgress /
 * setMode / resize / dispose.
 */

import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import {
  computeBoqLayout,
  computeMaterialLayout,
  generateBridge,
  MATERIAL_COLORS,
  MATERIALS,
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

export function createScene(canvas: HTMLCanvasElement): SceneController {
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

  // Camera ─ keep FOV mid-tight so the bridge reads as architectural.
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 4000);

  // Lighting ─ hemisphere fill + key directional with soft falloff +
  // a subtle warm rim from the opposite side for dimensional reads.
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

  // Bridge data + layouts.
  const { parts } = generateBridge();
  const boqMap = computeBoqLayout(parts);
  const matMap = computeMaterialLayout(parts);

  // InstancedMesh per material.
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

  // Pre-built per-part references for the render loop.
  const assembledPos = new Map<number, THREE.Vector3>();
  const assembledQuat = new Map<number, THREE.Quaternion>();
  parts.forEach((p) => {
    assembledPos.set(p.id, p.position.clone());
    assembledQuat.set(p.id, p.quaternion.clone());
  });
  const identityQuat = new THREE.Quaternion();

  // Camera waypoints. Iso = looking from front-right-up at deck height.
  // Top = directly above the exploded layout grid centre.
  const camIso = new THREE.Vector3(180, 110, 200);
  const camTop = new THREE.Vector3(0, 360, 0.001);
  const targetIso = new THREE.Vector3(0, 22, 0);
  const targetTop = new THREE.Vector3(0, 0, 0);

  // State driven by React.
  let scrollP = 0;
  const modeBlend = { val: 0 };
  let modeTween: gsap.core.Tween | null = null;

  // Scratch objects ─ avoid allocations in the hot loop.
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

      // Target exploded position blends BOQ -> Material on the
      // explosion plane. The plane sits at y=0 by construction so
      // parts come "down" out of the assembled bridge.
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

  // RAF loop. We always tick (even at scrollP=0) so material toggle
  // tweens are visible without scrolling.
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
