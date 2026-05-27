"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Parallax.module.css";

/**
 * Parallax bridge section between Solutions and Layers.
 *
 * A tall section (~220vh) carrying one big infrastructure image
 * that parallaxes against the scroll, plus a left-anchored text
 * block that sits sticky in the viewport and descends from near
 * the top of the screen toward the bottom as the user scrolls
 * through this section only. Scoped via ScrollTrigger so the
 * descent locks at the section's own start/end.
 */

export default function Parallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Background parallax: image starts shifted up, ends shifted
      // down, scrubbed to scroll progress.
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Text descends from near the top of the viewport to near
      // the bottom while pinned in place by sticky positioning.
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { yPercent: 0 },
          {
            yPercent: 120,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="field"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="field-title"
    >
      <div className={styles.bgWrap} aria-hidden="true">
        <img
          ref={imgRef}
          src="/parallax-hero.jpg"
          alt=""
          className={styles.bg}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.stickyHost}>
        <div ref={textRef} className={styles.textBlock}>
          <span className={styles.eyebrow}>Field</span>
          <h2 id="field-title" className={styles.title}>
            Where the model meets the ground.
          </h2>
          <p className={styles.body}>
            We keep the digital record honest, kickoff to handover.
          </p>
        </div>
      </div>
    </section>
  );
}
