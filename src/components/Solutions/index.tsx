"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Solutions.module.css";

/**
 * S4 — Solutions.
 *
 * Warm-paper section that shares its ground (#F5F7FA, ink #1C1F23)
 * with PositionBrief so the two light sections read as one editorial
 * voice. Header band on top (eyebrow + section H2 at the same
 * display scale used across the page). Below, four sticky cards
 * stack like a deck: each card pins at a progressively larger top
 * offset so the previous cards peek out above. Cards 01-03 are the
 * practice layers; card 04 is the engagement CTA. Per-card titles
 * sweep-reveal line by line and use the same display scale as the
 * section H2 for uniformity.
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

const CTA = {
  number: "04",
  label: "Engage",
  titleLines: ["Bring us in early.", "The earlier, the cleaner the handover."],
  body: "We work best when the information strategy is set before the first drawing is issued. Tell us where the program is, and we will tell you where the leverage points are.",
  buttonLabel: "Begin a brief",
  buttonHref: "#close",
};

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

      // Per-card title sweep — each card triggers its own staggered
      // line reveal so the effect plays as the user scrolls into
      // each card in the stack, not all at once.
      const cards = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.card)}`,
      );
      cards.forEach((card) => {
        const sweeps = card.querySelectorAll<HTMLElement>(
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
                trigger: card,
                start: "top 75%",
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
        </header>

        {/* ─── Sticky stack ─── */}
        <div className={styles.stack}>
          {SOLUTIONS.map((s, i) => (
            <article
              key={s.number}
              className={styles.card}
              style={{ "--card-index": i } as React.CSSProperties}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardNumber}>
                  <span>{s.number}</span>
                  <span
                    className={styles.cardNumberSep}
                    aria-hidden="true"
                  >
                    /
                  </span>
                </div>

                <figure className={styles.cardImage}>
                  <img src={s.image} alt={s.alt} loading="lazy" />
                </figure>

                <div className={styles.cardContent}>
                  <span data-reveal className={styles.cardLabel}>
                    {s.label}
                  </span>
                  <h3 className={styles.cardTitle}>
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
                  <p data-reveal className={styles.cardBody}>
                    {s.body}
                  </p>
                  <a data-reveal className={styles.cardLink} href={s.href}>
                    <span>Learn more</span>
                    <span
                      className={styles.cardLinkArrow}
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* ─── Card 04 — CTA ─── */}
          <article
            className={`${styles.card} ${styles.ctaCard}`}
            style={
              { "--card-index": SOLUTIONS.length } as React.CSSProperties
            }
          >
            <div className={styles.cardInner}>
              <div className={styles.cardNumber}>
                <span>{CTA.number}</span>
                <span
                  className={styles.cardNumberSep}
                  aria-hidden="true"
                >
                  /
                </span>
              </div>

              <figure className={styles.ctaAccent} aria-hidden="true">
                <span className={styles.ctaAccentMark}>Infraforma</span>
                <span className={styles.ctaAccentDot} />
              </figure>

              <div className={styles.cardContent}>
                <span data-reveal className={styles.cardLabel}>
                  {CTA.label}
                </span>
                <h3 className={styles.cardTitle}>
                  {CTA.titleLines.map((line, li) => (
                    <span key={li} className={styles.titleLine}>
                      <span className={styles.titleLineText}>{line}</span>
                      <span
                        className={styles.titleLineSweep}
                        aria-hidden="true"
                      />
                    </span>
                  ))}
                </h3>
                <p data-reveal className={styles.cardBody}>
                  {CTA.body}
                </p>
                <a
                  data-reveal
                  className={styles.ctaButton}
                  href={CTA.buttonHref}
                >
                  <span>{CTA.buttonLabel}</span>
                  <span
                    className={styles.ctaButtonArrow}
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
