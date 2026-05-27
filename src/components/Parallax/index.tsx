"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Parallax.module.css";

/**
 * Parallax bridge section between Solutions and Layers.
 *
 * One viewport tall (100vh). Full-bleed photo with a subtle
 * parallax. One left-anchored title that spans the section
 * width, descends with scroll, and stops just short of the
 * section bottom so a margin of image is always visible below.
 */

export default function Parallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Background parallax: subtle vertical drift behind the
      // title, scrubbed across the section's scroll range.
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
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

      // Title descends with scroll: starts near the top of the
      // section, ends short of the bottom (leaving an image
      // margin below). Computed in JS so the end position
      // always respects the title's measured height.
      if (titleRef.current) {
        const computeDescent = () => {
          const sectionH = section.offsetHeight;
          const titleH = titleRef.current!.offsetHeight;
          // 12vh top padding + 12vh bottom padding, title fills
          // the rest of the descent travel.
          const padTop = sectionH * 0.12;
          const padBottom = sectionH * 0.12;
          return Math.max(0, sectionH - padTop - padBottom - titleH);
        };

        gsap.fromTo(
          titleRef.current,
          { y: 0 },
          {
            y: computeDescent,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
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
        <h2 ref={titleRef} id="field-title" className={styles.title}>
          Where the model meets the ground.
        </h2>
      </div>
    </section>
  );
}
