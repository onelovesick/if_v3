"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./ConstructionScene.module.css";

type StreamMarker = {
  curve: THREE.CatmullRomCurve3;
  marker: THREE.Mesh;
  speed: number;
  offset: number;
};

function setMaterialOpacity(
  material: THREE.Material | THREE.Material[],
  opacity: number,
) {
  const materials = Array.isArray(material) ? material : [material];

  materials.forEach((entry) => {
    entry.transparent = true;
    entry.opacity = opacity;
  });
}

function createTower({
  width,
  depth,
  levels,
  floorHeight,
  x,
  z,
  color,
}: {
  width: number;
  depth: number;
  levels: number;
  floorHeight: number;
  x: number;
  z: number;
  color: THREE.ColorRepresentation;
}) {
  const group = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.52,
  });

  for (let level = 0; level <= levels; level += 1) {
    const floorEdges = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(width, 0.08, depth),
      15,
    );
    const floor = new THREE.LineSegments(floorEdges, lineMaterial.clone());
    floor.position.y = level * floorHeight;
    group.add(floor);
  }

  const corners = [
    new THREE.Vector3(-width / 2, 0, -depth / 2),
    new THREE.Vector3(width / 2, 0, -depth / 2),
    new THREE.Vector3(width / 2, 0, depth / 2),
    new THREE.Vector3(-width / 2, 0, depth / 2),
  ];

  corners.forEach((corner) => {
    const columnGeometry = new THREE.BufferGeometry().setFromPoints([
      corner,
      new THREE.Vector3(corner.x, levels * floorHeight, corner.z),
    ]);
    const column = new THREE.Line(columnGeometry, lineMaterial.clone());
    group.add(column);
  });

  group.position.set(x, -1.45, z);
  return group;
}

function createConnector(
  points: THREE.Vector3[],
  color: THREE.ColorRepresentation,
) {
  const curve = new THREE.CatmullRomCurve3(points);
  const pathGeometry = new THREE.BufferGeometry().setFromPoints(
    curve.getPoints(120),
  );

  const path = new THREE.Line(
    pathGeometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.45,
    }),
  );

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
    }),
  );

  return {
    curve,
    path,
    marker,
  };
}

function createParticleField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const warm = new THREE.Color("#f4c98b");
  const cool = new THREE.Color("#74d9ff");
  const mix = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = 4 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 11;

    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2.2;
    const y = height;
    const z = Math.sin(angle) * radius * 0.8;

    positions[stride] = x;
    positions[stride + 1] = y;
    positions[stride + 2] = z;

    basePositions[stride] = x;
    basePositions[stride + 1] = y;
    basePositions[stride + 2] = z;

    mix.copy(cool).lerp(warm, Math.random() * 0.45);
    colors[stride] = mix.r;
    colors[stride + 1] = mix.g;
    colors[stride + 2] = mix.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    transparent: true,
    opacity: 0.92,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  return {
    basePositions,
    field: new THREE.Points(geometry, material),
  };
}

