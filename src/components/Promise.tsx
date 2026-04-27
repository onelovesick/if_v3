"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

const PILLARS = [
  {
    index: "01",
    label: "Human led",
    body: "Senior people in the room on day one. No junior handoff, no outsourced delivery.",
    detail: "Director-level on the floor",
  },
  {
    index: "02",
    label: "Digitally enabled",
    body: "BIM, CDE, dashboards, automation. Used where they earn their place. Nowhere else.",
    detail: "Tools that report to the work",
  },
  {
    index: "03",
    label: "Owner aligned",
    body: "We answer to the asset's lifetime, not a construction milestone.",
    detail: "Lifecycle accountability",
  },
];

/**
 * The Promise — the 20-second thesis. Typographic hero with two-tone
 * statement, giant outlined section numeral, indexed pillar grid.
 */
export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-anim]"), { opacity: 1, y: 0 });
      gsap.set(section.querySelectorAll("[data-rule]"), { scaleX: 1 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    // Watermark drifts in slowly + slight upward parallax through the section
    const watermark = section.querySelector("[data-anim='watermark']");
    if (watermark) {
      const t1 = gsap.from(watermark, {
        opacity: 0,
        x: 60,
        duration: 1.6,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t1.scrollTrigger) triggers.push(t1.scrollTrigger);

      const t2 = gsap.to(watermark, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      if (t2.scrollTrigger) triggers.push(t2.scrollTrigger);
    }

    // Eyebrow row
    const eyebrow = gsap.from(section.querySelectorAll("[data-anim='eyebrow']"), {
      opacity: 0,
      y: 12,
      duration: 0.7,
      stagger: 0.06,
      ease,
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        toggleActions: "play none none none",
      },
    });
    if (eyebrow.scrollTrigger) triggers.push(eyebrow.scrollTrigger);

    // Statement — sentence-by-sentence with staggered settle
    const statement = gsap.from(section.querySelectorAll("[data-anim='line']"), {
      opacity: 0,
      y: 28,
      filter: "blur(8px)",
      duration: 1.05,
      stagger: 0.16,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='statement']"),
        start: "top 76%",
        toggleActions: "play none none none",
      },
    });
    if (statement.scrollTrigger) triggers.push(statement.scrollTrigger);

    // Architectural rule draws across before the pillars enter
    const rule = section.querySelector("[data-rule]");
    if (rule) {
      const ruleTween = gsap.from(rule, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease,
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='pillars']"),
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (ruleTween.scrollTrigger) triggers.push(ruleTween.scrollTrigger);
    }

    // Pillar numerals — large editorial counter-up
    const numerals = gsap.from(section.querySelectorAll("[data-anim='numeral']"), {
      opacity: 0,
      y: 36,
      duration: 1.0,
      stagger: 0.12,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='pillars']"),
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
    if (numerals.scrollTrigger) triggers.push(numerals.scrollTrigger);

    // Pillar text body — staggered behind the numerals
    const pillars = gsap.from(section.querySelectorAll("[data-anim='pillar-body']"), {
      opacity: 0,
      y: 18,
      duration: 0.85,
      stagger: 0.12,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='pillars']"),
        start: "top 76%",
        toggleActions: "play none none none",
      },
    });
    if (pillars.scrollTrigger) triggers.push(pillars.scrollTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.promise} aria-label="The promise">
      {/* Giant outlined section numeral — silent typographic anchor */}
      <span
        data-anim="watermark"
        className={styles.watermark}
        aria-hidden="true"
      >
        01
      </span>

      <div className={styles.container}>
        {/* Eyebrow row — three editorial signals */}
        <header className={styles.eyebrow}>
          <p data-anim="eyebrow" className={styles.eyebrowLabel}>
            <span className={styles.dot} aria-hidden="true" />
            The Promise
          </p>
          <p data-anim="eyebrow" className={styles.eyebrowMeta}>
            Read in 20 seconds
          </p>
          <p data-anim="eyebrow" className={styles.eyebrowIndex}>
            01 / 12
          </p>
        </header>

        {/* Two-tone statement — muted negation, ink declaration */}
        <div data-anim="statement" className={styles.statement}>
          <p className={styles.statementText}>
            <span data-anim="line" className={styles.statementMuted}>
              We are not a software company.
            </span>
            <span data-anim="line" className={styles.statementMuted}>
              We are not a framework.
            </span>
            <span data-anim="line" className={styles.statementInk}>
              We sit inside your project and make sure the information
              survives.
            </span>
            <span data-anim="line" className={styles.statementCoda}>
              From the first sketch, through every handover, into the asset
              you actually have to run.
            </span>
          </p>
        </div>

        {/* Indexed pillar grid */}
        <div data-anim="pillars" className={styles.pillars}>
          <span data-rule className={styles.rule} aria-hidden="true" />

          {PILLARS.map((p) => (
            <article key={p.label} className={styles.pillar}>
              <span data-anim="numeral" className={styles.numeral} aria-hidden="true">
                {p.index}
              </span>

              <div data-anim="pillar-body" className={styles.pillarText}>
                <p className={styles.pillarLabel}>{p.label}</p>
                <p className={styles.pillarBody}>{p.body}</p>
                <p className={styles.pillarDetail}>{p.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
