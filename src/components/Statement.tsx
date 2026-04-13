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

interface MultiplyPath {
  d: string;
  tone: "primary" | "steel" | "ghost";
}

interface MultiplyNode {
  label: string;
  top: string;
  left: string;
  tone: "primary" | "steel" | "ghost";
}

const LOSS_CARDS: LossCard[] = [
  {
    tag: "01 / Version drift",
    title: "Near-matching information",
    text: "Teams move from files that look aligned but no longer mean the same thing once they cross a tool, package, or approval step.",
    top: "14%",
    left: "9%",
    width: "clamp(220px, 18vw, 292px)",
    floatX: 110,
    floatY: 48,
    rotate: -8,
    collapseX: 150,
    collapseY: 132,
  },
  {
    tag: "02 / Duplicate capture",
    title: "Re-entered context",
    text: "The same fact gets captured again and again by different owners, each with slightly different names, timing, and assumptions.",
    top: "15%",
    left: "69%",
    width: "clamp(220px, 18vw, 286px)",
    floatX: -106,
    floatY: 44,
    rotate: 8,
    collapseX: -152,
    collapseY: 128,
  },
  {
    tag: "03 / Schedule drag",
    title: "Delay compounds quietly",
    text: "A broken handoff becomes waiting time, resequencing, clarification loops, and avoidable coordination debt across the programme.",
    top: "38%",
    left: "4%",
    width: "clamp(232px, 19vw, 308px)",
    floatX: 126,
    floatY: 20,
    rotate: -6,
    collapseX: 180,
    collapseY: 22,
  },
  {
    tag: "04 / Commercial leakage",
    title: "Risk hides in the gaps",
    text: "Bad structure obscures entitlement, status, and exposure until teams are reacting to cost instead of controlling it.",
    top: "39%",
    left: "74%",
    width: "clamp(228px, 19vw, 300px)",
    floatX: -122,
    floatY: 16,
    rotate: 7,
    collapseX: -182,
    collapseY: 18,
  },
  {
    tag: "05 / Field uncertainty",
    title: "Crews stop to verify",
    text: "Execution slows down when people on site need to validate what is current before they can act with confidence.",
    top: "66%",
    left: "12%",
    width: "clamp(218px, 18vw, 284px)",
    floatX: 96,
    floatY: -42,
    rotate: -5,
    collapseX: 138,
    collapseY: -126,
  },
  {
    tag: "06 / Handover risk",
    title: "Operations inherit doubt",
    text: "Disconnected records mean the final asset lands with information that is incomplete, duplicated, or no longer trusted.",
    top: "66%",
    left: "66%",
    width: "clamp(220px, 18vw, 288px)",
    floatX: -94,
    floatY: -44,
    rotate: 5,
    collapseX: -140,
    collapseY: -128,
  },
];

const MULTIPLY_PATHS: MultiplyPath[] = [
  {
    d: "M 400 230 C 350 190, 284 144, 182 102",
    tone: "steel",
  },
  {
    d: "M 400 230 C 400 182, 400 136, 400 82",
    tone: "ghost",
  },
  {
    d: "M 400 230 C 450 190, 516 144, 618 102",
    tone: "primary",
  },
  {
    d: "M 400 230 C 324 228, 244 226, 138 224",
    tone: "ghost",
  },
  {
    d: "M 400 230 C 476 228, 556 226, 662 224",
    tone: "steel",
  },
  {
    d: "M 400 230 C 352 282, 290 328, 206 364",
    tone: "primary",
  },
  {
    d: "M 400 230 C 400 286, 400 334, 400 390",
    tone: "ghost",
  },
  {
    d: "M 400 230 C 448 282, 510 328, 594 364",
    tone: "steel",
  },
];

const MULTIPLY_NODES: MultiplyNode[] = [
  { label: "Planning lag", top: "16%", left: "18%", tone: "steel" },
  { label: "Approval delay", top: "10%", left: "50%", tone: "ghost" },
  { label: "Commercial uncertainty", top: "16%", left: "82%", tone: "primary" },
  { label: "Site clarifications", top: "48%", left: "12%", tone: "ghost" },
  { label: "Estimator rework", top: "48%", left: "88%", tone: "steel" },
  { label: "Leadership blind spots", top: "80%", left: "22%", tone: "primary" },
  { label: "Handover doubt", top: "88%", left: "50%", tone: "ghost" },
  { label: "Coordination drag", top: "80%", left: "78%", tone: "steel" },
];

