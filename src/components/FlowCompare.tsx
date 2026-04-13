"use client";

import { startTransition, type CSSProperties, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./FlowCompare.module.css";

type Tone = "primary" | "steel" | "ghost";

interface Chapter {
  step: string;
  label: string;
  title: string;
  text: string;
  detail: string;
  bullets: string[];
  visualStage: 0 | 1 | 2;
}

interface SignalChip {
  label: string;
  top: string;
  left: string;
  tone: Tone;
  stage0X: number;
  stage0Y: number;
  stage1X: number;
  stage1Y: number;
  stage2X: number;
  stage2Y: number;
}

interface FloatChip {
  label: string;
  top: string;
  left: string;
  tone: Tone;
}

interface PathDef {
  d: string;
  tone: Tone;
}

const CHAPTERS: Chapter[] = [
  {
    step: "01",
    label: "Understand",
    title: "We start with the real needs of each team.",
    text: "Estimators, planners, risk leads, construction managers, and leadership are each trying to satisfy different requirements from the same project. We begin by understanding those concerns, decision points, and information needs instead of forcing everyone into one generic workflow.",
    detail:
      "That includes project requirements, leadership reporting needs, and the information each team must trust to do its job well.",
    bullets: [
      "Estimator, planner, risk, construction, and leadership needs are defined up front.",
      "Project requirements and reporting needs are mapped early.",
    ],
    visualStage: 0,
  },
  {
    step: "02",
    label: "Organise",
    title: "We organise the requirements and information in one structure.",
    text: "Infraforma brings project requirements, delivery constraints, leadership needs, and source information into one shared information-management structure. Instead of each team holding its own partial picture, the project works from one organised view.",
    detail:
      "The goal is not more documents. It is making sure the right information exists, is connected to the right requirement, and is easy to find when decisions need to be made.",
    bullets: [
      "Requirements, decisions, and supporting information are linked together.",
      "One organised project picture replaces parallel discipline silos.",
    ],
    visualStage: 1,
  },
  {
    step: "03",
    label: "Access",
    title: "We make the information accessible so teams can help each other move.",
    text: "Too often teams work internally and only share their information in weekly meetings. Infraforma makes the information available in the flow of work, so planners can see risk implications earlier, construction can see what estimating or design needs, and leadership can see what is really moving.",
    detail:
      "No-silo working is much easier said than done unless people can actually access the information they need from the rest of the project at the right time.",
    bullets: [
      "Less waiting for weekly meetings to reconnect the project.",
      "Teams can unblock each other from the same information base.",
    ],
    visualStage: 2,
  },
  {
    step: "04",
    label: "Align",
    title: "This is information management built for delivery.",
    text: "The result is better coordination across estimating, planning, risk, construction, and leadership. The project spends less time chasing information and more time using it to satisfy requirements, support decisions, and move the work forward together.",
    detail:
      "That is how Infraforma helps: not by adding another silo, but by making project information accessible, organised, and useful to the people delivering the job.",
    bullets: [
      "Accessible information for the people delivering the project.",
      "Stronger coordination, clearer visibility, and fewer silos.",
    ],
    visualStage: 2,
  },
];

const SIGNAL_CHIPS: SignalChip[] = [
  {
    label: "Project requirements",
    top: "13%",
    left: "6%",
    tone: "primary",
    stage0X: -20,
    stage0Y: -8,
    stage1X: 96,
    stage1Y: 48,
    stage2X: 132,
    stage2Y: 82,
  },
  {
    label: "Leadership needs",
    top: "10%",
    left: "21%",
    tone: "ghost",
    stage0X: -12,
    stage0Y: -18,
    stage1X: 82,
    stage1Y: 30,
    stage2X: 122,
    stage2Y: 56,
  },
  {
    label: "Estimator inputs",
    top: "31%",
    left: "3%",
    tone: "steel",
    stage0X: -14,
    stage0Y: -4,
    stage1X: 104,
    stage1Y: 18,
    stage2X: 142,
    stage2Y: 30,
  },
  {
    label: "Planning logic",
    top: "49%",
    left: "6%",
    tone: "ghost",
    stage0X: -10,
    stage0Y: 10,
    stage1X: 102,
    stage1Y: 2,
    stage2X: 144,
    stage2Y: -6,
  },
  {
    label: "Risk controls",
    top: "68%",
    left: "9%",
    tone: "primary",
    stage0X: -6,
    stage0Y: 18,
    stage1X: 94,
    stage1Y: -24,
    stage2X: 136,
    stage2Y: -50,
  },
  {
    label: "Site constraints",
    top: "82%",
    left: "20%",
    tone: "steel",
    stage0X: 8,
    stage0Y: 14,
    stage1X: 72,
    stage1Y: -66,
    stage2X: 112,
    stage2Y: -110,
  },
];

const META_CHIPS: FloatChip[] = [
  { label: "Shared requirement map", top: "22%", left: "58%", tone: "steel" },
  { label: "Information ownership", top: "34%", left: "72%", tone: "primary" },
  { label: "Decision context", top: "50%", left: "76%", tone: "ghost" },
  { label: "Accessible source info", top: "66%", left: "70%", tone: "steel" },
  { label: "Programme visibility", top: "76%", left: "56%", tone: "primary" },
  { label: "Status + responsibility", top: "22%", left: "42%", tone: "ghost" },
];

const OUTCOME_CHIPS: FloatChip[] = [
  { label: "Teams help each other", top: "20%", left: "84%", tone: "primary" },
  { label: "Fewer weekly surprises", top: "38%", left: "88%", tone: "steel" },
  { label: "Faster handoffs", top: "58%", left: "84%", tone: "ghost" },
  { label: "One project picture", top: "78%", left: "80%", tone: "primary" },
];

const PROCESS_BANDS = [
  {
    label: "Needs",
    text: "Role needs, project requirements, and leadership asks are understood together.",
  },
  {
    label: "Organise",
    text: "Requirements, source information, ownership, and status are connected in one structure.",
  },
  {
    label: "Access",
    text: "Teams can find what they need early enough to help each other move the job.",
  },
];

const METRICS = [
  { value: "1", label: "shared project picture" },
  { value: "Live", label: "accessible information" },
  { value: "Earlier", label: "cross-team coordination" },
];

const INPUT_PATHS: PathDef[] = [
  { d: "M 118 106 C 220 110, 286 148, 350 208", tone: "primary" },
  { d: "M 204 94 C 266 110, 308 140, 356 182", tone: "ghost" },
  { d: "M 98 212 C 218 216, 286 244, 352 264", tone: "steel" },
  { d: "M 120 324 C 222 324, 292 326, 356 332", tone: "ghost" },
  { d: "M 138 446 C 226 430, 296 408, 356 392", tone: "primary" },
  { d: "M 214 556 C 288 522, 326 482, 362 438", tone: "steel" },
];

const OUTPUT_PATHS: PathDef[] = [
  { d: "M 560 214 C 640 194, 706 166, 792 136", tone: "primary" },
  { d: "M 560 288 C 648 278, 718 256, 812 244", tone: "steel" },
  { d: "M 560 366 C 648 372, 714 394, 792 408", tone: "ghost" },
  { d: "M 560 434 C 640 458, 694 490, 760 532", tone: "primary" },
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

export default function FlowCompare() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const introItems = Array.from(
        section.querySelectorAll<HTMLElement>("[data-intro-item]")
      );
      const visualShell = section.querySelector<HTMLElement>("[data-visual-shell]");
      const stageCards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-stage-card]")
      );

      if (!visualShell || stageCards.length === 0) {
        return;
      }

      const currentStage = { value: 0 };

      const setStage = (index: number) => {
        if (currentStage.value === index) {
          return;
        }

        currentStage.value = index;
        startTransition(() => setActiveStage(index));
      };

      stageCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 58%",
          end: "bottom 44%",
          onEnter: () => setStage(index),
          onEnterBack: () => setStage(index),
        });
      });

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(introItems, {
          opacity: 0,
          y: 28,
          filter: "blur(12px)",
        });
        gsap.set(visualShell, {
          opacity: 0,
          y: 34,
          scale: 0.985,
          filter: "blur(14px)",
        });
        gsap.set(stageCards, {
          opacity: 0,
          y: 42,
          filter: "blur(10px)",
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
            },
          })
          .to(introItems, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.84,
            ease: "power3.out",
          })
          .to(
            visualShell,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.92,
              ease: "power3.out",
            },
            0.08
          )
          .to(
            stageCards,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.1,
              duration: 0.76,
              ease: "power3.out",
            },
            0.18
          )
          .set(stageCards, {
            clearProps: "opacity,transform,filter",
          });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  const visualStage = CHAPTERS[activeStage]?.visualStage ?? 0;

  return (
    <section
      ref={sectionRef}
      id="delivery-environment"
      className={styles.section}
      data-visual-stage={visualStage}
    >
      <div className={`${styles.inner} page-container`}>
        <header className={styles.header}>
          <p data-intro-item className={styles.kicker}>
            Information Management
          </p>

          <div className={styles.headingRow}>
            <h2 data-intro-item className={styles.headline}>
              We organise project information so every team can move the job
              forward together.
            </h2>

            <p data-intro-item className={styles.intro}>
              Estimators, planners, risk, construction managers, and
              leadership all have legitimate requirements. Infraforma brings
              those needs and the information required to satisfy them into one
              accessible environment, so the project does not have to reconnect
              itself in weekly meetings.
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.visualColumn}>
            <div data-visual-shell className={styles.visualSticky}>
              <div className={styles.visualPanel}>
                <div className={styles.panelGlow} />
                <div className={styles.panelGlowSecondary} />
                <div className={styles.panelGrid} />
                <div className={styles.carryoverHalo} />
                <div className={styles.outputGlow} />

                <svg
                  className={styles.visualSvg}
                  viewBox="0 0 900 680"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {INPUT_PATHS.map((path) => (
                    <path
                      key={path.d}
                      d={path.d}
                      className={`${styles.connectionPath} ${styles.inputPath} ${getToneClassName(path.tone)}`}
                    />
                  ))}

                  {OUTPUT_PATHS.map((path) => (
                    <path
                      key={path.d}
                      d={path.d}
                      className={`${styles.connectionPath} ${styles.outputPath} ${getToneClassName(path.tone)}`}
                    />
                  ))}
                </svg>

                {SIGNAL_CHIPS.map((chip) => (
                  <div
                    key={chip.label}
                    className={`${styles.signalChip} ${getToneClassName(chip.tone)}`}
                    style={
                      {
                        "--chip-top": chip.top,
                        "--chip-left": chip.left,
                        "--stage0-x": `${chip.stage0X}px`,
                        "--stage0-y": `${chip.stage0Y}px`,
                        "--stage1-x": `${chip.stage1X}px`,
                        "--stage1-y": `${chip.stage1Y}px`,
                        "--stage2-x": `${chip.stage2X}px`,
                        "--stage2-y": `${chip.stage2Y}px`,
                      } as CSSProperties
                    }
                  >
                    <span>{chip.label}</span>
                  </div>
                ))}

                <div className={styles.core}>
                  <div className={styles.coreRingOuter} />
                  <div className={styles.coreRingInner} />

                  <div className={styles.coreHeader}>
                    <p className={styles.coreKicker}>Infraforma information management</p>
                    <p className={styles.coreTitle}>
                      Project needs organised. Information accessible. Teams
                      aligned.
                    </p>
                  </div>

                  <div className={styles.bandStack}>
                    {PROCESS_BANDS.map((band, index) => (
                      <div key={band.label} data-band={index} className={styles.band}>
                        <span className={styles.bandLabel}>{band.label}</span>
                        <span className={styles.bandText}>{band.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {META_CHIPS.map((chip) => (
                  <div
                    key={chip.label}
                    className={`${styles.metaChip} ${getToneClassName(chip.tone)}`}
                    style={
                      {
                        "--float-top": chip.top,
                        "--float-left": chip.left,
                      } as CSSProperties
                    }
                  >
                    <span>{chip.label}</span>
                  </div>
                ))}

                {OUTCOME_CHIPS.map((chip) => (
                  <div
                    key={chip.label}
                    className={`${styles.outcomeChip} ${getToneClassName(chip.tone)}`}
                    style={
                      {
                        "--float-top": chip.top,
                        "--float-left": chip.left,
                      } as CSSProperties
                    }
                  >
                    <span>{chip.label}</span>
                  </div>
                ))}

                <div className={styles.metricRow}>
                  {METRICS.map((metric) => (
                    <article key={metric.label} className={styles.metric}>
                      <p className={styles.metricValue}>{metric.value}</p>
                      <p className={styles.metricLabel}>{metric.label}</p>
                    </article>
                  ))}
                </div>

                <div className={styles.meter}>
                  {PROCESS_BANDS.map((band, index) => (
                    <div
                      key={band.label}
                      className={`${styles.meterItem} ${
                        visualStage === index ? styles.meterItemActive : ""
                      }`}
                    >
                      <span className={styles.meterLabel}>{band.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.copyColumn}>
            {CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.step}
                data-stage-card
                className={`${styles.chapter} ${
                  index === activeStage ? styles.chapterActive : ""
                }`}
              >
                <div className={styles.chapterStep}>{chapter.step}</div>

                <div className={styles.chapterBody}>
                  <p className={styles.chapterKicker}>{chapter.label}</p>
                  <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                  <p className={styles.chapterText}>{chapter.text}</p>
                  <p className={styles.chapterDetail}>{chapter.detail}</p>

                  <div className={styles.chapterBullets}>
                    {chapter.bullets.map((bullet) => (
                      <span key={bullet} className={styles.chapterPill}>
                        {bullet}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
