"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";

const HEADLINE_LINES: ReadonlyArray<ReadonlyArray<{ word: string }>> = [
  [{ word: "The intelligence layer" }],
  [{ word: "behind infrastructure delivery." }],
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.85;
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      const headline = root.querySelector(`.${CSS.escape(styles.headline)}`);

      if (reduce) {
        gsap.set([words, headline], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Whole headline: subtle zoom-up as it appears (start slightly larger
      // and shifted down, settle into final). This is the "bump down,
      // zoom up" feel.
      if (headline) {
        tl.fromTo(
          headline,
          { scale: 1.06, y: 18 },
          { scale: 1, y: 0, duration: 1.6, ease: "expo.out" },
          0.1,
        );
      }

      // Per-word slide-up + tiny scale settle, staggered into the headline
      // zoom so it reads as one move.
      if (words.length) {
        tl.fromTo(
          words,
          { opacity: 0, y: "60%", scale: 1.04 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: 0.14, ease: "expo.out" },
          0.2,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-section
      data-tone="dark"
      data-dark
      className={styles.hero}
      aria-label="Infraforma"
    >
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.bloom} aria-hidden="true" />
      <div className={styles.heroGrain} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.headline}>
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} className={styles.line}>
              <span>
                {line.map((tok, wi) => (
                  <span key={wi} data-word>
                    {tok.word}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
