"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import Topbar from "./Topbar";
import styles from "./Hero.module.css";

/**
 * Editorial hero, Swiss-architecture composition. Slogan dominates the
 * left. A polygon-clipped video block cuts in from the right with a hard
 * diagonal edge. The polygon outline strokes itself in on load, then the
 * video fades through. Drop the hero loop at /public/hero-loop.mp4 (or
 * change VIDEO_SRC below) to replace the placeholder backdrop.
 */

// Replace with your hero-loop asset. Webm/mp4. ~6-12s, silent, looping,
// drone or structural detail footage. Until then the polygon shows the
// architectural backdrop pattern from CSS.
const VIDEO_SRC = "/hero-loop.mp4";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const header = root.querySelector(`.${CSS.escape(styles.headerBar)}`);
    const lines = root.querySelectorAll<HTMLElement>("[data-line-inner]");
    const sub = root.querySelector(`.${CSS.escape(styles.subhead)}`);
    const block = root.querySelector(`.${CSS.escape(styles.videoBlock)}`);
    const outline = root.querySelector<SVGElement>(
      `.${CSS.escape(styles.videoOutline)} [data-stroke]`,
    );
    const caption = root.querySelector(`.${CSS.escape(styles.videoCaption)}`);
    const foot = root.querySelector(`.${CSS.escape(styles.footStrip)}`);

    if (prefersReducedMotion()) {
      gsap.set([header, sub, block, caption, foot].filter(Boolean), {
        opacity: 1,
        y: 0,
      });
      gsap.set(lines, { opacity: 1, y: 0 });
      if (outline) gsap.set(outline, { strokeDashoffset: 0 });
      return;
    }

    const ease = "expo.out";
    const tl = gsap.timeline({ defaults: { ease } });

    if (header) tl.to(header, { opacity: 1, duration: 0.55 }, 0.05);

    if (lines.length) {
      tl.to(
        lines,
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.11 },
        0.18,
      );
    }

    if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.7 }, 0.65);

    if (block) tl.to(block, { opacity: 1, duration: 0.9 }, 0.35);
    if (outline) {
      tl.to(
        outline,
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        0.4,
      );
    }
    if (caption) tl.to(caption, { opacity: 1, duration: 0.55 }, 1.1);

    if (foot) tl.to(foot, { opacity: 1, duration: 0.55 }, 1.0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <Topbar />

      <section
        ref={heroRef}
        className={styles.hero}
        aria-label="Infraforma — practice introduction"
      >
        {/* Section running header */}
        <div className={styles.headerBar} aria-hidden="true">
          <span>
            S01 / 12
            <span data-glyph />
            Practice
          </span>
          <span>Infraforma · 2026</span>
        </div>

        <div className={styles.main}>
          <div className={styles.sloganColumn}>
            <h1 className={styles.slogan}>
              <span className={styles.sloganLine}>
                <span data-line-inner>Human-Led,</span>
              </span>
              <span className={styles.sloganLine}>
                <span data-line-inner>
                  <em className={styles.blueWord}>Digitally</em>
                </span>
              </span>
              <span className={styles.sloganLine}>
                <span data-line-inner>Enabled.</span>
              </span>
            </h1>

            <p className={styles.subhead}>
              Projects that open on time. Models that work the day the
              owner gets the keys.
            </p>
          </div>

          {/* Polygon-clipped video block, cuts in from the right */}
          <div className={styles.videoBlock} aria-hidden="true">
            <div className={styles.videoPlaceholder} />

            <video
              className={styles.videoFill}
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />

            {/* Caption inside the block — drawing-set fingerprint */}
            <div className={styles.videoCaption}>
              <b>Loop · 04 / 12</b>
              <span>Field capture · Quebec City</span>
            </div>

            {/* 1px ink outline traces the polygon — the cutting edge */}
            <svg
              className={styles.videoOutline}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon
                data-stroke
                points="28,0 100,0 100,100 0,100"
              />
            </svg>
          </div>
        </div>

        {/* Foot strip */}
        <div className={styles.footStrip}>
          <span className={styles.scrollCue}>
            <span data-tick aria-hidden="true" />
            Scroll
          </span>
          <span className={styles.editorial}>
            A digital delivery <em>practice</em>.
          </span>
        </div>
      </section>
    </>
  );
}
