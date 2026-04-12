"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

interface LossCard {
  tag: string;
  title: string;
  text: string;
  top: string;
  left: string;
  width: string;
  floatX: number;
  floatY: number;
  rotate: number;
  collapseX: number;
  collapseY: number;
}

interface LaneChip {
  label: string;
  left: string;
}

interface LaneConfig {
  shift: number;
  width: string;
  chips: LaneChip[];
}

const LOSS_CARDS: LossCard[] = [
  {
    tag: "01 / Version drift",
    title: "Near-matching information",
    text: "Teams move from files that look aligned but no longer mean the same thing once they cross a tool, package, or approval step.",
    top: "15%",
    left: "4%",
    width: "clamp(220px, 19vw, 296px)",
    floatX: -96,
    floatY: 68,
    rotate: -8,
    collapseX: 196,
    collapseY: 146,
  },
  {
    tag: "02 / Duplicate capture",
    title: "Re-entered context",
    text: "The same fact gets captured again and again by different owners, each with slightly different names, timing, and assumptions.",
    top: "18%",
    left: "72%",
    width: "clamp(220px, 18vw, 284px)",
    floatX: 88,
    floatY: 60,
    rotate: 7,
    collapseX: -182,
    collapseY: 134,
  },
  {
    tag: "03 / Schedule drag",
    title: "Delay compounds quietly",
    text: "A broken handoff becomes waiting time, resequencing, clarification loops, and avoidable coordination debt across the programme.",
    top: "43%",
    left: "2%",
    width: "clamp(236px, 20vw, 308px)",
    floatX: -110,
    floatY: 42,
    rotate: -6,
    collapseX: 228,
    collapseY: 28,
  },
  {
    tag: "04 / Commercial leakage",
    title: "Risk hides in the gaps",
    text: "Bad structure obscures entitlement, status, and exposure until teams are reacting to cost instead of controlling it.",
    top: "46%",
    left: "73%",
    width: "clamp(228px, 19vw, 300px)",
    floatX: 116,
    floatY: 44,
    rotate: 8,
    collapseX: -214,
    collapseY: 24,
  },
  {
    tag: "05 / Field uncertainty",
    title: "Crews stop to verify",
    text: "Execution slows down when people on site need to validate what is current before they can act with confidence.",
    top: "66%",
    left: "16%",
    width: "clamp(218px, 18vw, 282px)",
    floatX: -74,
    floatY: 54,
    rotate: -5,
    collapseX: 128,
    collapseY: -126,
  },
  {
    tag: "06 / Handover risk",
    title: "Operations inherit doubt",
    text: "Disconnected records mean the final asset lands with information that is incomplete, duplicated, or no longer trusted.",
    top: "69%",
    left: "58%",
    width: "clamp(220px, 18vw, 288px)",
    floatX: 70,
    floatY: 52,
    rotate: 5,
    collapseX: -122,
    collapseY: -138,
  },
];

