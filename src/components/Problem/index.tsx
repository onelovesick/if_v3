"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Problem.module.css";

/**
 * S3 — Industry · Disconnected.
 *
 * Two-tone statement on a full-bleed Enerblock-style dark band.
 * The lead sits in a muted off-white tone; the McKinsey pull-quote
 * starts even more muted and fills word-by-word to pure white as
 * the user scrolls past. The right side carries a vertical grid
 * hairline and an X/Y crosshair tracker that follows the pointer
 * (desktop only, gated to the right zone).
 */

// Short hero lead at headline scale — only this single sentence
// from the original first paragraph. The descriptive setup that
// followed has been dropped.
const LEAD_TEXT = "The damage is not always visible at first.";

const STATEMENT_TEXT =
  "McKinsey found that only 5% of megaprojects over $1 billion finished on budget and on schedule, with completed projects averaging 37% cost overruns and 53% schedule overruns.";

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const coordXRef = useRef<HTMLSpanElement>(null);
  const coordYRef = useRef<HTMLSpanElement>(null);
  const { ready } = useMotionReady();

  const words = useMemo(
    () => STATEMENT_TEXT.split(/\s+/).filter(Boolean),
    [],
  );

  // GSAP-driven effects: reveal + scroll-fill + parallax.
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
        return;
      }

      // Eyebrow, marker, lead, cite fade up on first view.
      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // McKinsey statement: fill word-by-word as the user scrolls
      // past. Trigger begins the moment the quote enters the
      // viewport from the bottom and completes by the time its
      // top reaches 55% from viewport top — so the quote is fully
      // white before it sits at centre. scrub:true keeps the fill
      // pinned to scroll position with no catch-up delay.
      const statementEl = section.querySelector(
        `.${CSS.escape(styles.statementText)}`,
      );
      const wordEls = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.statementWord)}`,
      );
      if (statementEl && wordEls.length) {
        ScrollTrigger.create({
          trigger: statementEl,
          start: "top bottom",
          end: "top 55%",
          scrub: true,
          onUpdate: (self) => {
            // Overshoot so the last words land before the trigger
            // end and the resolution feels decisive, not trickling.
            const filled = Math.floor(self.progress * (wordEls.length + 4));
            wordEls.forEach((w, i) => {
              if (i < filled) w.classList.add(styles.statementWordFilled);
              else w.classList.remove(styles.statementWordFilled);
            });
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Crosshair / X-Y tracker. Lives outside GSAP so it stays
  // responsive to the pointer even before the loader lifts. Only
  // activates when the pointer is past the 60% divide (the right
  // zone) — the left text area stays cursor-clean.
  useEffect(() => {
    const section = sectionRef.current;
    const overlay = crossRef.current;
    const coordX = coordXRef.current;
    const coordY = coordYRef.current;
    if (!section || !overlay || !coordX || !coordY) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    // Match the CSS .threeQuarterLine left: 51%.
    const DIVIDE = 0.51;

    let rect = section.getBoundingClientRect();
    const refreshRect = () => {
      rect = section.getBoundingClientRect();
    };
    refreshRect();

    const setActive = (on: boolean) => {
      overlay.style.setProperty("--crossActive", on ? "1" : "0");
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < rect.width * DIVIDE) {
        // In the left text zone — keep crosshair hidden.
        setActive(false);
        return;
      }
      setActive(true);
      overlay.style.setProperty("--cx", `${x.toFixed(1)}px`);
      overlay.style.setProperty("--cy", `${y.toFixed(1)}px`);
      coordX.textContent = `X: ${pad(x)}`;
      coordY.textContent = `Y: ${pad(y)}`;
    };
    const onEnter = () => {
      refreshRect();
    };
    const onLeave = () => {
      setActive(false);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="problem-title"
    >
      {/* X/Y crosshair tracker (desktop hover only) */}
      <div ref={crossRef} className={styles.crossOverlay} aria-hidden="true">
        <span className={`${styles.crossLine} ${styles.crossLineV}`} />
        <span className={`${styles.crossLine} ${styles.crossLineH}`} />
        <span className={styles.crossPoint} />
        <span
          ref={coordXRef}
          className={`${styles.coordItem} ${styles.coordX}`}
        >
          X: 0000
        </span>
        <span
          ref={coordYRef}
          className={`${styles.coordItem} ${styles.coordY}`}
        >
          Y: 0000
        </span>
      </div>

      {/* 3/4 vertical grid line */}
      <span className={styles.threeQuarterLine} aria-hidden="true" />

      <div className={styles.band}>
        <div className={styles.bandHeader}>
          <h2 id="problem-title" data-reveal className={styles.eyebrow}>
            Industry · Disconnected
          </h2>
          <span
            data-reveal
            className={styles.marker}
            aria-hidden="true"
          />
        </div>

        <div className={styles.body}>
          {/* TONE 1 — muted lead */}
          <p data-reveal className={styles.lead}>
            {LEAD_TEXT}
          </p>

          {/* TONE 2 — McKinsey pull-quote, fills word-by-word */}
          <blockquote className={styles.statement}>
            <p className={styles.statementText}>
              {words.map((word, i) => (
                <span key={i} className={styles.statementWord}>
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <cite data-reveal className={styles.statementCite}>
              McKinsey &amp; Company · Megaproject Performance
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
