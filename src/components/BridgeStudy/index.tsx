"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import { createScene, type Mode, type SceneController } from "./scene";
import styles from "./BridgeStudy.module.css";

const MODE_LABELS: Record<Mode, string> = {
  boq: "By BOQ",
  material: "By material",
};

/**
 * Scrolly-driven 3D study: pinned scene tilts isometric -> top-down
 * while a synthetic 1000-part cable-stayed bridge explodes from the
 * assembled state into a sortable layout. Toggle on the left panel
 * blends the explosion target between BOQ order and material clusters.
 *
 * Swap point for real IFC: replace generateBridge() in ./bridge with
 * a glTF loader that emits the same Part[] shape (BOQ + material on
 * each mesh's `extras`).
 */
export default function BridgeStudy() {
  const { ready } = useMotionReady();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneController | null>(null);
  const [mode, setMode] = useState<Mode>("boq");

  // Boot the Three.js scene once the canvas is mounted.
  useEffect(() => {
    if (!canvasRef.current) return;
    sceneRef.current = createScene(canvasRef.current);
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Drive scene.setProgress from a scrubbed ScrollTrigger once the
  // loader has lifted and Lenis is active.
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        sceneRef.current?.setProgress(1);
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          sceneRef.current?.setProgress(self.progress);
        },
      });

      // Text reveal on the left panel.
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

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Push mode changes to the scene.
  useEffect(() => {
    sceneRef.current?.setMode(mode);
  }, [mode]);

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
              <span className={styles.eyebrowMark} /> 05 · Model study
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
                <dd>1,000</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>IFC · synthetic</dd>
              </div>
              <div>
                <dt>Materials</dt>
                <dd>5</dd>
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
                Cable-stayed bridge / study A
              </span>
              <span className={styles.frameCoord}>
                LOD 300 · IFC4
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
