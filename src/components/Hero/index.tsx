"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";

const HEADLINE_LINES: ReadonlyArray<ReadonlyArray<{ word: string; accent?: boolean }>> = [
  [{ word: "We" }, { word: "harmonize" }],
  [{ word: "the parties" }],
  [{ word: "that deliver" }, { word: "infrastructure.", accent: true }],
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ready } = useMotionReady();

  // Slow the video subtly for cinematic feel
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.85;
  }, []);

  // Hero entry timeline + parallax — fires once motion is ready
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const subhead = root.querySelector(`.${CSS.escape(styles.subhead)}`);
      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      const lede = root.querySelector(`.${CSS.escape(styles.lede)}`);
      const ctas = root.querySelector(`.${CSS.escape(styles.ctaWrap)}`);
      const strip = root.querySelector(`.${CSS.escape(styles.strip)}`);

      if (reduce) {
        gsap.set([subhead, lede, ctas, strip].filter(Boolean), { opacity: 1, y: 0 });
        gsap.set(words, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (subhead) tl.to(subhead, { opacity: 1, y: 0, duration: 0.7 }, 0.15);
      if (words.length)
        tl.to(words, { opacity: 1, y: 0, duration: 1.05, stagger: 0.075 }, 0.25);
      if (lede) tl.to(lede, { opacity: 1, y: 0, duration: 0.75 }, 0.95);
      if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.75 }, 1.1);
      if (strip) tl.to(strip, { opacity: 1, duration: 0.6 }, 1.2);

      // Parallax: video shifts ~8% slower than content
      const video = videoRef.current;
      if (video) {
        gsap.to(video, {
          y: "8%",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
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

      <div className={styles.content}>
        <span className={styles.subhead}>
          Information Management · Execution Intelligence · O&amp;M Digital Twin
        </span>

        <h1 className={styles.headline}>
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} className={styles.line}>
              <span>
                {line.map((tok, wi) => (
                  <span
                    key={wi}
                    data-word
                    className={tok.accent ? styles.accent : undefined}
                  >
                    {tok.word}
                    {wi < line.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <p className={styles.lede}>
          A neutral information management practice working between
          owners, designers, and contractors on the country&rsquo;s
          flagship infrastructure programs.
        </p>

        <div className={styles.ctaWrap}>
          <a href="#position" className={styles.btnPrimary} data-cta data-magnetic>
            <span>See the practice</span>
            <span className={styles.arr} aria-hidden="true">
              →
            </span>
          </a>
          <a href="#contact" className={styles.ctaSecondary} data-cursor="Begin">
            Begin a brief
          </a>
        </div>
      </div>

      <div className={styles.strip} aria-hidden="true">
        <span className={styles.stripLabel}>Quebec City · Montreal · Ottawa</span>
        <span className={styles.scroll}>
          Scroll
          <span className={styles.scrollLine} />
        </span>
        <span className={`${styles.stripLabel} ${styles.stripRight}`}>
          Edition 2026 / ISO 19650
        </span>
      </div>
    </section>
  );
}
