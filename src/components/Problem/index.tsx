"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Problem.module.css";

/**
 * S3 — Industry · Disconnected.
 *
 * Two-tone statement on a full-bleed Enerblock-style dark band.
 * Both tones are big display type, same size; the lead sits in a
 * muted off-white tone, the McKinsey pull-quote starts even more
 * muted and fills word-by-word to pure white as the user scrolls
 * past. The right side carries a 3/4 vertical grid hairline and an
 * X/Y crosshair tracker that follows the pointer (desktop only).
 * A 16:9 image parallaxes beneath the band.
 */

const LEAD_TEXT =
  "The damage is not always visible at first. It shows up as waiting time, repeated work, unresolved changes, unclear ownership, and decisions made without the full picture. Over time, those gaps become schedule pressure, cost exposure, claims, and weak handover. Industry studies show the scale of the problem:";

const STATEMENT_TEXT =
  "McKinsey found that only 5% of megaprojects over $1 billion finished on budget and on schedule, with completed projects averaging 37% cost overruns and 53% schedule overruns.";

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const coordXRef = useRef<HTMLSpanElement>(null);
  const coordYRef = useRef<HTMLSpanElement>(null);
  const imageBandRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
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

      // McKinsey statement: fill word-by-word as the user scrolls past.
      const statementEl = section.querySelector(
        `.${CSS.escape(styles.statementText)}`,
      );
      const wordEls = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.statementWord)}`,
      );
      if (statementEl && wordEls.length) {
        ScrollTrigger.create({
          trigger: statementEl,
          start: "top 78%",
          end: "bottom 28%",
          scrub: 0.4,
          onUpdate: (self) => {
            // Slight overshoot so the last few words land before the
            // end of the trigger range.
            const filled = Math.floor(self.progress * (wordEls.length + 3));
            wordEls.forEach((w, i) => {
              if (i < filled) w.classList.add(styles.statementWordFilled);
              else w.classList.remove(styles.statementWordFilled);
            });
          },
        });
      }

      // Parallax image.
      if (imageInnerRef.current && imageBandRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: imageBandRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Crosshair / X-Y tracker. Lives outside GSAP so it stays
  // responsive to the pointer even before the loader lifts.
  useEffect(() => {
    const section = sectionRef.current;
    const overlay = crossRef.current;
    const coordX = coordXRef.current;
    const coordY = coordYRef.current;
    if (!section || !overlay || !coordX || !coordY) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let rect = section.getBoundingClientRect();
    const refreshRect = () => {
      rect = section.getBoundingClientRect();
    };
    refreshRect();

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.setProperty("--cx", `${x.toFixed(1)}px`);
      overlay.style.setProperty("--cy", `${y.toFixed(1)}px`);
      coordX.textContent = `X: ${pad(x)}`;
      coordY.textContent = `Y: ${pad(y)}`;
    };
    const onEnter = () => {
      refreshRect();
      overlay.style.setProperty("--crossActive", "1");
    };
    const onLeave = () => {
      overlay.style.setProperty("--crossActive", "0");
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

      {/* Parallax 16:9 image */}
      <figure ref={imageBandRef} className={styles.imageBand}>
        <div ref={imageInnerRef} className={styles.imageInner}>
          <img
            src="/section2.jpg"
            alt="Infrastructure project context"
            loading="lazy"
          />
        </div>
      </figure>
    </section>
  );
}
