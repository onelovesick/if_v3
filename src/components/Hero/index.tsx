"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";
const WORDMARK = "Infraforma";

/**
 * Hero — full-bleed video washed white. Composition is an asymmetric
 * editorial spread: title column on the left (wordmark, slogan, value
 * prop), a vertical hairline divider, body column on the right
 * (About label + positioning paragraph). Both columns vertically
 * centered. On mobile they stack with a horizontal divider between.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const tag = root.querySelector(`.${CSS.escape(styles.tagline)}`);
    const value = root.querySelector(`.${CSS.escape(styles.valueProp)}`);
    const divider = root.querySelector(`.${CSS.escape(styles.divider)}`);
    const bodyHead = root.querySelector(`.${CSS.escape(styles.aboutLabel)}`);
    const bodyText = root.querySelector(`.${CSS.escape(styles.aboutText)}`);

    if (prefersReducedMotion()) {
      gsap.set([tag, value, divider, bodyHead, bodyText].filter(Boolean), {
        opacity: 1,
        y: 0,
        scaleY: 1,
        scaleX: 1,
      });
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

    if (tag) tl.to(tag, { opacity: 1, y: 0, duration: 0.7 }, 0.75);
    if (value) tl.to(value, { opacity: 1, y: 0, duration: 0.7 }, 0.9);

    if (divider) {
      tl.from(
        divider,
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.5,
      );
    }

    if (bodyHead) tl.to(bodyHead, { opacity: 1, y: 0, duration: 0.55 }, 1.0);
    if (bodyText) tl.to(bodyText, { opacity: 1, y: 0, duration: 0.85 }, 1.15);

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

      {/* Whitewash + grain */}
      <div className={styles.whitewash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* Editorial spread: title column | divider | body column */}
      <div className={styles.spread}>
        <div className={styles.titleColumn}>
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

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.bodyColumn}>
          <span className={styles.aboutLabel}>About the Practice</span>
          <p className={styles.aboutText}>
            Infraforma gives infrastructure teams the structure they
            need to deliver with confidence. We help owners, designers,
            builders, and delivery teams turn scattered project
            information into clear, connected workflows, making it
            easier to coordinate decisions, track requirements, manage
            compliance, and carry reliable information from design
            through construction and handover.
          </p>
        </div>
      </div>
    </section>
  );
}
