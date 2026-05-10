"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import Topbar from "./Topbar";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";
const WORDMARK = "Infraforma";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const header = root.querySelector(`.${CSS.escape(styles.headerBar)}`);
    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const tag = root.querySelector(`.${CSS.escape(styles.tagline)}`);
    const foot = root.querySelector(`.${CSS.escape(styles.footStrip)}`);

    if (prefersReducedMotion()) {
      gsap.set([header, tag, foot].filter(Boolean), { opacity: 1, y: 0 });
      gsap.set(letters, { opacity: 1, y: 0 });
      return;
    }

    const ease = "expo.out";
    const tl = gsap.timeline({ defaults: { ease } });

    if (header) tl.to(header, { opacity: 1, duration: 0.55 }, 0.05);

    if (letters.length) {
      tl.to(
        letters,
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.045 },
        0.18,
      );
    }

    if (tag) tl.to(tag, { opacity: 1, y: 0, duration: 0.7 }, 0.85);
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
        aria-label="Infraforma"
      >
        {/* Background video */}
        <video
          className={styles.bgVideo}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* Whitewash overlay — turns video into paper-tinted texture */}
        <div className={styles.whitewash} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        {/* Section running header */}
        <div className={styles.headerBar} aria-hidden="true">
          <span>
            S01 / 12
            <span data-glyph />
            Practice
          </span>
          <span>2026 · Quebec</span>
        </div>

        {/* Centered wordmark + tagline */}
        <div className={styles.main}>
          <h1 className={styles.wordmark} aria-label={WORDMARK}>
            <span aria-hidden="true">
              {WORDMARK.split("").map((ch, i) => (
                <Fragment key={i}>
                  <span data-letter>{ch}</span>
                </Fragment>
              ))}
            </span>
          </h1>

          <p className={styles.tagline}>
            Human-Led, <em>Digitally</em> Enabled.
          </p>
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
