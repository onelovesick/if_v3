"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

/**
 * Per-character spans for scroll-driven blue fill on the statement line.
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
 * The Promise — formatted as an architectural title block. One bordered
 * frame containing four cells: header / statement / coda / sign-off.
 * Brief, on-brand for an infrastructure firm, compact enough to fit
 * comfortably in one viewport. Scroll past it to the next section.
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
        scale: 1,
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    // Title block frame fades + scales in
    const block = section.querySelector("[data-anim='block']");
    if (block) {
      const t = gsap.from(block, {
        opacity: 0,
        scale: 0.985,
        y: 16,
        duration: 0.9,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Cells stagger in inside the frame
    const cells = section.querySelectorAll("[data-anim='cell']");
    if (cells.length > 0) {
      const t = gsap.from(cells, {
        opacity: 0,
        y: 12,
        duration: 0.55,
        stagger: 0.08,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Per-character blue sweep on the statement
    const chars = section.querySelectorAll("[data-char]");
    if (chars.length > 0) {
      const sweep = gsap.to(chars, {
        color: "#1864C8",
        duration: 0.001,
        ease: "none",
        stagger: 1 / chars.length,
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='punch']"),
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });
      if (sweep.scrollTrigger) triggers.push(sweep.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.promise} aria-label="The promise">
      <div className={styles.container}>
        <article data-anim="block" className={styles.block}>
          {/* Header — section + reference */}
          <header data-anim="cell" className={styles.cell}>
            <span>Promise</span>
            <span>N° 02 / 12 — Practice</span>
          </header>

          {/* Statement — the punch, with scroll-driven per-char blue fill */}
          <div data-anim="cell" className={`${styles.cell} ${styles.cellStatement}`}>
            <p data-anim="punch" className={styles.punch}>
              <CharSweep text="We are a Layer of confidence for Heavy Civil Mega Projects." />
            </p>
          </div>

          {/* Coda — quiet body */}
          <div data-anim="cell" className={`${styles.cell} ${styles.cellCoda}`}>
            <p className={styles.coda}>
              Pre-construction through handover. A digital model the owner can
              use from day one of operations.
            </p>
          </div>

          {/* Sign-off — like a drawing's title block footer */}
          <footer data-anim="cell" className={`${styles.cell} ${styles.cellFooter}`}>
            <span>Reg'd · 2026 · Quebec</span>
            <span>Infraforma — Drawn 01 of 01</span>
          </footer>
        </article>
      </div>
    </section>
  );
}