export default function ConstructionScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: !prefersReducedMotion,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07111f, 0.07);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 1.9, 8.5);

    const ambientLight = new THREE.AmbientLight(0xb7d8ff, 0.5);
    const coolLight = new THREE.PointLight(0x79dfff, 14, 28, 2);
    const warmLight = new THREE.PointLight(0xf4c98b, 10, 24, 2);
    const rimLight = new THREE.DirectionalLight(0xdaf4ff, 1.35);

    coolLight.position.set(5.5, 6.5, 5.5);
    warmLight.position.set(-5, 1.5, 4);
    rimLight.position.set(0, 4, -6);

    scene.add(ambientLight, coolLight, warmLight, rimLight);

    const root = new THREE.Group();
    scene.add(root);

    const grid = new THREE.GridHelper(34, 30, 0x2b8aa5, 0x11283c);
    setMaterialOpacity(grid.material, 0.2);
    grid.position.y = -2.35;
    grid.rotation.x = Math.PI * 0.02;
    root.add(grid);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.5, 0.04, 16, 120),
      new THREE.MeshBasicMaterial({
        color: "#15374b",
        transparent: true,
        opacity: 0.35,
      }),
    );
    ring.position.set(0.9, 1.15, -1.2);
    ring.rotation.x = Math.PI / 2.35;
    root.add(ring);

    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 1),
      new THREE.MeshBasicMaterial({
        color: "#15374b",
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
    );
    sphere.position.set(-3.8, 2.4, -1.6);
    root.add(sphere);

    const mainTower = createTower({
      width: 3.7,
      depth: 2.3,
      levels: 7,
      floorHeight: 0.72,
      x: -0.4,
      z: 0.1,
      color: "#8fe5ff",
    });
    const sideTower = createTower({
      width: 1.7,
      depth: 1.6,
      levels: 5,
      floorHeight: 0.72,
      x: 2.4,
      z: -0.3,
      color: "#f4c98b",
    });

    const bridgeGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.45, 1.44, -0.7),
      new THREE.Vector3(2.4, 1.8, -0.3),
      new THREE.Vector3(3.2, 2.16, 0.1),
    ]);
    const bridge = new THREE.Line(
      bridgeGeometry,
      new THREE.LineBasicMaterial({
        color: "#81d7ff",
        transparent: true,
        opacity: 0.45,
      }),
    );

    root.add(mainTower, sideTower, bridge);

    const streamDefinitions = [
      createConnector(
        [
          new THREE.Vector3(-4.8, -1.7, 2.5),
          new THREE.Vector3(-1.8, 0.5, 1.5),
          new THREE.Vector3(1.2, 1.8, 0.3),
          new THREE.Vector3(4.6, 2.8, -1.4),
        ],
        "#31cfff",
      ),
      createConnector(
        [
          new THREE.Vector3(-5.4, 2.2, -2.2),
          new THREE.Vector3(-2.2, 3.5, -1.2),
          new THREE.Vector3(1.5, 3.2, -0.5),
          new THREE.Vector3(5.1, 1.4, 1.4),
        ],
        "#f4c98b",
      ),
      createConnector(
        [
          new THREE.Vector3(-4.2, -0.8, -2.8),
          new THREE.Vector3(-1.5, -0.1, -1.4),
          new THREE.Vector3(1.3, 0.8, -0.3),
          new THREE.Vector3(4.7, 0.1, 1.9),
        ],
        "#8fe5ff",
      ),
    ];

    const streamMarkers: StreamMarker[] = streamDefinitions.map(
      ({ curve, path, marker }, index) => {
        root.add(path, marker);
        return {
          curve,
          marker,
          speed: 0.04 + index * 0.013,
          offset: index * 0.24,
        };
      },
    );

    const { basePositions, field } = createParticleField(
      prefersReducedMotion ? 520 : 1250,
    );
    root.add(field);

    let frame = 0;
    let scrollTarget = 0;
    let scrollProgress = 0;
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointer = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const positionAttribute = field.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const handleResize = () => {
      if (!mount) {
        return;
      }

      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    handleScroll();

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    const animate = () => {
      frame = window.requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      pointer.lerp(pointerTarget, prefersReducedMotion ? 0.025 : 0.06);
      scrollProgress += (scrollTarget - scrollProgress) * 0.045;

      root.rotation.y +=
        (-0.24 + scrollProgress * 1.08 + pointer.x * 0.18 - root.rotation.y) *
        0.035;
      root.rotation.x +=
        (0.06 + pointer.y * 0.08 - root.rotation.x) * 0.03;
      root.position.y += (-0.45 + scrollProgress * 3.4 - root.position.y) * 0.03;

      camera.position.x += (pointer.x * 0.85 - camera.position.x) * 0.025;
      camera.position.y +=
        (1.9 + scrollProgress * 1.7 + pointer.y * 0.4 - camera.position.y) *
        0.03;
      camera.position.z += (8.5 - scrollProgress * 1.25 - camera.position.z) * 0.03;
      camera.lookAt(pointer.x * 0.7, 0.8 + scrollProgress * 1.2, 0);

      ring.rotation.z = elapsed * 0.11;
      sphere.rotation.x = elapsed * 0.15;
      sphere.rotation.y = elapsed * 0.12;
      grid.rotation.z = elapsed * 0.018;

      streamMarkers.forEach(({ curve, marker, speed, offset }, index) => {
        const t = (elapsed * speed + offset + scrollProgress * 0.12) % 1;
        marker.position.copy(curve.getPointAt(t));
        marker.scale.setScalar(1 + Math.sin(elapsed * 2 + index) * 0.12);
      });

      for (let index = 0; index < positionAttribute.count; index += 1) {
        const stride = index * 3;
        const baseX = basePositions[stride];
        const baseY = basePositions[stride + 1];
        const baseZ = basePositions[stride + 2];

        positionAttribute.array[stride] =
          baseX + Math.sin(elapsed * 0.35 + baseY * 0.4) * 0.035;
        positionAttribute.array[stride + 1] =
          baseY +
          Math.cos(elapsed * 0.4 + baseX * 0.22 + baseZ * 0.17) * 0.055 +
          scrollProgress * 0.32;
        positionAttribute.array[stride + 2] =
          baseZ + Math.sin(elapsed * 0.28 + baseX * 0.18) * 0.03;
      }

      positionAttribute.needsUpdate = true;
      field.rotation.y = elapsed * 0.02;
      field.rotation.x = elapsed * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.LineSegments ||
          object instanceof THREE.Points
        ) {
          object.geometry.dispose();

          const material = Array.isArray(object.material)
            ? object.material
            : [object.material];

          material.forEach((entry) => entry.dispose());
        }
      });

      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.mount} aria-hidden="true" />;
}
