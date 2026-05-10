"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";
const WORDMARK = "Infraforma";

/**
 * Hero — full-bleed background video washed white, with the brand
 * wordmark as the dominant typographic moment, the slogan and value
 * prop centered below, and an editorial about block anchored to the
 * bottom-left corner. On mobile, the about block flows below the
 * centered stack.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const tag = root.querySelector(`.${CSS.escape(styles.tagline)}`);
    const value = root.querySelector(`.${CSS.escape(styles.valueProp)}`);
    const about = root.querySelector(`.${CSS.escape(styles.aboutBlock)}`);

    if (prefersReducedMotion()) {
      gsap.set([tag, value, about].filter(Boolean), { opacity: 1, y: 0 });
      gsap.set(letters, { opacity: 1, y: 0 });
      return;
    }

    const ease = "expo.out";
    const tl = gsap.timeline({ defaults: { ease } });

    if (letters.length) {
      tl.to(
        letters,
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.045 },
        0.18,
      );
    }

    if (tag) tl.to(tag, { opacity: 1, y: 0, duration: 0.7 }, 0.85);
    if (value) tl.to(value, { opacity: 1, y: 0, duration: 0.7 }, 1.0);
    if (about) tl.to(about, { opacity: 1, y: 0, duration: 0.8 }, 1.2);

    return () => {
      tl.kill();
    };
  }, []);

  return (
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

      {/* Centered wordmark + slogan + value prop */}
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

        <p className={styles.valueProp}>
          We&rsquo;re how heavy civil mega-projects open on time.
        </p>
      </div>

      {/* About block — bottom-left corner on desktop, flows below on mobile */}
      <aside className={styles.aboutBlock}>
        <span className={styles.aboutLabel}>About</span>
        <p className={styles.aboutText}>
          Infraforma gives infrastructure teams the structure they need
          to deliver with confidence. We help owners, designers,
          builders, and delivery teams turn scattered project
          information into clear, connected workflows, making it easier
          to coordinate decisions, track requirements, manage
          compliance, and carry reliable information from design
          through construction and handover.
        </p>
      </aside>
    </section>
  );
}
