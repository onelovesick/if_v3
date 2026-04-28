"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

/**
 * Renders text as per-character spans for scroll-driven color sweep.
 * Full sentence mirrored in an off-screen sr-only span for assistive tech.
 */
function CharSweep({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true">
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
 * The Promise — a single-breath thesis. Mono section header, the editorial
 * "Promise." title, hairline rule, the punch statement (with scroll-driven
 * per-character blue fill), and a quiet body coda. No pillars, no diagrams,
 * no inventory — those move to their own sections.
 */
export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scaleX: 1,
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    // Section meta header — fades up
    const meta = section.querySelector("[data-anim='meta']");
    if (meta) {
      const t = gsap.from(meta, {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Title — mask-reveal: word rises into the H2's clipped frame
    const title = section.querySelector("[data-anim='title']");
    if (title) {
      const t = gsap.from(title, {
        yPercent: 110,
        duration: 1.0,
        ease,
        delay: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Title rule draws across
    const titleRule = section.querySelector("[data-anim='title-rule']");
    if (titleRule) {
      const t = gsap.from(titleRule, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease,
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Punch statement — entrance reveal
    const punch = section.querySelector("[data-anim='punch']");
    if (punch) {
      const t = gsap.from(punch, {
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
        duration: 1.0,
        ease,
        scrollTrigger: {
          trigger: punch,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Per-character blue sweep on the punch — snap each char as the
    // reader scrolls past so the answer fills with brand color.
    const punchChars = section.querySelectorAll("[data-anim='punch'] [data-char]");
    if (punchChars.length > 0) {
      const sweep = gsap.to(punchChars, {
        color: "#1864C8",
        duration: 0.001,
        ease: "none",
        stagger: 1 / punchChars.length,
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='punch']"),
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });
      if (sweep.scrollTrigger) triggers.push(sweep.scrollTrigger);
    }

    // Coda — quiet body fade-up after the punch
    const coda = section.querySelector("[data-anim='coda']");
    if (coda) {
      const t = gsap.from(coda, {
        opacity: 0,
        y: 14,
        duration: 0.85,
        ease,
        scrollTrigger: {
          trigger: coda,
          start: "top 84%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.promise} aria-label="The promise">
      <div className={styles.container}>
        {/* Mono section meta */}
        <header data-anim="meta" className={styles.meta}>
          <span>Promise</span>
          <span>No. 02 / Practice</span>
        </header>

        {/* Editorial title — kept as a beat, sized for a section, not a hero */}
        <h2 className={styles.title}>
          <span data-anim="title" className={styles.titleInner}>
            Promise.
          </span>
        </h2>
        <span
          data-anim="title-rule"
          className={styles.titleRule}
          aria-hidden="true"
        />

        {/* The single punch statement — with scroll-driven per-char blue fill */}
        <p data-anim="punch" className={styles.punch}>
          <CharSweep text="We are a Layer of confidence for Heavy Civil Mega Projects." />
        </p>

        {/* Quiet coda — body weight, smaller scale, the breath after the punch */}
        <p data-anim="coda" className={styles.coda}>
          Pre-construction through handover. A digital model the owner can use
          from day one of operations.
        </p>
      </div>
    </section>
  );
}