const LANES: LaneConfig[] = [
  {
    shift: -18,
    width: "clamp(180px, 22vw, 330px)",
    chips: [
      { label: "RFI", left: "18%" },
      { label: "REV 12", left: "80%" },
    ],
  },
  {
    shift: 14,
    width: "clamp(210px, 26vw, 376px)",
    chips: [
      { label: "COST CODE", left: "24%" },
      { label: "FIELD NOTE", left: "74%" },
    ],
  },
  {
    shift: -12,
    width: "clamp(220px, 28vw, 420px)",
    chips: [
      { label: "PACKAGE", left: "14%" },
      { label: "ASSET ID", left: "86%" },
    ],
  },
  {
    shift: 10,
    width: "clamp(188px, 24vw, 352px)",
    chips: [
      { label: "SUBMITTAL", left: "22%" },
      { label: "QA LOG", left: "78%" },
    ],
  },
  {
    shift: -16,
    width: "clamp(194px, 23vw, 338px)",
    chips: [
      { label: "CHANGE", left: "20%" },
      { label: "HANDOVER", left: "82%" },
    ],
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const meta = Array.from(
        section.querySelectorAll<HTMLElement>("[data-meta]")
      );
      const statChunks = Array.from(
        section.querySelectorAll<HTMLElement>("[data-stat-chunk]")
      );
      const amountLine = section.querySelector<HTMLElement>("[data-amount-line]");
      const lossCards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-loss-card]")
      );
      const halos = Array.from(
        section.querySelectorAll<HTMLElement>("[data-halo]")
      );
      const laneField = section.querySelector<HTMLElement>(`.${styles.laneField}`);
      const lanes = Array.from(
        section.querySelectorAll<HTMLElement>("[data-lane]")
      );
      const laneCores = Array.from(
        section.querySelectorAll<HTMLElement>("[data-lane-core]")
      );
      const laneChips = Array.from(
        section.querySelectorAll<HTMLElement>("[data-lane-chip]")
      );
      const footer = Array.from(
        section.querySelectorAll<HTMLElement>("[data-footer]")
      );
      const grid = section.querySelector<HTMLElement>(`.${styles.grid}`);

      if (!laneField) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ...meta,
            ...statChunks,
            ...lossCards,
            ...halos,
            ...lanes,
            ...laneCores,
            ...laneChips,
            ...footer,
          ],
          { clearProps: "all" }
        );
      });

      media.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(meta, { opacity: 0, y: 26 });
        gsap.set(statChunks, { opacity: 0, yPercent: 22, filter: "blur(10px)" });
        gsap.set(lossCards, {
          opacity: 0,
          x: (_, target) =>
            Number((target as HTMLElement).dataset.floatX ?? 0),
          y: (_, target) =>
            Number((target as HTMLElement).dataset.floatY ?? 0),
          rotate: (_, target) =>
            Number((target as HTMLElement).dataset.rotate ?? 0),
          filter: "blur(14px)",
          transformOrigin: "center center",
        });
        gsap.set(halos, { opacity: 0.18, scale: 0.78, transformOrigin: "center center" });
        gsap.set(laneField, { opacity: 0, y: 80 });
        gsap.set(lanes, {
          opacity: 0.14,
          xPercent: (_, target) =>
            Number((target as HTMLElement).dataset.shift ?? 0),
        });
        gsap.set(laneCores, {
          opacity: 0.16,
          scaleX: 0.58,
          transformOrigin: "center center",
        });
        gsap.set(laneChips, { opacity: 0, y: 18, scale: 0.92 });
        gsap.set(footer, { opacity: 0, y: 24 });

        if (grid) {
          gsap.set(grid, { opacity: 0.12 });
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1900",
            scrub: 0.75,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(meta, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.32,
          }, 0.04)
          .to(statChunks, {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.46,
          }, 0.08)
          .to(halos, {
            opacity: (_, target) =>
              Number((target as HTMLElement).dataset.opacity ?? 0.8),
            scale: 1,
            stagger: 0.04,
            duration: 0.54,
          }, 0.14)
          .to(lossCards, {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            filter: "blur(0px)",
            stagger: 0.05,
            duration: 0.58,
          }, 0.18);

        if (amountLine) {
          timeline.to(
            amountLine,
            {
              scale: 0.96,
              transformOrigin: "left center",
              duration: 0.42,
            },
            0.54
          );
        }

        timeline
          .to(statChunks, {
            yPercent: -6,
            stagger: 0.03,
            duration: 0.4,
          }, 0.56)
          .to(laneField, {
            opacity: 1,
            y: 0,
            duration: 0.48,
          }, 0.58)
          .to(lossCards, {
            x: (_, target) =>
              Number((target as HTMLElement).dataset.collapseX ?? 0),
            y: (_, target) =>
              Number((target as HTMLElement).dataset.collapseY ?? 0),
            scale: 0.82,
            opacity: 0.14,
            filter: "blur(10px)",
            stagger: 0.03,
            duration: 0.58,
          }, 0.64)
          .to(lanes, {
            opacity: 1,
            xPercent: 0,
            stagger: 0.04,
            duration: 0.46,
          }, 0.68)
          .to(laneCores, {
            opacity: 1,
            scaleX: 1,
            stagger: 0.03,
            duration: 0.42,
          }, 0.7)
          .to(laneChips, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.02,
            duration: 0.34,
          }, 0.76)
          .to(footer, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.38,
          }, 0.82);

        if (grid) {
          timeline.to(
            grid,
            {
              opacity: 0.22,
              duration: 0.38,
            },
            0.72
          );
        }
      });

      media.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(meta, { opacity: 0, y: 18 });
        gsap.set(statChunks, { opacity: 0, y: 28 });
        gsap.set(lossCards, { opacity: 0, y: 30, filter: "blur(10px)" });
        gsap.set(halos, { opacity: 0.22, scale: 0.88, transformOrigin: "center center" });
        gsap.set(lanes, {
          opacity: 0.16,
          xPercent: (_, target) =>
            Number((target as HTMLElement).dataset.shift ?? 0) * 0.45,
        });
        gsap.set(laneCores, {
          opacity: 0.3,
          scaleX: 0.7,
          transformOrigin: "center center",
        });
        gsap.set(laneChips, { opacity: 0, y: 16 });
        gsap.set(footer, { opacity: 0, y: 20 });

        const introTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        });

        introTimeline
          .to(meta, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
          })
          .to(statChunks, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
          }, 0.08)
          .to(halos, {
            opacity: (_, target) =>
              Number((target as HTMLElement).dataset.opacity ?? 0.8),
            scale: 1,
            stagger: 0.05,
            duration: 0.7,
          }, 0.1);

        gsap.to(lossCards, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 64%",
          },
        });

        gsap.to(lanes, {
          opacity: 1,
          xPercent: 0,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: laneField,
            start: "top 85%",
            end: "bottom 42%",
            scrub: 0.9,
          },
        });

        gsap.to(laneCores, {
          opacity: 1,
          scaleX: 1,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: laneField,
            start: "top 82%",
            end: "bottom 40%",
            scrub: 0.9,
          },
        });

        gsap.to(laneChips, {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: laneField,
            start: "top 80%",
          },
        });

        gsap.to(footer, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.48,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "bottom 78%",
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      <div className={styles.frame}>
        <div className={styles.grid} />
        <div
          data-halo
          data-opacity="0.84"
          className={`${styles.halo} ${styles.haloPrimary}`}
        />
        <div
          data-halo
          data-opacity="0.64"
          className={`${styles.halo} ${styles.haloSecondary}`}
        />

        <div className={styles.metaRow}>
          <p data-meta className={styles.kicker}>
            The Industry Problem
          </p>
          <p data-meta className={styles.microStat}>
            Bad data behaves like a hidden tax across schedule, commercial
            risk, field execution, and handover.
          </p>
        </div>

        <div className={styles.centerpiece}>
          <p data-meta className={styles.lead}>
            When context breaks, cost does not stay in one place.
          </p>

          <h2 className={styles.headline}>
            <span data-stat-chunk data-amount-line className={styles.amountLine}>
              <span className={styles.amountSymbol}>$</span>
              <span className={styles.amountValue}>1.8</span>
              <span className={styles.amountUnit}>trillion</span>
            </span>
            <span data-stat-chunk className={styles.tailLine}>
              lost to bad data
            </span>
            <span data-stat-chunk className={styles.tailLineMuted}>
              in a single year.
            </span>
          </h2>

          <p data-meta className={styles.summary}>
            That loss is rarely one dramatic failure. It is thousands of small
            disconnects multiplying through naming, approvals, reporting,
            procurement, and site coordination until the whole programme is
            paying for missing context.
          </p>
        </div>

        <div className={styles.cardField}>
          {LOSS_CARDS.map((card) => (
            <article
              key={card.tag}
              data-loss-card
              data-float-x={card.floatX}
              data-float-y={card.floatY}
              data-rotate={card.rotate}
              data-collapse-x={card.collapseX}
              data-collapse-y={card.collapseY}
              className={styles.card}
              style={
                {
                  "--card-top": card.top,
                  "--card-left": card.left,
                  "--card-width": card.width,
                } as CSSProperties
              }
            >
              <p className={styles.cardTag}>{card.tag}</p>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.laneField} aria-hidden="true">
          <div className={styles.laneBeam} />

          {LANES.map((lane, index) => (
            <div key={`lane-${index}`} className={styles.laneWrap}>
              <div
                data-lane
                data-shift={lane.shift}
                className={styles.lane}
              >
                <span
                  data-lane-core
                  className={styles.laneCore}
                  style={{ "--lane-width": lane.width } as CSSProperties}
                />

                {lane.chips.map((chip) => (
                  <span
                    key={`${index}-${chip.label}`}
                    data-lane-chip
                    className={styles.laneChip}
                    style={{ "--chip-left": chip.left } as CSSProperties}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerCopy}>
          <p data-footer className={styles.footerLabel}>
            Bad data does not break once. It multiplies.
          </p>
          <p data-footer className={styles.footerText}>
            Structured information management matters because it turns invisible
            leakage back into something delivery teams can actually control.
          </p>
        </div>
      </div>
    </section>
  );
}
