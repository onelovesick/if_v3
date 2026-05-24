"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./Problem.module.css";

/**
 * S3 — The industry problem, as a revision-schedule ledger.
 *
 * Editorial dark section with a blueprint-grid wash and a redline
 * signal accent. Headline lands the problem in one breath. Four
 * "revision" rows count up the canonical cost-of-rework figures from
 * FMI / Autodesk research, each with its source. A strikethrough
 * "myth -> resolve" turn closes the section, primed for Layers (S4)
 * which explains how we design that failure out.
 */

interface Row {
  rev: string;
  prefix?: string;
  target: number;
  decimals: number;
  suffix: string;
  description: ReactNode;
  source: string;
}

const ROWS: Row[] = [
  {
    rev: "REV 01",
    target: 5.5,
    decimals: 1,
    suffix: "hrs",
    description: (
      <>
        Lost <em>every week, per person</em>, just searching for project
        information that already exists somewhere.
      </>
    ),
    source: "Src: FMI · Construction Disconnected, 2018",
  },
  {
    rev: "REV 02",
    prefix: "$",
    target: 88.7,
    decimals: 1,
    suffix: "B",
    description: (
      <>
        In <em>rework</em> caused by bad, missing or inaccessible data, in
        a single year, globally.
      </>
    ),
    source: "Src: Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
  {
    rev: "REV 03",
    target: 14,
    decimals: 0,
    suffix: "%",
    description: (
      <>
        Of <em>all rework</em> across the industry traces directly back to a
        data failure, not a design one.
      </>
    ),
    source: "Src: Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
  {
    rev: "REV 04",
    prefix: "$",
    target: 7.1,
    decimals: 1,
    suffix: "M",
    description: (
      <>
        Avoidable rework for <em>every $1B delivered</em>. The share of the
        bill written for your own programme.
      </>
    ),
    source: "Src: Autodesk + FMI · Harnessing the Data Advantage, 2021",
  },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Counts up to `target` once when first visible. */
function CountFigure({
  prefix,
  target,
  decimals,
  suffix,
}: {
  prefix?: string;
  target: number;
  decimals: number;
  suffix: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const elRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduce) {
        numEl.textContent = target.toFixed(decimals);
        return;
      }
      const duration = 1500;
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = easeOutCubic(p);
        numEl.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else numEl.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return (
    <span ref={elRef} className={styles.figure}>
      {prefix ? <span className={styles.figurePre}>{prefix}</span> : null}
      <span ref={numRef}>0</span>
      <span className={styles.figureSuf}>{suffix}</span>
    </span>
  );
}

/** Adds .revealIn when the element first enters view. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, shown };
}

function StrikeResolve() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={styles.turnBody}>
      <div className={`${styles.strike} ${armed ? styles.strikeOn : ""}`}>
        <span className={styles.struck}>
          &ldquo;Rework is just the cost of complex projects.&rdquo;
        </span>
      </div>
      <span className={`${styles.resolve} ${armed ? styles.resolveOn : ""}`}>
        Lost information is a <em>process failure</em>: created, not
        inherited. Which means it can be designed out.
      </span>
    </div>
  );
}

function RevealBlock({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${styles.reveal} ${shown ? styles.revealIn : ""}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

export default function Problem() {
  return (
    <section
      id="problem"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="problem-title"
    >
      <div className={styles.wrap}>
        <RevealBlock>
          <span className={styles.tag}>
            <span className={styles.tagDot} aria-hidden="true" />
            §01 · The Problem
          </span>
        </RevealBlock>

        <RevealBlock delay={0.06}>
          <h2 id="problem-title" className={styles.head}>
            Information is created once, then lost again and again, and{" "}
            <em>rework is the invoice.</em>
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.12}>
          <p className={styles.sub}>
            Every discipline handoff, every tool boundary, every
            project-to-operations transition leaks the information you{" "}
            <strong>already produced and already own.</strong> The cost
            rarely shows up as a line item. It shows up as remodelled
            geometry, re-validated data, and weeks no schedule can
            recover.
          </p>
        </RevealBlock>

        <div className={styles.schedule}>
          {ROWS.map((row, i) => (
            <RevealBlock
              key={row.rev}
              delay={0.04 * (i % 4)}
              className={styles.row}
            >
              <div className={styles.rev}>{row.rev}</div>
              <CountFigure
                prefix={row.prefix}
                target={row.target}
                decimals={row.decimals}
                suffix={row.suffix}
              />
              <div className={styles.meta}>
                <div className={styles.desc}>{row.description}</div>
                <div className={styles.src}>{row.source}</div>
              </div>
            </RevealBlock>
          ))}
        </div>

        <div className={styles.turn}>
          <div className={`${styles.rev} ${styles.turnRev}`}>REV 05</div>
          <StrikeResolve />
        </div>

        <RevealBlock className={styles.foot}>
          <span>
            Sources: Autodesk &amp; FMI, &ldquo;Harnessing the Data Advantage
            in Construction&rdquo; (2021); FMI, &ldquo;Construction
            Disconnected&rdquo; (2018).
          </span>
          <span>INFRAFORMA / DELIVERY INTEGRITY</span>
        </RevealBlock>
      </div>
    </section>
  );
}
