"use client";

import { Fragment, useEffect, useRef } from "react";
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
 * Renders a string as per-character spans separated by literal spaces between
 * words. Used to animate color sweep across each statement line as the user
 * scrolls past. The full sentence is also rendered as an offscreen sr-only
 * span so screen readers announce it as one phrase.
 */
function CharSweep({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true" className={className}>
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {word.split("").map((c, ci) => (
              <span key={ci} data-char>
                {c}
              </span>
            ))}
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

/**
 * The Promise — the 20-second thesis. Editorial title at the top, two-tone
 * statement that fills with secondary blue character-by-character as the
 * reader scrolls through, indexed pillar grid as the operational answer.
 */
export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-anim]"), {
        opacity: 1,
        yPercent: 0,
        y: 0,
      });
      gsap.set(section.querySelectorAll("[data-rule]"), { scaleX: 1 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    // Title — mask-reveal: the word rises into the H2's clipped frame
    const title = section.querySelector("[data-anim='title']");
    if (title) {
      const t = gsap.from(title, {
        yPercent: 110,
        duration: 1.1,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Title rule — draws across left → right after the word lands
    const titleRule = section.querySelector("[data-title-rule]");
    if (titleRule) {
      const t = gsap.from(titleRule, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.0,
        ease,
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

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

    // Per-character color sweep — each line fills with secondary blue
    // as the reader scrolls past it. One trigger per line.
    section.querySelectorAll("[data-anim='line']").forEach((line) => {
      const chars = line.querySelectorAll("[data-char]");
      if (chars.length === 0) return;
      const sweep = gsap.to(chars, {
        color: "var(--c-blue)",
        ease: "none",
        stagger: 0.5 / chars.length, // total stagger ~0.5 of timeline
        scrollTrigger: {
          trigger: line,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.5,
        },
      });
      if (sweep.scrollTrigger) triggers.push(sweep.scrollTrigger);
    });

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
      <div className={styles.container}>
        {/* Editorial title — one word, doing all the work */}
        <header className={styles.titleBlock}>
          <h2 className={styles.title}>
            <span data-anim="title" className={styles.titleInner}>
              Promise.
            </span>
          </h2>
          <span
            data-title-rule
            className={styles.titleRule}
            aria-hidden="true"
          />
        </header>

        {/* Two-tone statement — muted negation, ink declaration. Each line
            fills with secondary blue as the reader scrolls past. */}
        <div data-anim="statement" className={styles.statement}>
          <p className={styles.statementText}>
            <span data-anim="line" className={styles.statementMuted}>
              <CharSweep text="We are not a software company." />
            </span>
            <span data-anim="line" className={styles.statementMuted}>
              <CharSweep text="We are not a framework." />
            </span>
            <span data-anim="line" className={styles.statementInk}>
              <CharSweep text="We sit on your project team and keep the BIM, drawings, and data usable long after handover." />
            </span>
            <span data-anim="line" className={styles.statementCoda}>
              <CharSweep text="Pre-construction through handover. A digital model the owner can use from day one of operations." />
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
