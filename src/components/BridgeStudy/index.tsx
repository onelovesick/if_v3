"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import { generateBridge, loadBridge, type BridgeData } from "./bridge";
import {
  createScene,
  type CameraInfo,
  type Mode,
  type SceneController,
} from "./scene";
import styles from "./BridgeStudy.module.css";

const MODE_LABELS: Record<Mode, string> = {
  boq: "By BOQ",
  material: "By material",
};

interface Stats {
  parts: number;
  materials: number;
  source: "ifc" | "synthetic";
}

function isCamDebugRequested(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("cam");
  } catch {
    return false;
  }
}

/**
 * Scrolly-driven 3D study: pinned scene tilts isometric -> top-down
 * while the Bow River Bridge (1072 parts extracted from a 15-IFC
 * federated model) explodes from assembled into a sortable layout.
 * Toggle on the left blends the explosion target between BOQ order
 * and material clusters.
 */
export default function BridgeStudy() {
  const { ready } = useMotionReady();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneController | null>(null);
  const [mode, setMode] = useState<Mode>("boq");
  const [stats, setStats] = useState<Stats | null>(null);
  // ?cam in the URL drops scripted camera + scroll pin and gives the
  // user OrbitControls + a HUD so they can pose the iso start for me.
  const [debugCam] = useState<boolean>(() => isCamDebugRequested());
  const [camInfo, setCamInfo] = useState<CameraInfo | null>(null);

  // Fetch the IFC dataset, then boot the scene. Falls back to the
  // synthetic generator if the JSON isn't available so dev never
  // breaks on a missing asset.
  useEffect(() => {
    if (!canvasRef.current) return;
    let cancelled = false;

    (async () => {
      const fromIfc = await loadBridge();
      const bridge: BridgeData = fromIfc ?? generateBridge();
      if (cancelled || !canvasRef.current) return;

      sceneRef.current = createScene(canvasRef.current, bridge, {
        cameraMode: debugCam ? "orbit" : "scripted",
      });

      const distinctMaterials = new Set(bridge.parts.map((p) => p.material))
        .size;
      setStats({
        parts: bridge.parts.length,
        materials: distinctMaterials,
        source: bridge.source,
      });

      // ScrollTrigger.refresh so the pin recalculates after we mounted
      // the heavier scene asynchronously.
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Drive scene.setProgress from a pinned, scrubbed ScrollTrigger
  // once the loader has lifted and Lenis is active. The section
  // pins when its top hits the viewport top, absorbs ~160% of
  // viewport-height worth of scroll for the choreography, then
  // releases so the user can scroll past.
  // Poll camera info while in debug mode and render it into the HUD.
  useEffect(() => {
    if (!debugCam) return;
    const id = window.setInterval(() => {
      if (sceneRef.current) setCamInfo(sceneRef.current.getCameraInfo());
    }, 100);
    return () => window.clearInterval(id);
  }, [debugCam]);

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    // In debug-cam mode, leave the page scroll-free and the camera
    // user-controlled so they can compose the start pose.
    if (debugCam) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        sceneRef.current?.setProgress(1);
        gsap.set(section.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const emitPin = (active: boolean) => {
          window.dispatchEvent(
            new CustomEvent("infraforma:pin", { detail: { active } }),
          );
        };
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.4,
          onEnter: () => emitPin(true),
          onLeave: () => emitPin(false),
          onEnterBack: () => emitPin(true),
          onLeaveBack: () => emitPin(false),
          onUpdate: (self) => {
            sceneRef.current?.setProgress(self.progress);
          },
        });
        return () => {
          emitPin(false);
          trigger.kill();
        };
      });

      mm.add("(max-width: 1023.99px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
          onUpdate: (self) => {
            sceneRef.current?.setProgress(self.progress);
          },
        });
        return () => trigger.kill();
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, debugCam]);

  useEffect(() => {
    sceneRef.current?.setMode(mode);
  }, [mode]);

  // Stat display values — fall back to the synthetic counts until
  // the fetch resolves so the layout doesn't shift.
  const statParts = stats?.parts ?? 1072;
  const statMats = stats?.materials ?? 3;
  const statSource =
    stats?.source === "ifc"
      ? "Bow River · IFC4X3"
      : stats?.source === "synthetic"
        ? "IFC · synthetic"
        : "Loading…";

  return (
    <section
      ref={sectionRef}
      id="model"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="bridge-study-title"
    >
      <div className={styles.grid}>
        {/* LEFT — title top, body + controls bottom */}
        <div className={styles.text}>
          <div data-reveal className={styles.textTop}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowMark} /> 03 · Model study
            </span>
            <h2 id="bridge-study-title" className={styles.title}>
              The federated model that turns 1,000+ parts into a
              <em> single source of truth.</em>
            </h2>
          </div>

          <div data-reveal className={styles.textBottom}>
            <p className={styles.body}>
              Every part of the bridge carries the data behind it: who
              owns it, what it costs, when it ships, how it gets built.
              Tilt the model, and the assembly reorganises by the
              question you ask.
            </p>

            <div className={styles.toggles} role="group" aria-label="Sort by">
              {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={styles.toggleBtn}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>

            <dl className={styles.meta}>
              <div>
                <dt>Parts</dt>
                <dd>{statParts.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{statSource}</dd>
              </div>
              <div>
                <dt>Materials</dt>
                <dd>{statMats}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* RIGHT — pinned 3D canvas + drawing stamp */}
        <div className={styles.canvasCol}>
          <div className={styles.canvasWrap}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.canvasFrame} aria-hidden="true">
              <div className={styles.stampGlyph}>
                <span className={styles.stampGlyphInner} />
              </div>
              <dl className={styles.stampTable}>
                <dt>Drawing</dt>
                <dd>Bow River · Federated study</dd>
                <dt>Format</dt>
                <dd>IFC4X3 · LOD 300</dd>
                <dt>Parts</dt>
                <dd>{statParts.toLocaleString()}</dd>
              </dl>
            </div>
            {debugCam && camInfo && (
              <div className={styles.camHud}>
                <div className={styles.camHudHeader}>
                  <span>CAM · orbit</span>
                  <button
                    type="button"
                    className={styles.camHudCopy}
                    onClick={() => {
                      const text = `position: ${JSON.stringify(camInfo.position)}\ntarget:   ${JSON.stringify(camInfo.target)}\nfov:      ${camInfo.fov}\ndistance: ${camInfo.distance}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(text).catch(() => {});
                      }
                    }}
                  >
                    Copy
                  </button>
                </div>
                <dl className={styles.camHudList}>
                  <dt>pos</dt>
                  <dd>{camInfo.position.join(", ")}</dd>
                  <dt>tgt</dt>
                  <dd>{camInfo.target.join(", ")}</dd>
                  <dt>dist</dt>
                  <dd>{camInfo.distance}</dd>
                  <dt>fov</dt>
                  <dd>{camInfo.fov}</dd>
                </dl>
                <p className={styles.camHudHint}>
                  drag · rotate · scroll · zoom · right-drag · pan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
