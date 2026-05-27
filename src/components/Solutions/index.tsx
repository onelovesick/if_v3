"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Solutions.module.css";

/**
 * S4 — Solutions.
 *
 * Cream ground #F0EFEB, ink #0C0B11, grey hairline dividers
 * #9F9DA0. Page-wide --gutter so this section aligns edge-for-edge
 * with PositionBrief above and the dark Layers band below.
 *
 * A single section-level vertical hairline sits at left:60% and
 * spans the whole section, continuing Problem's own 60% line
 * straight down through the header AND every row. Header and
 * rows both use a direct 60/40 flex split so the text column on
 * the right starts exactly at the divider's X. Within the left
 * 60%, a narrow number column sits at the gutter and the framed
 * image fills the remaining space up to the divider, so the image
 * reads as expanded with minimal dead space on the left. Titles
 * reveal line-by-line on scroll. The crosshair tracks the pointer
 * inside the header right zone only.
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
    image: "/solutions-1-1600.jpg",
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
    image: "/solutions-2-1600.jpg",
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
    image: "/solutions-3-1600.jpg",
    alt: "Operations dashboard for a major civil asset",
  },
  {
    number: "04",
    label: "Advisory",
    titleLines: [
      "Independent counsel on",
      "the work that matters.",
    ],
    body: "Audits, governance reviews, training, and one-off engagements. We come in clean and leave you with a plan you can act on. Placeholder copy, to be refined.",
    href: "#field",
    image: "/solutions-4-1600.jpg",
    alt: "Advisory work on a major infrastructure program",
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

      // Pin rows 01-03 at staggered top positions. Done via GSAP
      // rather than CSS position:sticky because sticky was failing
      // for row 02 in this particular DOM (likely an interaction
      // with body's overflow-x hidden and Lenis smooth scroll).
      // GSAP uses position:fixed and is deterministic. Row 04
      // ([data-last]) is excluded so it continues to scroll
      // naturally and cover rows 01-03 as it rises, matching the
      // Enerblock reference behaviour.
      //
      // pinSpacing:false avoids the section's scroll length being
      // tripled (each pin would otherwise add its full scroll
      // duration as padding). endTrigger is the LAST row (not the
      // whole section) so the pins release exactly when row 04
      // finishes scrolling off the top, rather than continuing
      // through the section's 100vh padding tail and bleeding into
      // Parallax/Layers below.
      const allRows = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.row)}`,
      );
      const lastRowEl = allRows[allRows.length - 1];
      const pinRows = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.row)}:not([data-last])`,
      );
      pinRows.forEach((row, idx) => {
        ScrollTrigger.create({
          trigger: row,
          start: `top top+=${90 * (idx + 1)}`,
          endTrigger: lastRowEl,
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Crosshair tracker — only inside the header right zone.
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
      {/* Single section-level vertical hairline + pin at left:60%.
          Spans top-to-bottom of the section so the header and
          every row share one continuous vertical line, continuing
          Problem's 60% divider straight through. */}
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.pin} aria-hidden="true" />

      {/* ─── Header band — 60/40 flex split ─── */}
      <div className={styles.headerStage}>
        <div className={styles.headerLeft}>
          <span data-reveal className={styles.eyebrow}>
            Solutions
          </span>
          <h2
            id="solutions-title"
            data-reveal
            className={styles.headTitle}
          >
            The Digital Thread Between Design, Construction And Operations
          </h2>
        </div>

        <div ref={crossHostRef} className={styles.headerRight}>
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
        </div>
      </div>

      {/* ─── Solution rows — three columns: number, image, text.
              Text uses margin-left:auto + width:40% so its left
              edge lands exactly on the 60% divider. */}
      {SOLUTIONS.map((s, i) => {
        // Rows 01-03 are sticky at top:90/180/270 and stay
        // pinned (the 100vh section padding-bottom prevents
        // them from releasing during the handoff). Row 04 is
        // NOT in the sticky stack — it scrolls naturally with
        // z-index above the stack so it covers everything as
        // it rises, just like Parallax and any later section
        // does (those slide up over Solutions via the matching
        // -100vh margin + high z-index). Positioning lives in
        // the stylesheet via [data-row]/[data-last] selectors
        // so it survives any inline-style precedence weirdness
        // with the position:sticky declaration on .row.
        const isLast = i === SOLUTIONS.length - 1;
        return (
        <article
          key={s.number}
          className={styles.row}
          data-row={i}
          data-last={isLast ? "" : undefined}
        >
          <div className={styles.rowNumber}>
            <span>{s.number}</span>
            <span
              className={styles.rowNumberSep}
              aria-hidden="true"
            >
              /
            </span>
          </div>

          <div className={styles.rowImage}>
            <figure className={styles.rowImageFrame}>
              <img src={s.image} alt={s.alt} loading="lazy" />
            </figure>
          </div>

          <div className={styles.rowRight}>
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
            <a className={styles.rowCta} href={s.href}>
              <span>Learn more</span>
              <span aria-hidden="true" className={styles.rowCtaArrow}>
                &rarr;
              </span>
            </a>
          </div>
        </article>
        );
      })}
    </section>
  );
}
