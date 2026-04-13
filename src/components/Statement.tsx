"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

type Tone = "primary" | "steel" | "ghost";

interface PositionLabel {
  label: string;
  top?: string;
  left?: string;
}

interface TonePosition {
  label: string;
  top: string;
  left: string;
  tone: Tone;
}

interface PathDef {
  d: string;
  tone: Tone;
}

const ISSUE_ORGS: PositionLabel[] = [
  { label: "Client", top: "22%" },
  { label: "Designer", top: "38%" },
  { label: "Constructor", top: "56%" },
  { label: "Delivery", top: "74%" },
];

const ISSUE_ROLES: PositionLabel[] = [
  { label: "Estimating", left: "19%" },
  { label: "Planning", left: "35%" },
  { label: "Risk", left: "50%" },
  { label: "Construction", left: "68%" },
  { label: "Leadership", left: "83%" },
];

const ISSUE_SIGNALS: TonePosition[] = [
  { label: "Pricing", top: "26%", left: "31%", tone: "steel" },
  { label: "Design revisions", top: "34%", left: "63%", tone: "primary" },
  { label: "Programme risk", top: "48%", left: "41%", tone: "ghost" },
  { label: "Site constraints", top: "56%", left: "74%", tone: "steel" },
  { label: "Reporting", top: "22%", left: "78%", tone: "ghost" },
  { label: "Temporary works", top: "68%", left: "27%", tone: "primary" },
  { label: "Approvals", top: "70%", left: "58%", tone: "ghost" },
  { label: "Commercial", top: "44%", left: "21%", tone: "primary" },
];

const ISSUE_PATHS: PathDef[] = [
  { d: "M 138 126 C 198 126, 250 128, 294 130", tone: "ghost" },
  { d: "M 606 130 C 656 128, 704 128, 762 126", tone: "ghost" },
  { d: "M 138 216 C 206 214, 256 216, 294 220", tone: "steel" },
  { d: "M 606 220 C 652 216, 702 214, 762 214", tone: "primary" },
  { d: "M 138 314 C 206 314, 256 314, 294 314", tone: "ghost" },
  { d: "M 606 314 C 652 314, 702 314, 762 314", tone: "steel" },
  { d: "M 138 408 C 206 410, 256 408, 294 404", tone: "primary" },
  { d: "M 606 404 C 652 408, 704 410, 762 412", tone: "ghost" },
  { d: "M 190 72 C 190 112, 190 148, 190 182", tone: "steel" },
  { d: "M 190 392 C 190 432, 190 468, 190 510", tone: "ghost" },
  { d: "M 324 72 C 324 114, 324 150, 324 184", tone: "ghost" },
  { d: "M 324 392 C 324 432, 324 468, 324 510", tone: "primary" },
  { d: "M 450 72 C 450 112, 450 148, 450 182", tone: "steel" },
  { d: "M 450 392 C 450 432, 450 468, 450 510", tone: "ghost" },
  { d: "M 612 72 C 612 114, 612 150, 612 184", tone: "ghost" },
  { d: "M 612 392 C 612 432, 612 468, 612 510", tone: "steel" },
  { d: "M 750 72 C 750 112, 750 148, 750 182", tone: "primary" },
  { d: "M 750 392 C 750 432, 750 468, 750 510", tone: "ghost" },
];

const SOLUTION_COLS: PositionLabel[] = [
  { label: "Client", left: "22%" },
  { label: "Designer", left: "42%" },
  { label: "Constructor", left: "62%" },
  { label: "Delivery", left: "82%" },
];

const SOLUTION_ROWS: PositionLabel[] = [
  { label: "Estimating", top: "25%" },
  { label: "Planning", top: "38%" },
  { label: "Risk", top: "50%" },
  { label: "Construction", top: "62%" },
  { label: "Leadership", top: "75%" },
];

const SOLUTION_TAGS: TonePosition[] = [
  { label: "Project requirements", top: "19%", left: "21%", tone: "steel" },
  { label: "Leadership needs", top: "16%", left: "70%", tone: "ghost" },
  { label: "Design information", top: "34%", left: "80%", tone: "primary" },
  { label: "Commercial controls", top: "64%", left: "19%", tone: "primary" },
  { label: "Field conditions", top: "74%", left: "76%", tone: "steel" },
  { label: "Programme logic", top: "82%", left: "48%", tone: "ghost" },
];

