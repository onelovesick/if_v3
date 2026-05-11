"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";

const TAGLINE = ["The", "Digital", "Delivery", "Partner"];
const TAGLINE_ACCENT = "for Complex Infrastructure.";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const frameTL = root.querySelector(`.${CSS.escape(styles.frameTL)}`);
    const frameTR = root.querySelector(`.${CSS.escape(styles.frameTR)}`);
    const eyebrow = root.querySelector(`.${CSS.escape(styles.eyebrow)}`);
    const headlineWords = root.querySelectorAll<HTMLElement>("[data-word='h1']");
    const tagWords = root.querySelectorAll<HTMLElement>("[data-word='tag']");
    const ctas = root.querySelector(`.${CSS.escape(styles.cta)}`);
    const scroll = root.querySelector(`.${CSS.escape(styles.scroll)}`);
    const edge = root.querySelector(`.${CSS.escape(styles.edge)}`);

    if (prefersReducedMotion()) {
      gsap.set(
        [frameTL, frameTR, eyebrow, ctas, scroll, edge].filter(Boolean),
        { opacity: 1, y: 0, scaleY: 1 },
      );
      gsap.set([headlineWords, tagWords].flat(), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (frameTL) tl.to(frameTL, { opacity: 1, duration: 0.9 }, 0.1);
    if (frameTR) tl.to(frameTR, { opacity: 1, duration: 0.9 }, 0.1);
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.9 }, 0.15);

    if (headlineWords.length) {
      tl.to(
        headlineWords,
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.1 },
        0.2,
      );
    }
    if (tagWords.length) {
      tl.to(
        tagWords,
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.07 },
        0.55,
      );
    }

    if (edge) {
      tl.from(
        edge,
        { scaleY: 0, transformOrigin: "top center", duration: 1.2, ease: "power2.inOut" },
        0.5,
      );
    }

    if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.9 }, 1.1);
    if (scroll) tl.to(scroll, { opacity: 1, duration: 1.1 }, 1.0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      data-hero
      className={styles.hero}
      aria-label="Infraforma"
    >
      {/* Layer 1 — Background video */}
      <div className={styles.media}>
        <video
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      {/* Layer 2-4 — Tone, vignette, film-grain noise */}
      <div className={styles.tone} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />

      {/* Blue-tinted vertical edge mark anchoring the lockup column */}
      <div className={styles.edge} aria-hidden="true" />

      {/* 12-col content grid */}
      <div className={styles.content}>
        {/* Top-left: manifesto fingerprint */}
        <div className={`${styles.frame} ${styles.frameTL}`}>
          <span className={styles.frameTitle}>Human-led</span>
          <span className={styles.frameNum}>Digitally enabled</span>
        </div>

        {/* Top-right: edition mark */}
        <div className={`${styles.frame} ${styles.frameTR}`}>
          <span className={styles.frameTitle}>Edition 2026</span>
          <span className={styles.frameNum}>Quebec / North America</span>
        </div>

        {/* Lockup (bottom-left) */}
        <div className={styles.lockup}>
          <span className={styles.eyebrow}>
            <span className={styles.pip} aria-hidden="true" />
            <span>Heavy civil</span>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span>Digitally engineered</span>
          </span>

          <h1 className={styles.h1}>
            <span className={styles.h1Line}>
              <span data-word="h1">Infraforma.</span>
            </span>
          </h1>

          <p className={styles.tagline}>
            {TAGLINE.map((w, i) => (
              <Fragment key={i}>
                <span data-word="tag" className={styles.tagWord}>
                  {w}
                </span>
                {i < TAGLINE.length - 1 ? " " : null}
              </Fragment>
            ))}{" "}
            <span data-word="tag" className={`${styles.tagWord} ${styles.tagAccent}`}>
              {TAGLINE_ACCENT}
            </span>
          </p>

          <div className={styles.cta}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="#capabilities">
              Our process
              <span className={styles.arr} aria-hidden="true" />
            </a>
            <a className={`${styles.btn} ${styles.btnGhost}`} href="#contact">
              Let&rsquo;s start a conversation
              <span className={styles.arr} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Scroll cue (bottom-right) */}
        <div className={styles.scroll} aria-hidden="true">
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </div>
    </section>
  );
}