function getToneClassName(tone: MultiplyPath["tone"]) {
  if (tone === "primary") {
    return styles.tonePrimary;
  }

  if (tone === "steel") {
    return styles.toneSteel;
  }

  return styles.toneGhost;
}

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
      const lead = section.querySelector<HTMLElement>("[data-lead]");
      const summary = section.querySelector<HTMLElement>("[data-summary]");
      const centerpiece = section.querySelector<HTMLElement>(`.${styles.centerpiece}`);
      const lossCards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-loss-card]")
      );
      const halos = Array.from(
        section.querySelectorAll<HTMLElement>("[data-halo]")
      );
      const endScene = section.querySelector<HTMLElement>("[data-end-scene]");
      const endTitle = section.querySelector<HTMLElement>("[data-end-title]");
      const endTitleMain = section.querySelector<HTMLElement>("[data-end-title-main]");
      const endTitleAccent = section.querySelector<HTMLElement>("[data-end-title-accent]");
      const endCaption = section.querySelector<HTMLElement>("[data-end-caption]");
      const multiplyGraphic = section.querySelector<HTMLElement>(
        "[data-multiply-graphic]"
      );
      const multiplyCore = section.querySelector<HTMLElement>("[data-multiply-core]");
      const multiplyPaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-multiply-path]")
      );
      const multiplyNodes = Array.from(
        section.querySelectorAll<HTMLElement>("[data-multiply-node]")
      );
      const orbits = Array.from(
        section.querySelectorAll<HTMLElement>("[data-orbit]")
      );
      const grid = section.querySelector<HTMLElement>(`.${styles.grid}`);

      const introCopy = [lead, summary].filter(
        (item): item is HTMLElement => Boolean(item)
      );

      if (
        !centerpiece ||
        !endScene ||
        !endTitle ||
        !endCaption ||
        !multiplyGraphic ||
        !multiplyCore
      ) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        multiplyPaths.forEach((path) => {
          gsap.set(path, {
            strokeDasharray: "none",
            strokeDashoffset: 0,
            opacity: 1,
          });
        });

        gsap.set(
          [
            ...meta,
            ...statChunks,
            ...introCopy,
            ...lossCards,
            ...halos,
            endScene,
            endTitle,
            endTitleMain,
            endTitleAccent,
            endCaption,
            multiplyGraphic,
            multiplyCore,
            ...multiplyNodes,
            ...orbits,
          ],
          { clearProps: "all" }
        );
      });

      media.add(
        "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(meta, { opacity: 0, y: 20 });
          gsap.set(statChunks, {
            opacity: 0,
            yPercent: 18,
            filter: "blur(12px)",
          });
          gsap.set(introCopy, {
            opacity: 0,
            y: 24,
            filter: "blur(10px)",
          });
          gsap.set(halos, {
            opacity: 0.14,
            scale: 0.82,
            transformOrigin: "center center",
          });
          gsap.set(lossCards, {
            opacity: 0,
            x: (_, target) =>
              Number((target as HTMLElement).dataset.floatX ?? 0),
            y: (_, target) =>
              Number((target as HTMLElement).dataset.floatY ?? 0),
            rotate: (_, target) =>
              Number((target as HTMLElement).dataset.rotate ?? 0),
            scale: 0.92,
            filter: "blur(14px)",
            transformOrigin: "center center",
          });
          gsap.set(endScene, {
            opacity: 0,
            y: 20,
            scale: 0.985,
            filter: "blur(12px)",
            pointerEvents: "none",
          });
          gsap.set(endTitle, {
            opacity: 1,
          });
          gsap.set(endTitleMain, {
            opacity: 0,
            y: 18,
            filter: "blur(10px)",
          });
          gsap.set(endTitleAccent, {
            opacity: 0,
            y: 10,
            scale: 0.94,
            filter: "blur(8px)",
          });
          gsap.set(multiplyGraphic, {
            opacity: 0,
            scale: 0.965,
            y: 18,
            filter: "blur(10px)",
            transformOrigin: "center top",
          });
          gsap.set(multiplyCore, {
            scale: 0.92,
            transformOrigin: "center center",
          });
          gsap.set(endCaption, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(multiplyNodes, {
            opacity: 0,
            scale: 0.72,
            transformOrigin: "center center",
          });
          gsap.set(orbits, {
            opacity: 0,
            scale: 0.78,
            transformOrigin: "center center",
          });

          multiplyPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0.18,
            });
          });

          if (grid) {
            gsap.set(grid, { opacity: 0.1 });
          }

          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: 0.8,
            },
          })
            .to(
              statChunks,
              {
                opacity: 1,
                yPercent: 0,
                filter: "blur(0px)",
                stagger: 0.08,
              },
              0
            )
            .to(
              halos,
              {
                opacity: (_, target) =>
                  Number((target as HTMLElement).dataset.opacity ?? 0.8),
                scale: 1,
                stagger: 0.05,
              },
              0.04
            )
            .to(
              meta,
              {
                opacity: 1,
                y: 0,
                stagger: 0.06,
              },
              0.1
            )
            .to(
              introCopy,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.08,
              },
              0.16
            );

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=2200",
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              lossCards,
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                filter: "blur(0px)",
                stagger: 0.04,
                duration: 0.36,
              },
              0.08
            )
            .to(
              lossCards,
              {
                x: (_, target) =>
                  Number((target as HTMLElement).dataset.collapseX ?? 0),
                y: (_, target) =>
                  Number((target as HTMLElement).dataset.collapseY ?? 0),
                scale: 0.72,
                opacity: 0,
                filter: "blur(12px)",
                stagger: 0.02,
                duration: 0.28,
              },
              0.78
            )
            .to(
              centerpiece,
              {
                opacity: 0.14,
                scale: 0.94,
                filter: "blur(12px)",
                transformOrigin: "center center",
                duration: 0.22,
              },
              0.94
            )
            .to(
              meta,
              {
                opacity: 0.3,
                duration: 0.18,
              },
              0.98
            )
            .to(
              endScene,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.24,
                pointerEvents: "auto",
              },
              1.18
            )
            .to(
              endTitleMain,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              1.22
            )
            .to(
              endTitleAccent,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.14,
              },
              1.26
            )
            .to(
              multiplyGraphic,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.24,
              },
              1.24
            )
            .to(
              multiplyCore,
              {
                scale: 1,
                duration: 0.18,
              },
              1.26
            )
            .to(
              orbits,
              {
                opacity: 1,
                scale: 1,
                stagger: 0.05,
                duration: 0.22,
              },
              1.28
            )
            .to(
              multiplyPaths,
              {
                strokeDashoffset: 0,
                opacity: 1,
                stagger: 0.03,
                duration: 0.34,
              },
              1.32
            )
            .to(
              multiplyNodes,
              {
                opacity: 1,
                scale: 1,
                stagger: 0.04,
                duration: 0.2,
              },
              1.36
            )
            .to(
              endCaption,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.2,
              },
              1.42
            );

          if (grid) {
            timeline.to(
              grid,
              {
                opacity: 0.2,
                duration: 0.22,
              },
              1.3
            );
          }
        }
      );

      media.add(
        "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(meta, { opacity: 0, y: 18 });
          gsap.set(statChunks, {
            opacity: 0,
            y: 24,
            filter: "blur(10px)",
          });
          gsap.set(introCopy, {
            opacity: 0,
            y: 22,
            filter: "blur(8px)",
          });
          gsap.set(halos, {
            opacity: 0.16,
            scale: 0.86,
            transformOrigin: "center center",
          });
          gsap.set(lossCards, {
            opacity: 0,
            y: 28,
            filter: "blur(10px)",
          });
          gsap.set(endScene, {
            opacity: 0,
            y: 18,
            scale: 0.985,
            filter: "blur(10px)",
          });
          gsap.set(endTitle, { opacity: 1 });
          gsap.set(endTitleMain, {
            opacity: 0,
            y: 18,
            filter: "blur(8px)",
          });
          gsap.set(endTitleAccent, {
            opacity: 0,
            y: 8,
            scale: 0.95,
            filter: "blur(8px)",
          });
          gsap.set(multiplyGraphic, {
            opacity: 0,
            scale: 0.97,
            y: 18,
            filter: "blur(8px)",
            transformOrigin: "center top",
          });
          gsap.set(multiplyCore, {
            scale: 0.94,
            transformOrigin: "center center",
          });
          gsap.set(endCaption, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(multiplyNodes, {
            opacity: 0,
            scale: 0.76,
            transformOrigin: "center center",
          });
          gsap.set(orbits, {
            opacity: 0,
            scale: 0.82,
            transformOrigin: "center center",
          });

          multiplyPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0.18,
            });
          });

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
            },
          })
            .to(meta, {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              duration: 0.48,
            })
            .to(
              statChunks,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.58,
              },
              0.04
            )
            .to(
              halos,
              {
                opacity: (_, target) =>
                  Number((target as HTMLElement).dataset.opacity ?? 0.8),
                scale: 1,
                stagger: 0.05,
                duration: 0.64,
              },
              0.08
            )
            .to(
              introCopy,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.54,
              },
              0.12
            );

          gsap.to(lossCards, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.62,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 62%",
            },
          });

          gsap.to(lossCards, {
            opacity: 0,
            y: -18,
            filter: "blur(10px)",
            stagger: 0.04,
            duration: 0.46,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "center 56%",
            },
          });

          gsap.to(centerpiece, {
            opacity: 0.12,
            scale: 0.95,
            filter: "blur(10px)",
            transformOrigin: "center center",
            duration: 0.42,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "center 54%",
            },
          });

          gsap.to(endScene, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.34,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 40%",
            },
          });

          gsap.to(endTitleMain, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 38%",
            },
          });

          gsap.to(endTitleAccent, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 36%",
            },
          });

          gsap.to(multiplyGraphic, {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.36,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 34%",
            },
          });

          gsap.to(multiplyCore, {
            scale: 1,
            duration: 0.24,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 33%",
            },
          });

          gsap.to(orbits, {
            opacity: 1,
            scale: 1,
            stagger: 0.05,
            duration: 0.44,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 32%",
            },
          });

          gsap.to(multiplyPaths, {
            strokeDashoffset: 0,
            opacity: 1,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "center 30%",
              end: "bottom 20%",
              scrub: 0.9,
            },
          });

          gsap.to(multiplyNodes, {
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            duration: 0.34,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 28%",
            },
          });

          gsap.to(endCaption, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 24%",
            },
          });
        }
      );

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
          data-opacity="0.68"
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
          <p data-lead className={styles.lead}>
            When context breaks, cost does not stay in one place.
          </p>

          <h2 className={styles.headline}>
            <span data-stat-chunk className={styles.amountLine}>
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

          <p data-summary className={styles.summary}>
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

        <div data-end-scene className={styles.endScene}>
          <p className={styles.endEyebrow}>Why projects lose alignment</p>
          <h3 data-end-title className={styles.endTitle}>
            <span data-end-title-main className={styles.endTitleMain}>
              The problem is not more data.
            </span>
            <span
              data-end-title-accent
              className={`${styles.endTitleAccent} ${styles.endTitleAccentLine}`}
            >
              It is disconnected information.
            </span>
          </h3>

          <div data-multiply-graphic className={styles.multiplyGraphic}>
            <div
              data-orbit
              className={`${styles.orbit} ${styles.orbitOuter}`}
            />
            <div
              data-orbit
              className={`${styles.orbit} ${styles.orbitMiddle}`}
            />
            <div
              data-orbit
              className={`${styles.orbit} ${styles.orbitInner}`}
            />

            <svg
              className={styles.multiplySvg}
              viewBox="0 0 800 460"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {MULTIPLY_PATHS.map((path) => (
                <path
                  key={path.d}
                  d={path.d}
                  data-multiply-path
                  className={`${styles.multiplyPath} ${getToneClassName(path.tone)}`}
                />
              ))}
            </svg>

            <div data-multiply-core className={styles.multiplyCore}>
              <p className={styles.coreKicker}>1 siloed update</p>
              <p className={styles.coreTitle}>slows the whole job</p>
            </div>

            {MULTIPLY_NODES.map((node) => (
              <div
                key={node.label}
                data-multiply-node
                className={`${styles.multiplyNode} ${getToneClassName(node.tone)}`}
                style={
                  {
                    "--node-top": node.top,
                    "--node-left": node.left,
                  } as CSSProperties
                }
              >
                <span>{node.label}</span>
              </div>
            ))}
          </div>

          <p data-end-caption className={styles.endCaption}>
            Estimators, planners, risk, construction, and leadership are all
            working to satisfy real requirements, but when information stays in
            silos the project reconnects itself late, manually, and usually in
            meetings.
          </p>
        </div>
      </div>
    </section>
  );
}
