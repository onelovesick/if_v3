"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Problem.module.css";

/**
 * S3 — The problem we work on. Restyled to the Enerblock "Purpose"
 * treatment per the reference brief:
 *   - Full-bleed dark band, eyebrow top-left, square marker top-right
 *   - Big, weight-500, line-height 0.9, slightly negative tracking
 *     statement headline at ~80% width
 *   - Per-line sweep cursor reveal on scroll-in
 *   - 16:9 image bleeds full width directly beneath the headline
 * Existing content (sub, stats, coda, foot) continues below in a
 * monochrome white treatment so the headline stays the lead.
 */

interface Stat {
  rev: string;
  prefix?: string;
  value: string;
  suffix?: string;
  description: ReactNode;
  source: string;
}

// Hardcoded line splits so the per-line sweep has a known unit to
// animate. The headline still wraps naturally below 1024px; lines
// just grow in height and the sweep covers the wrapped block.
const HEADLINE_LINES = [
  "Information is created once,",
  "then lost again and again,",
  "and rework is the invoice.",
];

const STATS: Stat[] = [
  {
    rev: "Stat 01",
    value: "5.5",
    suffix: "hrs",
    description: (
      <>
        Lost <em>every week, per person</em>, searching for project
        information that already exists somewhere.
      </>
    ),
    source: "FMI · Construction Disconnected, 2018",
  },
  {
    rev: "Stat 02",
    prefix: "$",
    value: "88.7",
    suffix: "B",
    description: (
      <>
        In <em>rework</em> caused by bad, missing or inaccessible data,
        in a single year, globally.
      </>
    ),
    source: "Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
  {
    rev: "Stat 03",
    value: "14",
    suffix: "%",
    description: (
      <>
        Of <em>all rework</em> across the industry traces directly back
        to a data failure, not a design one.
      </>
    ),
    source: "Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
  {
    rev: "Stat 04",
    prefix: "$",
    value: "7.1",
    suffix: "M",
    description: (
      <>
        Avoidable rework for <em>every $1B delivered</em>. The share of
        the bill written for your own programme.
      </>
    ),
    source: "Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
];

export default function Problem() {
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

      // Per-line headline sweep. Each line's panel slides off to the
      // right, uncovering the white text behind it, staggered.
      const sweeps = section.querySelectorAll<HTMLElement>(
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
            stagger: 0.11,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Everything else: subtle fade-up stagger so the eye lands on
      // the headline first, then the supporting content.
      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="problem-title"
    >
      <div className={styles.band}>
        <div className={styles.bandHeader}>
          <span data-reveal className={styles.eyebrow}>
            The Problem
          </span>
          <span
            data-reveal
            className={styles.marker}
            aria-hidden="true"
          />
        </div>

        <h2 id="problem-title" className={styles.title}>
          {HEADLINE_LINES.map((line, i) => (
            <span key={i} className={styles.titleLine}>
              <span className={styles.titleLineText}>{line}</span>
              <span className={styles.titleLineSweep} aria-hidden="true" />
            </span>
          ))}
        </h2>
      </div>

      <figure className={styles.imageBand}>
        <img
          src="/section2.jpg"
          alt="Infrastructure project context"
          loading="lazy"
        />
      </figure>

      <div className={styles.inner}>
        <p data-reveal className={styles.sub}>
          Every discipline handoff, every tool boundary, every
          project-to-operations transition leaks the information you{" "}
          <strong>already produced and already own.</strong> The cost
          rarely shows up as a line item. It shows up as remodelled
          geometry, re-validated data, and weeks no schedule can recover.
        </p>

        <div data-reveal className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.rev} className={styles.stat}>
              <span className={styles.statRev}>{s.rev}</span>
              <span className={styles.statFigure}>
                {s.prefix ? (
                  <span className={styles.statFigurePre}>{s.prefix}</span>
                ) : null}
                <span>{s.value}</span>
                {s.suffix ? (
                  <span className={styles.statFigureSuf}>{s.suffix}</span>
                ) : null}
              </span>
              <p className={styles.statDesc}>{s.description}</p>
              <span className={styles.statSrc}>{s.source}</span>
            </div>
          ))}
        </div>

        <div data-reveal className={styles.coda}>
          <span className={styles.codaRule} aria-hidden="true" />
          <p className={styles.codaStrike}>
            &ldquo;Rework is just the cost of complex projects.&rdquo;
          </p>
          <p className={styles.codaResolve}>
            Lost information is a <em>process failure</em>: created, not
            inherited. Which means it can be designed out.
          </p>
        </div>

        <div data-reveal className={styles.foot}>
          <span>
            Sources: Autodesk &amp; FMI, &ldquo;Harnessing the Data
            Advantage in Construction&rdquo; (2021); FMI, &ldquo;Construction
            Disconnected&rdquo; (2018).
          </span>
          <span>INFRAFORMA / DELIVERY INTEGRITY</span>
        </div>
      </div>
    </section>
  );
}
