"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Solutions.module.css";

/**
 * S4 — Solutions.
 *
 * Cream Enerblock-style "Solutions" section. A header band with a
 * small "Solutions" eyebrow and a big tight title on the left, a
 * spec-plate flourish on the right; then a stack of numbered rows,
 * each row a 3-column grid (index number / portrait image / text
 * column with label + 2-line title + body + bordered Learn-more
 * pill). Titles reveal line-by-line under a sweep on scroll-in.
 */

interface Solution {
  number: string;
  label: string;
  titleLines: string[];
  body: string;
  href: string;
  image: string;
  alt: string;
}

const SOLUTIONS: Solution[] = [
  {
    number: "01",
    label: "Information Management",
    titleLines: [
      "A common data environment",
      "from kickoff to handover.",
    ],
    body: "We design the structure that makes every drawing, model, and document findable, governed, and trusted. ISO 19650, naming conventions, CDE setup, and the workflows that keep them honest under deadline.",
    href: "#layers",
    image: "/section2.jpg",
    alt: "Information management on a live infrastructure program",
  },
  {
    number: "02",
    label: "Execution Intelligence",
    titleLines: [
      "Field reality, captured",
      "and reconciled to the model.",
    ],
    body: "4D scheduling, scan-to-BIM, progress capture, field BIM. We bring construction reality back into the digital record so issues surface as variances, not as claims.",
    href: "#layers",
    image: "/section2.jpg",
    alt: "Reality-capture survey on a construction site",
  },
  {
    number: "03",
    label: "Operations & Maintenance",
    titleLines: [
      "Asset intelligence",
      "that outlasts the build.",
    ],
    body: "COBie handover, asset information modelling, twin foundations, operational dashboards. The model becomes a working tool for the operator, not a folder of legacy files.",
    href: "#layers",
    image: "/section2.jpg",
    alt: "Operations dashboard for a major civil asset",
  },
];

export default function Solutions() {
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
          section.querySelectorAll(`.${CSS.escape(styles.titleLineSweep)}`),
          { xPercent: 101 },
        );
        return;
      }

      // Header reveals stagger up on first view.
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

      // Per-row title sweep: each row triggers its own staggered
      // line reveal so the effect plays as the user scrolls into
      // each card, not all at once at the top of the section.
      const rows = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.row)}`,
      );
      rows.forEach((row) => {
        const sweeps = row.querySelectorAll<HTMLElement>(
          `.${CSS.escape(styles.titleLineSweep)}`,
        );
        if (sweeps.length) {
          gsap.fromTo(
            sweeps,
            { xPercent: 0 },
            {
              xPercent: 101,
              duration: 0.9,
              ease: "power3.inOut",
              stagger: 0.12,
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="solutions-title"
    >
      <div className={styles.shell}>
        {/* ─── Header band ─── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span data-reveal className={styles.eyebrow}>
              Solutions
            </span>
            <h2
              id="solutions-title"
              data-reveal
              className={styles.headTitle}
            >
              Three layers,
              <br />
              one practice.
            </h2>
          </div>

          {/* Spec plate flourish */}
          <div data-reveal className={styles.specPlate} aria-hidden="true">
            <div className={styles.specPlateMark}>
              <span className={styles.specPlateMarkCircle} />
              <span className={styles.specPlateMarkWord}>Infraforma</span>
            </div>
            <dl className={styles.specPlateTable}>
              <div className={styles.specPlateRow}>
                <dt>Standard</dt>
                <dd>ISO 19650 · LOD 300</dd>
              </div>
              <div className={styles.specPlateRow}>
                <dt>Drawing</dt>
                <dd>IF.SOL.01</dd>
              </div>
              <div className={styles.specPlateRow}>
                <dt>Rev.</dt>
                <dd>03</dd>
              </div>
            </dl>
          </div>
        </header>

        {/* ─── Numbered solution rows ─── */}
        <div className={styles.rows}>
          {SOLUTIONS.map((s) => (
            <article key={s.number} className={styles.row}>
              <div className={styles.rowNumber}>
                <span>{s.number}</span>
                <span className={styles.rowNumberSep} aria-hidden="true">
                  /
                </span>
              </div>

              <figure className={styles.rowImage}>
                <img src={s.image} alt={s.alt} loading="lazy" />
              </figure>

              <div className={styles.rowContent}>
                <span data-reveal className={styles.rowLabel}>
                  {s.label}
                </span>
                <h3 className={styles.rowTitle}>
                  {s.titleLines.map((line, i) => (
                    <span key={i} className={styles.titleLine}>
                      <span className={styles.titleLineText}>{line}</span>
                      <span
                        className={styles.titleLineSweep}
                        aria-hidden="true"
                      />
                    </span>
                  ))}
                </h3>
                <p data-reveal className={styles.rowBody}>
                  {s.body}
                </p>
                <a data-reveal className={styles.rowCta} href={s.href}>
                  <span className={styles.rowCtaLabel}>Learn more</span>
                  <span className={styles.rowCtaArrow} aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
