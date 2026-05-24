"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Solutions.module.css";

/**
 * S4 — Solutions.
 *
 * Exact Enerblock reconstruction per spec. 12-col grid (1.4vw
 * gutter + 1.4vw page padding) on cream ground #F0EFEB with ink
 * #0C0B11 and grey hairline dividers #9F9DA0. The header splits
 * into two span-6 halves: left = eyebrow + big title, right =
 * crosshair overlay + coral spec plate. Below, each solution row
 * is a 12-col grid with number(span 3) / image 4:5(span 3) /
 * text(span 6); row padding is zero so the image height drives
 * the row. Titles reveal line-by-line on scroll. The crosshair
 * tracks the pointer inside the header right half only.
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

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export default function Solutions() {
  const sectionRef = useRef<HTMLElement>(null);
  const crossHostRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const coordXRef = useRef<HTMLSpanElement>(null);
  const coordYRef = useRef<HTMLSpanElement>(null);
  const { ready } = useMotionReady();

  // GSAP reveals — header stagger + per-row line sweep.
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

  // Crosshair tracker — only inside the header right half.
  // Lives outside GSAP so it stays responsive even before the
  // loader lifts. Disabled on touch / no-hover devices.
  useEffect(() => {
    const host = crossHostRef.current;
    const overlay = crossRef.current;
    const coordX = coordXRef.current;
    const coordY = coordYRef.current;
    if (!host || !overlay || !coordX || !coordY) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let rect = host.getBoundingClientRect();
    const refreshRect = () => {
      rect = host.getBoundingClientRect();
    };
    refreshRect();

    const setActive = (on: boolean) => {
      overlay.style.setProperty("--crossActive", on ? "1" : "0");
    };

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
      setActive(true);
    };
    const onLeave = () => {
      setActive(false);
    };

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);

    return () => {
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="solutions-title"
    >
      {/* ─── Header band ─── */}
      <div className={`${styles.wrp} ${styles.headerBlock}`}>
        <div className={styles.grid}>
          <div className={styles.headerLeft}>
            <span data-reveal className={styles.eyebrow}>
              Solutions
            </span>
            <h2
              id="solutions-title"
              data-reveal
              className={styles.headTitle}
            >
              Three layers, one practice.
            </h2>
          </div>

          <div ref={crossHostRef} className={styles.headerRight}>
            {/* Crosshair overlay (fills the right half) */}
            <div
              ref={crossRef}
              className={styles.crossOverlay}
              aria-hidden="true"
            >
              <span
                className={`${styles.crossLine} ${styles.crossLineV}`}
              />
              <span
                className={`${styles.crossLine} ${styles.crossLineH}`}
              />
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

            {/* Spec plate */}
            <div
              data-reveal
              className={styles.specPlate}
              aria-hidden="true"
            >
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
          </div>
        </div>
      </div>

      {/* ─── Solution rows ─── */}
      {SOLUTIONS.map((s) => (
        <article key={s.number} className={styles.row}>
          <div className={styles.wrp}>
            <div className={`${styles.grid} ${styles.rowGrid}`}>
              <div className={styles.rowNumber}>
                <span>{s.number}</span>
                <span
                  className={styles.rowNumberSep}
                  aria-hidden="true"
                >
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
                  {s.titleLines.map((line, li) => (
                    <span key={li} className={styles.titleLine}>
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
                  <span className={styles.rowCtaInner}>
                    <span className={styles.rowCtaLabel}>Learn more</span>
                    <span
                      className={styles.rowCtaArrow}
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
