"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Problem.module.css";

/**
 * S3 — The Problem.
 *
 * Two-tone statement on a full-bleed Enerblock-style dark band.
 *   TONE 1 (.lead)      quiet body in muted white, sets up the
 *                       problem and ends on a colon.
 *   TONE 2 (.statement) large pure-white pull-quote with the
 *                       McKinsey megaproject figures, revealed
 *                       line-by-line under a dark sweep panel.
 * A 16:9 image bleeds full width directly underneath.
 */

// Hardcoded line splits for the per-line sweep. Lines stay
// balanced at desktop widths; on smaller viewports each line
// wraps inside its own .statementLine wrapper and the sweep just
// covers the wrapped block.
const STATEMENT_LINES = [
  "McKinsey found that only 5% of megaprojects",
  "over $1 billion finished on budget and on schedule,",
  "with completed projects averaging 37% cost overruns",
  "and 53% schedule overruns.",
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(section.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        gsap.set(
          section.querySelectorAll(`.${CSS.escape(styles.statementLineSweep)}`),
          { xPercent: 101 },
        );
        return;
      }

      // Quiet stuff fades up in stagger.
      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // The 2nd-tone statement reveals line by line under a dark
      // sweep panel that slides off to the right, staggered.
      const sweeps = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.statementLineSweep)}`,
      );
      if (sweeps.length) {
        gsap.fromTo(
          sweeps,
          { xPercent: 0 },
          {
            xPercent: 101,
            duration: 0.9,
            ease: "power3.inOut",
            stagger: 0.11,
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none none",
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
      id="problem"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="problem-title"
    >
      <div className={styles.band}>
        <div className={styles.bandHeader}>
          <h2 id="problem-title" data-reveal className={styles.eyebrow}>
            The Problem
          </h2>
          <span
            data-reveal
            className={styles.marker}
            aria-hidden="true"
          />
        </div>

        <div className={styles.body}>
          {/* TONE 1 — lead */}
          <p data-reveal className={styles.lead}>
            The damage is not always visible at first. It shows up as
            waiting time, repeated work, unresolved changes, unclear
            ownership, and decisions made without the full picture. Over
            time, those gaps become schedule pressure, cost exposure,
            claims, and weak handover. Industry studies show the scale
            of the problem:
          </p>

          {/* TONE 2 — statement */}
          <blockquote className={styles.statement}>
            {STATEMENT_LINES.map((line, i) => (
              <span key={i} className={styles.statementLine}>
                <span className={styles.statementLineText}>{line}</span>
                <span
                  className={styles.statementLineSweep}
                  aria-hidden="true"
                />
              </span>
            ))}
            <cite data-reveal className={styles.statementCite}>
              McKinsey &amp; Company · Megaproject Performance
            </cite>
          </blockquote>
        </div>
      </div>

      <figure className={styles.imageBand}>
        <img
          src="/section2.jpg"
          alt="Infrastructure project context"
          loading="lazy"
        />
      </figure>
    </section>
  );
}
