"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import { generateBridge, loadBridge, type BridgeData } from "./bridge";
import { createScene, type Mode, type SceneController } from "./scene";
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

      sceneRef.current = createScene(canvasRef.current, bridge);

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
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
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
  }, [ready]);

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
        {/* LEFT — narrative + toggles */}
        <div className={styles.text}>
          <div className={styles.textInner}>
            <span data-reveal className={styles.eyebrow}>
              <span className={styles.eyebrowMark} /> 03 · Model study
            </span>
            <h2
              id="bridge-study-title"
              data-reveal
              className={styles.title}
            >
              One model. <em>A thousand questions answered.</em>
            </h2>
            <p data-reveal className={styles.body}>
              Every part of the bridge carries the data behind it: who
              owns it, what it costs, when it ships, how it gets built.
              Tilt the model, and the assembly reorganises by the
              question you ask.
            </p>

            <div data-reveal className={styles.toggles} role="group" aria-label="Sort by">
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

            <dl data-reveal className={styles.meta}>
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

        {/* RIGHT — pinned 3D canvas */}
        <div className={styles.canvasCol}>
          <div className={styles.canvasWrap}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.canvasFrame} aria-hidden="true">
              <span className={styles.frameLabel}>
                <span className={styles.frameDot} />
                Bow River bridge · federated study
              </span>
              <span className={styles.frameCoord}>
                LOD 300 · IFC4X3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
