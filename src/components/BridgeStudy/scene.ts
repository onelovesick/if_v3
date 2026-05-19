/**
 * Three.js scene controller for BridgeStudy. Renders one Mesh per IFC
 * part with the real triangulated geometry shipped in bridge.glb.
 * Materials are shared per category (one MeshStandardMaterial reused
 * across all "concrete" parts, etc.) to keep state-changes minimal.
 *
 * Camera waypoints are derived from the bridge's own bounding box so
 * swapping models doesn't require hand-tuning.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
export type CameraMode = "scripted" | "orbit";

export interface CameraInfo {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  distance: number;
}

export interface SceneOptions {
  cameraMode?: CameraMode;
}

export interface SceneController {
  setProgress: (p: number) => void;
  setMode: (mode: Mode) => void;
  resize: () => void;
  dispose: () => void;
  getCameraInfo: () => CameraInfo;
}

const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

function computeCameraWaypoints(bridge: BridgeData) {
  const center = bridge.bounds.getCenter(new THREE.Vector3());
  const size = bridge.bounds.getSize(new THREE.Vector3());
  const horizontal = Math.max(size.x, size.z, 1);

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
  options: SceneOptions = {},
): SceneController {
  const cameraMode: CameraMode = options.cameraMode ?? "scripted";
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

  const { parts } = bridge;
  const boqMap = computeBoqLayout(parts);
  const matMap = computeMaterialLayout(parts);

  // Shared materials, one per category. Every part with the same
  // `material` field references the same THREE.Material instance.
  const materials = new Map<Material, THREE.MeshStandardMaterial>();
  for (const mat of MATERIALS) {
    const isMetal = mat === "cable" || mat === "steel" || mat === "plate";
    materials.set(
      mat,
      new THREE.MeshStandardMaterial({
        color: MATERIAL_COLORS[mat],
        roughness: isMetal ? 0.4 : 0.78,
        metalness: isMetal ? 0.55 : 0.05,
        flatShading: false,
      }),
    );
  }

  // One Mesh per part. Geometry is the real triangulated IFC mesh,
  // already centred on its own centroid by the extractor. The mesh's
  // position carries the assembled-world centroid; we lerp it
  // towards the exploded slot as scrollP advances.
  const meshes = new Map<number, THREE.Mesh>();
  const assembledPos = new Map<number, THREE.Vector3>();

  for (const part of parts) {
    const material = materials.get(part.material) ?? materials.get("plate")!;
    const mesh = new THREE.Mesh(part.geometry, material);
    mesh.frustumCulled = false; // parts travel far during explosion
    mesh.position.copy(part.position);
    scene.add(mesh);
    meshes.set(part.id, mesh);
    assembledPos.set(part.id, part.position.clone());
  }

  const { camIso, camTop, targetIso, targetTop } = computeCameraWaypoints(
    bridge,
  );

  let scrollP = 0;
  const modeBlend = { val: 0 };
  let modeTween: gsap.core.Tween | null = null;

  const camTarget = new THREE.Vector3();

  // Orbit-mode wiring: drop the user at the scripted iso pose, then
  // let them drag/scroll/right-drag to compose the shot they want.
  // tick() reads from controls.target instead of the scripted path.
  let controls: OrbitControls | null = null;
  if (cameraMode === "orbit") {
    camera.position.copy(camIso);
    camera.lookAt(targetIso);
    controls = new OrbitControls(camera, canvas);
    controls.target.copy(targetIso);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 4000;
    controls.update();
  }

  function updateMatrices() {
    const t = easeInOutQuart(scrollP);
    const blend = modeBlend.val;

    for (const part of parts) {
      const a = assembledPos.get(part.id)!;
      const b = boqMap.get(part.id)!;
      const m = matMap.get(part.id)!;
      const mesh = meshes.get(part.id)!;

      const tx = b.x + (m.x - b.x) * blend;
      const ty = b.y + (m.y - b.y) * blend;
      const tz = b.z + (m.z - b.z) * blend;

      mesh.position.set(
        a.x + (tx - a.x) * t,
        a.y + (ty - a.y) * t,
        a.z + (tz - a.z) * t,
      );
    }
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
    if (cameraMode === "scripted") {
      updateCamera();
    } else if (controls) {
      controls.update();
    }
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
      controls?.dispose();
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    },
    getCameraInfo: (): CameraInfo => {
      const tgt = controls
        ? controls.target
        : cameraMode === "scripted"
          ? camTarget
          : targetIso;
      const dist = camera.position.distanceTo(tgt);
      return {
        position: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2)),
        ],
        target: [
          Number(tgt.x.toFixed(2)),
          Number(tgt.y.toFixed(2)),
          Number(tgt.z.toFixed(2)),
        ],
        fov: camera.fov,
        distance: Number(dist.toFixed(2)),
      };
    },
  };
}
