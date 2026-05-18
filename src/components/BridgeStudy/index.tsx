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
        // Still reveal the text without motion.
        gsap.set(section.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // Text reveal on the left panel — fires when the section is
      // first approaching the viewport, before the pin engages.
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

      // Desktop: pin + scrub. Section locks at viewport top for the
      // duration of the explosion, then releases. We dispatch a
      // "pin" event so the Nav can suppress its scroll-up reveal
      // while the user is wheeling through the locked canvas.
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

      // Mobile: no pin. The canvas is in flow under the text, the
      // scroll-driven explosion still runs as the user passes by.
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
