"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

type PlaneTone = "graphite" | "steel" | "paper" | "blue";

interface TracePlaneDef {
  index: string;
  label: string;
  note: string;
  tone: PlaneTone;
  width: string;
  height: string;
  layer: number;
}

interface PlaneState {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

const TRACE_PLANES: TracePlaneDef[] = [
  {
    index: "01",
    label: "Client",
    note: "governance + assurance",
    tone: "paper",
    width: "52%",
    height: "36%",
    layer: 1,
  },
  {
    index: "02",
    label: "Designer",
    note: "design intent + interfaces",
    tone: "steel",
    width: "58%",
    height: "40%",
    layer: 2,
  },
  {
    index: "03",
    label: "Constructor",
    note: "field delivery + constraints",
    tone: "graphite",
    width: "64%",
    height: "45%",
    layer: 4,
  },
  {
    index: "04",
    label: "Delivery",
    note: "programme + commercial control",
    tone: "blue",
    width: "56%",
    height: "38%",
    layer: 3,
  },
];

const CORE_STRIPS = [
  "Project requirements",
  "Decisions and approvals",
  "Delivery information",
];

const DESKTOP_PLANE_STATES: PlaneState[] = [
  { x: -220, y: -136, rotate: -8, scale: 1.02 },
  { x: 200, y: -88, rotate: 6, scale: 1.01 },
  { x: 232, y: 126, rotate: 8, scale: 1.03 },
  { x: -176, y: 132, rotate: -6, scale: 1.01 },
];

const MOBILE_PLANE_STATES: PlaneState[] = [
  { x: -54, y: -84, rotate: -6, scale: 1.01 },
  { x: 48, y: -34, rotate: 5, scale: 1 },
  { x: 56, y: 58, rotate: 6, scale: 1.02 },
  { x: -44, y: 72, rotate: -5, scale: 1 },
];

function getPlaneToneClassName(tone: PlaneTone) {
  if (tone === "graphite") {
    return styles.planeGraphite;
  }

  if (tone === "steel") {
    return styles.planeSteel;
  }

  if (tone === "blue") {
    return styles.planeBlue;
  }

  return styles.planePaper;
}

function applyPlaneStates(planes: HTMLElement[], states: PlaneState[], opacity = 0.82) {
  planes.forEach((plane, index) => {
    const state = states[index];
    if (!state) return;

    gsap.set(plane, {
      x: state.x,
      y: state.y,
      rotate: state.rotate,
      scale: state.scale,
      opacity,
      transformOrigin: "center center",
    });
  });
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
      const introCopy = Array.from(
        section.querySelectorAll<HTMLElement>("[data-intro-copy]")
      );
      const datum = section.querySelector<HTMLElement>("[data-datum]");
      const traceField = section.querySelector<HTMLElement>("[data-trace-field]");
      const planes = Array.from(section.querySelectorAll<HTMLElement>("[data-plane]"));
      const centerpiece = section.querySelector<HTMLElement>("[data-centerpiece]");
      const solutionScene = section.querySelector<HTMLElement>("[data-solution-scene]");
      const solutionTitleMain = section.querySelector<HTMLElement>(
        "[data-solution-title-main]"
      );
      const solutionTitleAccent = section.querySelector<HTMLElement>(
        "[data-solution-title-accent]"
      );
      const solutionLead = section.querySelector<HTMLElement>("[data-solution-lead]");
      const solutionCore = section.querySelector<HTMLElement>("[data-solution-core]");
      const coreStrips = Array.from(
        section.querySelectorAll<HTMLElement>("[data-core-strip]")
      );
      const solutionCaption = section.querySelector<HTMLElement>(
        "[data-solution-caption]"
      );

      if (
        !datum ||
        !traceField ||
        !centerpiece ||
        !solutionScene ||
        !solutionTitleMain ||
        !solutionTitleAccent ||
        !solutionLead ||
        !solutionCore ||
        !solutionCaption
      ) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ...meta,
            ...statChunks,
            ...introCopy,
            datum,
            traceField,
            ...planes,
            solutionScene,
            solutionTitleMain,
            solutionTitleAccent,
            solutionLead,
            solutionCore,
            ...coreStrips,
            solutionCaption,
          ],
          { clearProps: "all" }
        );
      });

      media.add(
        "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(meta, { opacity: 0, y: 18 });
          gsap.set(statChunks, {
            opacity: 0,
            yPercent: 14,
            filter: "blur(10px)",
          });
          gsap.set(introCopy, {
            opacity: 0,
            y: 22,
            filter: "blur(10px)",
          });
          gsap.set(datum, {
            opacity: 0.14,
            scale: 0.9,
            transformOrigin: "center center",
          });
          gsap.set(traceField, { opacity: 0 });
          applyPlaneStates(planes, DESKTOP_PLANE_STATES, 0.74);

          gsap.set(solutionScene, {
            opacity: 0,
            y: 24,
            scale: 0.985,
            filter: "blur(12px)",
            pointerEvents: "none",
          });
          gsap.set(solutionTitleMain, {
            opacity: 0,
            y: 16,
            filter: "blur(10px)",
          });
          gsap.set(solutionTitleAccent, {
            opacity: 0,
            y: 16,
            filter: "blur(10px)",
          });
          gsap.set(solutionLead, {
            opacity: 0,
            y: 16,
            filter: "blur(8px)",
          });
          gsap.set(solutionCore, {
            opacity: 0,
            y: 22,
            scale: 0.98,
            filter: "blur(10px)",
            transformOrigin: "center center",
          });
          gsap.set(coreStrips, {
            opacity: 0,
            y: 12,
            filter: "blur(8px)",
          });
          gsap.set(solutionCaption, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });

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
              datum,
              {
                opacity: 0.28,
                scale: 1,
              },
              0
            )
            .to(
              traceField,
              {
                opacity: 1,
              },
              0.05
            )
            .to(
              meta,
              {
                opacity: 1,
                y: 0,
                stagger: 0.06,
              },
              0.08
            )
            .to(
              statChunks,
              {
                opacity: 1,
                yPercent: 0,
                filter: "blur(0px)",
                stagger: 0.08,
              },
              0.12
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
              planes,
              {
                opacity: 0.9,
                stagger: 0.04,
              },
              0.18
            );

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=2150",
              scrub: 0.85,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(
              planes,
              {
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                opacity: (index) => 0.92 - index * 0.08,
                stagger: 0.04,
                duration: 0.32,
              },
              0.12
            )
            .to(
              datum,
              {
                opacity: 0.22,
                scale: 1.05,
                duration: 0.28,
              },
              0.18
            )
            .to(
              centerpiece,
              {
                opacity: 0.14,
                y: -20,
                scale: 0.94,
                filter: "blur(12px)",
                transformOrigin: "center center",
                duration: 0.26,
              },
              0.62
            )
            .to(
              solutionScene,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.24,
                pointerEvents: "auto",
              },
              0.78
            )
            .to(
              solutionTitleMain,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              0.84
            )
            .to(
              solutionTitleAccent,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              0.88
            )
            .to(
              solutionLead,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              0.94
            )
            .to(
              solutionCore,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.22,
              },
              0.98
            )
            .to(
              coreStrips,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.04,
                duration: 0.18,
              },
              1.02
            )
            .to(
              solutionCaption,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.18,
              },
              1.08
            );
        }
      );

      media.add(
        "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(meta, { opacity: 0, y: 18 });
          gsap.set(statChunks, { opacity: 0, y: 20, filter: "blur(10px)" });
          gsap.set(introCopy, { opacity: 0, y: 18, filter: "blur(8px)" });
          gsap.set(datum, {
            opacity: 0.16,
            scale: 0.92,
            transformOrigin: "center center",
          });
          gsap.set(traceField, { opacity: 0 });
          applyPlaneStates(planes, MOBILE_PLANE_STATES, 0.78);

          gsap.set(solutionScene, {
            opacity: 0,
            y: 20,
            scale: 0.99,
            filter: "blur(10px)",
          });
          gsap.set(solutionTitleMain, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(solutionTitleAccent, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
          });
          gsap.set(solutionLead, { opacity: 0, y: 14, filter: "blur(8px)" });
          gsap.set(solutionCore, {
            opacity: 0,
            y: 18,
            scale: 0.985,
            filter: "blur(8px)",
          });
          gsap.set(coreStrips, { opacity: 0, y: 12, filter: "blur(8px)" });
          gsap.set(solutionCaption, {
            opacity: 0,
            y: 14,
            filter: "blur(8px)",
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
              duration: 0.42,
            })
            .to(
              datum,
              {
                opacity: 0.24,
                scale: 1,
                duration: 0.52,
              },
              0.04
            )
            .to(
              traceField,
              {
                opacity: 1,
                duration: 0.46,
              },
              0.08
            )
            .to(
              statChunks,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.08,
                duration: 0.52,
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
                duration: 0.46,
              },
              0.14
            )
            .to(
              planes,
              {
                opacity: 0.9,
                stagger: 0.04,
                duration: 0.34,
              },
              0.16
            );

          gsap.to(planes, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: (index) => 0.92 - index * 0.08,
            stagger: 0.04,
            duration: 0.36,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 58%",
            },
          });

          gsap.to(centerpiece, {
            opacity: 0.16,
            y: -12,
            scale: 0.95,
            filter: "blur(10px)",
            transformOrigin: "center center",
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "center 48%",
            },
          });

          gsap.to(solutionScene, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.32,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 34%",
            },
          });

          gsap.to(solutionTitleMain, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 32%",
            },
          });

          gsap.to(solutionTitleAccent, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 30%",
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
              start: "center 28%",
            },
          });

          gsap.to(solutionCore, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 24%",
            },
          });

          gsap.to(coreStrips, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.04,
            duration: 0.28,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "center 22%",
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
              start: "center 20%",
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
        <div className={styles.glow} />

        <div data-datum className={styles.datumField} aria-hidden="true">
          <div className={`${styles.datumRing} ${styles.datumRingOuter}`} />
          <div className={`${styles.datumRing} ${styles.datumRingInner}`} />
          <div className={`${styles.datumAxis} ${styles.datumAxisHorizontal}`} />
          <div className={`${styles.datumAxis} ${styles.datumAxisVertical}`} />
        </div>

        <div className={styles.metaRow}>
          <p data-meta className={styles.kicker}>
            The Industry Gap
          </p>
          <p data-meta className={styles.microStat}>
            Client, designer, constructor, and delivery teams all manage real
            requirements. The gap is shared access to the information required
            to satisfy them.
          </p>
        </div>

        <div className={styles.stage}>
          <div data-trace-field className={styles.traceField} aria-hidden="true">
            {TRACE_PLANES.map((plane) => (
              <article
                key={plane.label}
                data-plane
                className={`${styles.tracePlane} ${getPlaneToneClassName(plane.tone)}`}
                style={
                  {
                    "--plane-width": plane.width,
                    "--plane-height": plane.height,
                    "--plane-layer": plane.layer,
                  } as CSSProperties
                }
              >
                <div className={styles.tracePlaneHeader}>
                  <span className={styles.tracePlaneLabel}>{plane.label}</span>
                  <span className={styles.tracePlaneIndex}>{plane.index}</span>
                </div>
                <div className={styles.tracePlaneBody}>
                  <div className={styles.tracePlaneLines}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className={styles.tracePlaneNote}>{plane.note}</p>
                </div>
              </article>
            ))}
          </div>

          <div data-centerpiece className={styles.centerpiece}>
            <p data-intro-copy className={styles.lead}>
              When every organisation traces the job from its own layer,
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

            <p data-intro-copy className={styles.summary}>
              The cost is not one dramatic event. It is leadership, estimators,
              planners, risk, designers, constructors, and delivery teams
              constantly reconnecting the project through meetings, follow-up,
              and manual interpretation.
            </p>
          </div>
        </div>

        <div data-solution-scene className={styles.solutionScene}>
          <p className={styles.solutionEyebrow}>Shared project picture</p>

          <h3 className={styles.solutionTitle}>
            <span
              data-solution-title-main
              className={styles.solutionTitleMain}
            >
              We organise the information
            </span>
            <span
              data-solution-title-accent
              className={styles.solutionTitleAccent}
            >
              that keeps the whole project aligned.
            </span>
          </h3>

          <p data-solution-lead className={styles.solutionLead}>
            Infraforma structures project requirements, decisions, leadership
            needs, and delivery information in one accessible environment so
            client, designer, constructor, and delivery teams can coordinate
            earlier and move the job forward together.
          </p>

          <div data-solution-core className={styles.alignmentCore}>
            <div className={styles.coreSideLine} aria-hidden="true" />
            <div className={styles.coreSideLineRight} aria-hidden="true" />
            <div className={styles.coreStrips}>
              {CORE_STRIPS.map((strip) => (
                <div key={strip} data-core-strip className={styles.coreStrip}>
                  <span>{strip}</span>
                </div>
              ))}
            </div>
          </div>

          <p data-solution-caption className={styles.solutionCaption}>
            The organisations do not collapse into one team. The information
            becomes accessible enough for everyone to work from the same
            project picture earlier.
          </p>
        </div>
      </div>
    </section>
  );
}