const SOLUTION_PATHS: PathDef[] = [
  { d: "M 186 90 C 248 132, 294 178, 350 238", tone: "steel" },
  { d: "M 360 90 C 390 150, 408 188, 430 238", tone: "ghost" },
  { d: "M 540 90 C 510 150, 492 188, 470 238", tone: "primary" },
  { d: "M 714 90 C 652 132, 606 178, 550 238", tone: "steel" },
  { d: "M 110 198 C 188 214, 248 230, 334 256", tone: "ghost" },
  { d: "M 110 268 C 188 268, 248 268, 334 268", tone: "primary" },
  { d: "M 110 338 C 188 322, 248 306, 334 280", tone: "steel" },
  { d: "M 568 256 C 648 232, 708 214, 792 196", tone: "ghost" },
  { d: "M 568 280 C 648 280, 708 280, 792 280", tone: "steel" },
  { d: "M 568 304 C 648 328, 708 350, 792 384", tone: "primary" },
];

function getToneClassName(tone: Tone) {
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

      const meta = Array.from(section.querySelectorAll<HTMLElement>("[data-meta]"));
      const statChunks = Array.from(
        section.querySelectorAll<HTMLElement>("[data-stat-chunk]")
      );
      const lead = section.querySelector<HTMLElement>("[data-lead]");
      const summary = section.querySelector<HTMLElement>("[data-summary]");
      const centerpiece = section.querySelector<HTMLElement>(`.${styles.centerpiece}`);
      const halos = Array.from(section.querySelectorAll<HTMLElement>("[data-halo]"));
      const grid = section.querySelector<HTMLElement>(`.${styles.grid}`);

      const issueMatrix = section.querySelector<HTMLElement>("[data-issue-matrix]");
      const issueLabels = Array.from(
        section.querySelectorAll<HTMLElement>("[data-issue-label]")
      );
      const issueSignals = Array.from(
        section.querySelectorAll<HTMLElement>("[data-issue-signal]")
      );
      const issueCallout = section.querySelector<HTMLElement>("[data-issue-callout]");
      const issuePaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-issue-path]")
      );

      const solutionScene = section.querySelector<HTMLElement>("[data-solution-scene]");
      const solutionTitleMain = section.querySelector<HTMLElement>(
        "[data-solution-title-main]"
      );
      const solutionTitleAccent = section.querySelector<HTMLElement>(
        "[data-solution-title-accent]"
      );
      const solutionLead = section.querySelector<HTMLElement>("[data-solution-lead]");
      const solutionPanel = section.querySelector<HTMLElement>("[data-solution-panel]");
      const sharedLayer = section.querySelector<HTMLElement>("[data-shared-layer]");
      const solutionAxis = Array.from(
        section.querySelectorAll<HTMLElement>("[data-solution-axis]")
      );
      const solutionTags = Array.from(
        section.querySelectorAll<HTMLElement>("[data-solution-tag]")
      );
      const solutionCaption = section.querySelector<HTMLElement>(
        "[data-solution-caption]"
      );
      const solutionPaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-solution-path]")
      );

      const introCopy = [lead, summary].filter(
        (item): item is HTMLElement => Boolean(item)
      );

      if (
        !centerpiece ||
        !issueMatrix ||
        !solutionScene ||
        !solutionPanel ||
        !sharedLayer ||
        !solutionLead ||
        !solutionCaption ||
        !solutionTitleMain ||
        !solutionTitleAccent
      ) {
        return;
      }

      const allPaths = [...issuePaths, ...solutionPaths];
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        allPaths.forEach((path) => {
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
            ...halos,
            issueMatrix,
            ...issueLabels,
            ...issueSignals,
            issueCallout,
            solutionScene,
            solutionTitleMain,
            solutionTitleAccent,
            solutionLead,
            solutionPanel,
            sharedLayer,
            ...solutionAxis,
            ...solutionTags,
            solutionCaption,
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
            opacity: 0.16,
            scale: 0.82,
            transformOrigin: "center center",
          });
          gsap.set(issueMatrix, {
            opacity: 0,
            scale: 0.97,
            filter: "blur(14px)",
            transformOrigin: "center center",
          });
          gsap.set(issueLabels, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });
          gsap.set(issueSignals, {
            opacity: 0,
            scale: 0.82,
            filter: "blur(10px)",
            transformOrigin: "center center",
          });
          gsap.set(issueCallout, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });
          gsap.set(solutionScene, {
            opacity: 0,
            y: 20,
            scale: 0.985,
            filter: "blur(12px)",
            pointerEvents: "none",
          });
          gsap.set(solutionTitleMain, {
            opacity: 0,
            y: 18,
            filter: "blur(10px)",
          });
          gsap.set(solutionTitleAccent, {
            opacity: 0,
            y: 12,
            scale: 0.96,
            filter: "blur(8px)",
          });
          gsap.set(solutionLead, {
            opacity: 0,
            y: 16,
            filter: "blur(8px)",
          });
          gsap.set(solutionPanel, {
            opacity: 0,
            y: 24,
            scale: 0.975,
            filter: "blur(10px)",
            transformOrigin: "center top",
          });
          gsap.set(sharedLayer, {
            opacity: 0,
            y: 10,
            scale: 0.96,
            transformOrigin: "center center",
          });
          gsap.set(solutionAxis, {
            opacity: 0,
            y: 12,
            filter: "blur(8px)",
          });
          gsap.set(solutionTags, {
            opacity: 0,
            scale: 0.84,
            filter: "blur(8px)",
            transformOrigin: "center center",
          });
          gsap.set(solutionCaption, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });

          allPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0.16,
            });
          });

          if (grid) {
            gsap.set(grid, { opacity: 0.12 });
          }

          gsap
            .timeline({
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
            )
            .to(
              issueMatrix,
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              },
              0.18
            )
            .to(
              issueLabels,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.03,
              },
              0.22
            )
            .to(
              issuePaths,
              {
                strokeDashoffset: 0,
                opacity: 0.72,
                stagger: 0.02,
                duration: 0.24,
              },
              0.24
            )
            .to(
              issueSignals,
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                stagger: 0.04,
                duration: 0.26,
              },
              0.28
            )
            .to(
              issueCallout,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
              0.32
            );

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=2350",
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              issueSignals,
              {
                opacity: 0.2,
                scale: 0.84,
                filter: "blur(10px)",
                stagger: 0.02,
                duration: 0.18,
              },
              0.48
            )
            .to(issueLabels, { opacity: 0.3, duration: 0.16 }, 0.5)
            .to(
              issueCallout,
              {
                opacity: 0,
                y: -10,
                filter: "blur(8px)",
                duration: 0.16,
              },
              0.52
            )
            .to(
              issueMatrix,
              {
                opacity: 0.24,
                scale: 0.985,
                filter: "blur(12px)",
                duration: 0.22,
              },
              0.56
            )
            .to(
              centerpiece,
              {
                opacity: 0.12,
                scale: 0.94,
                filter: "blur(12px)",
                transformOrigin: "center center",
                duration: 0.22,
              },
              0.58
            )
            .to(meta, { opacity: 0.3, duration: 0.16 }, 0.6)
            .to(
              solutionScene,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.26,
                pointerEvents: "auto",
              },
              0.86
            )
            .to(
              solutionTitleMain,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              0.92
            )
            .to(
              solutionTitleAccent,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.16,
              },
              0.96
            )
            .to(
              solutionLead,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              1
            )
            .to(
              solutionPanel,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.24,
              },
              1
            )
            .to(sharedLayer, { opacity: 1, y: 0, scale: 1, duration: 0.18 }, 1.06)
            .to(
              solutionAxis,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.03,
                duration: 0.18,
              },
              1.08
            )
            .to(
              solutionPaths,
              {
                strokeDashoffset: 0,
                opacity: 1,
                stagger: 0.03,
                duration: 0.28,
              },
              1.12
            )
            .to(
              solutionTags,
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                stagger: 0.04,
                duration: 0.2,
              },
              1.16
            )
            .to(
              solutionCaption,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.2,
              },
              1.2
            );

          if (grid) {
            timeline.to(grid, { opacity: 0.2, duration: 0.2 }, 1.08);
          }
        }
      );

      media.add(
        "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(meta, { opacity: 0, y: 18 });
          gsap.set(statChunks, { opacity: 0, y: 24, filter: "blur(10px)" });
          gsap.set(introCopy, { opacity: 0, y: 22, filter: "blur(8px)" });
          gsap.set(halos, {
            opacity: 0.16,
            scale: 0.86,
            transformOrigin: "center center",
          });
          gsap.set(issueMatrix, {
            opacity: 0,
            y: 20,
            scale: 0.98,
            filter: "blur(10px)",
          });
          gsap.set(issueLabels, { opacity: 0, y: 10, filter: "blur(8px)" });
          gsap.set(issueSignals, { opacity: 0, y: 18, filter: "blur(8px)" });
          gsap.set(issueCallout, { opacity: 0, y: 12, filter: "blur(8px)" });
          gsap.set(solutionScene, {
            opacity: 0,
            y: 18,
            scale: 0.985,
            filter: "blur(10px)",
          });
          gsap.set(solutionTitleMain, { opacity: 0, y: 18, filter: "blur(8px)" });
          gsap.set(solutionTitleAccent, {
            opacity: 0,
            y: 10,
            scale: 0.96,
            filter: "blur(8px)",
          });
          gsap.set(solutionLead, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(solutionPanel, {
            opacity: 0,
            y: 18,
            scale: 0.985,
            filter: "blur(8px)",
          });
          gsap.set(sharedLayer, { opacity: 0, scale: 0.96 });
          gsap.set(solutionAxis, { opacity: 0, y: 10, filter: "blur(8px)" });
          gsap.set(solutionTags, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(solutionCaption, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });

          allPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0.18,
            });
          });

          gsap
            .timeline({
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
              duration: 0.46,
            })
            .to(
              statChunks,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.56,
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
                duration: 0.62,
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
                duration: 0.52,
              },
              0.1
            )
            .to(
              issueMatrix,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.54,
              },
              0.14
            )
            .to(
              issueLabels,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.03,
                duration: 0.34,
              },
              0.18
            )
            .to(
              issuePaths,
              {
                strokeDashoffset: 0,
                opacity: 0.7,
                stagger: 0.02,
                duration: 0.3,
              },
              0.2
            )
            .to(
              issueSignals,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.05,
                duration: 0.34,
              },
              0.24
            )
            .to(
              issueCallout,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.28,
              },
              0.28
            );

          gsap.to(issueMatrix, {
            opacity: 0.26,
            y: -12,
            filter: "blur(10px)",
            duration: 0.4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: section,
              start: "center 58%",
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
              start: "center 56%",
            },
          });

          gsap.to(solutionScene, {
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

          gsap.to(solutionTitleMain, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 38%",
            },
          });

          gsap.to(solutionTitleAccent, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.22,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 36%",
            },
          });

          gsap.to(solutionLead, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 34%",
            },
          });

          gsap.to(solutionPanel, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.36,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 32%",
            },
          });

          gsap.to(sharedLayer, {
            opacity: 1,
            scale: 1,
            duration: 0.22,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 30%",
            },
          });

          gsap.to(solutionAxis, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.03,
            duration: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 28%",
            },
          });

          gsap.to(solutionPaths, {
            strokeDashoffset: 0,
            opacity: 1,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "center 26%",
              end: "bottom 24%",
              scrub: 0.9,
            },
          });

          gsap.to(solutionTags, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.04,
            duration: 0.32,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 24%",
            },
          });

          gsap.to(solutionCaption, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 22%",
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
          data-opacity="0.8"
          className={`${styles.halo} ${styles.haloPrimary}`}
        />
        <div
          data-halo
          data-opacity="0.66"
          className={`${styles.halo} ${styles.haloSecondary}`}
        />
        <div className={styles.datumField} aria-hidden="true">
          <div className={`${styles.datumRing} ${styles.datumRingOuter}`} />
          <div className={`${styles.datumRing} ${styles.datumRingInner}`} />
          <div className={`${styles.datumAxis} ${styles.datumAxisHorizontal}`} />
          <div className={`${styles.datumAxis} ${styles.datumAxisVertical}`} />
          <div className={`${styles.datumArc} ${styles.datumArcLeft}`} />
          <div className={`${styles.datumArc} ${styles.datumArcRight}`} />
        </div>

        <div className={styles.metaRow}>
          <p data-meta className={styles.kicker}>
            The Industry Gap
          </p>
          <p data-meta className={styles.microStat}>
            Fragmented information disconnects client, designer, constructor,
            and delivery teams long before the project feels it in the field.
          </p>
        </div>

        <div className={styles.centerpiece}>
          <p data-lead className={styles.lead}>
            When every organisation carries its own picture of the job,
            alignment happens too late.
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
            The loss compounds when client, designer, constructor, and delivery
            teams all manage valid requirements in parallel, but the
            information needed to satisfy them stays siloed until meetings,
            follow-up, and manual coordination reconnect it.
          </p>
        </div>

        <div data-issue-matrix className={styles.issueMatrix}>
          <div className={styles.issueFrame} />
          <svg
            className={styles.issueSvg}
            viewBox="0 0 900 580"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {ISSUE_PATHS.map((path) => (
              <path
                key={path.d}
                d={path.d}
                data-issue-path
                className={`${styles.issuePath} ${getToneClassName(path.tone)}`}
              />
            ))}
          </svg>

          {ISSUE_ORGS.map((org) => (
            <div
              key={org.label}
              data-issue-label
              className={styles.issueOrg}
              style={{ "--issue-top": org.top } as CSSProperties}
            >
              <span>{org.label}</span>
            </div>
          ))}

          {ISSUE_ROLES.map((role) => (
            <div
              key={role.label}
              data-issue-label
              className={styles.issueRole}
              style={{ "--issue-left": role.left } as CSSProperties}
            >
              <span>{role.label}</span>
            </div>
          ))}

          {ISSUE_SIGNALS.map((signal) => (
            <div
              key={signal.label}
              data-issue-signal
              className={`${styles.issueSignal} ${getToneClassName(signal.tone)}`}
              style={
                {
                  "--signal-top": signal.top,
                  "--signal-left": signal.left,
                } as CSSProperties
              }
            >
              <span>{signal.label}</span>
            </div>
          ))}

          <div data-issue-callout className={styles.issueCallout}>
            <span>The project gets reconnected manually, long after people needed shared visibility.</span>
          </div>
        </div>

        <div data-solution-scene className={styles.solutionScene}>
          <p className={styles.solutionEyebrow}>How Infraforma closes the gap</p>
          <h3 className={styles.solutionTitle}>
            <span data-solution-title-main className={styles.solutionTitleMain}>
              We organise the information
            </span>
            <span
              data-solution-title-accent
              className={`${styles.solutionTitleAccent} ${styles.solutionTitleAccentLine}`}
            >
              that keeps the whole project aligned.
            </span>
          </h3>

          <p data-solution-lead className={styles.solutionLead}>
            Infraforma maps project requirements, leadership needs, design
            inputs, risk, programme, commercial, and field information into one
            accessible structure so client, designer, constructor, and delivery
            teams can coordinate continuously instead of reconnecting the job
            later.
          </p>

          <div data-solution-panel className={styles.solutionPanel}>
            <div className={styles.solutionPanelGrid} />

            {SOLUTION_COLS.map((col) => (
              <div
                key={col.label}
                data-solution-axis
                className={styles.solutionCol}
                style={{ "--col-left": col.left } as CSSProperties}
              >
                <span>{col.label}</span>
              </div>
            ))}

            {SOLUTION_ROWS.map((row) => (
              <div
                key={row.label}
                data-solution-axis
                className={styles.solutionRow}
                style={{ "--row-top": row.top } as CSSProperties}
              >
                <span>{row.label}</span>
              </div>
            ))}

            <svg
              className={styles.solutionSvg}
              viewBox="0 0 900 540"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {SOLUTION_PATHS.map((path) => (
                <path
                  key={path.d}
                  d={path.d}
                  data-solution-path
                  className={`${styles.solutionPath} ${getToneClassName(path.tone)}`}
                />
              ))}
            </svg>

            <div data-shared-layer className={styles.sharedLayer}>
              <p className={styles.sharedLayerKicker}>
                Shared information management layer
              </p>
              <p className={styles.sharedLayerText}>
                Requirements, decisions, source information, and delivery needs
                connected in one accessible project environment.
              </p>
            </div>

            {SOLUTION_TAGS.map((tag) => (
              <div
                key={tag.label}
                data-solution-tag
                className={`${styles.solutionTag} ${getToneClassName(tag.tone)}`}
                style={
                  {
                    "--tag-top": tag.top,
                    "--tag-left": tag.left,
                  } as CSSProperties
                }
              >
                <span>{tag.label}</span>
              </div>
            ))}
          </div>

          <p data-solution-caption className={styles.solutionCaption}>
            Every organisation keeps its own responsibilities, but the
            information required to satisfy them becomes visible, structured,
            and usable across the project.
          </p>
        </div>
      </div>
    </section>
  );
}
