"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

const PHASES = [
  "Concept",
  "Design",
  "Pre-con",
  "Construction",
  "Commissioning",
  "Handover",
  "Operations",
] as const;

const PILLARS = [
  {
    index: "01",
    phase: "Concept → Pre-construction",
    label: "Human led",
    body: "Senior people in the room on day one. No junior handoff, no outsourced delivery.",
    detail: "Director-level on the floor",
  },
  {
    index: "02",
    phase: "Construction → Commissioning",
    label: "Digitally enabled",
    body: "BIM, CDE, dashboards, automation. Used where they earn their place. Nowhere else.",
    detail: "Tools that report to the work",
  },
  {
    index: "03",
    phase: "Handover → Operations",
    label: "Owner aligned",
    body: "We answer to the asset's lifetime, not a construction milestone.",
    detail: "Lifecycle accountability",
  },
];

/**
 * Renders a string as per-character spans separated by literal spaces between
 * words. Used to animate color sweep across each statement line as the user
 * scrolls past. The full sentence is also rendered as an offscreen sr-only
 * span so screen readers announce it as one phrase.
 */
function CharSweep({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {word.split("").map((c, ci) => (
              <span key={ci} data-char>
                {c}
              </span>
            ))}
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

/**
 * The Layer Diagram — architectural section showing Infraforma as a
 * persistent blue band running through every project phase. Built as
 * pure SVG so all styling and animation work via CSS classes and GSAP
 * targeting [data-diag] attributes.
 */
function LayerDiagram() {
  const W = 1200;
  const H = 360;
  const TOP_RULE_Y = 100;
  const BAND_TOP = 140;
  const BAND_HEIGHT = 110;
  const BAND_BOTTOM = BAND_TOP + BAND_HEIGHT;
  const BOTTOM_RULE_Y = 290;
  const PHASE_NUM_Y = 22;
  const PHASE_LABEL_Y = 50;
  const ANNOTATION_Y = 320;
  const labelMargin = 60;
  const usableW = W - labelMargin * 2;
  const phaseX = (i: number) =>
    labelMargin + (usableW / (PHASES.length - 1)) * i;

  return (
    <svg
      data-anim="diagram"
      className={styles.diagram}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Project lifecycle diagram. Infraforma sits as a continuous information layer through concept, design, pre-construction, construction, commissioning, handover, and operations."
    >
      {/* Phase numbers + labels above the top hairline */}
      <g data-diag="phases">
        {PHASES.map((phase, i) => (
          <g key={phase} data-diag-phase>
            <text
              x={phaseX(i)}
              y={PHASE_NUM_Y}
              className={styles.diagPhaseNum}
              textAnchor="middle"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <text
              x={phaseX(i)}
              y={PHASE_LABEL_Y}
              className={styles.diagPhaseLabel}
              textAnchor="middle"
            >
              {phase.toUpperCase()}
            </text>
          </g>
        ))}
      </g>

      {/* Top hairline */}
      <line
        data-diag="top-rule"
        x1="0"
        y1={TOP_RULE_Y}
        x2={W}
        y2={TOP_RULE_Y}
        className={styles.diagRule}
      />

      {/* Top ticks crossing into the band — alternating long/short for rhythm */}
      <g data-diag="top-ticks">
        {PHASES.map((phase, i) => {
          const len = i % 2 === 0 ? 30 : 16;
          return (
            <line
              key={phase}
              data-diag-tick
              x1={phaseX(i)}
              y1={TOP_RULE_Y}
              x2={phaseX(i)}
              y2={TOP_RULE_Y + len}
              className={styles.diagTick}
            />
          );
        })}
      </g>

      {/* The Infraforma band — solid blue, the visual answer */}
      <g data-diag="band">
        <rect
          data-diag-band-rect
          x="0"
          y={BAND_TOP}
          width={W}
          height={BAND_HEIGHT}
          className={styles.diagBand}
        />
        {/* Subtle horizontal hairlines inside the band — like a section
            material indicator. White at low opacity. */}
        <line
          x1="0"
          y1={BAND_TOP + 22}
          x2={W}
          y2={BAND_TOP + 22}
          className={styles.diagBandInner}
        />
        <line
          x1="0"
          y1={BAND_BOTTOM - 22}
          x2={W}
          y2={BAND_BOTTOM - 22}
          className={styles.diagBandInner}
        />
        <text
          data-diag-band-label
          x={W / 2}
          y={BAND_TOP + BAND_HEIGHT / 2 + 5}
          textAnchor="middle"
          className={styles.diagBandLabel}
        >
          INFRAFORMA · THE INFORMATION LAYER
        </text>
      </g>

      {/* Bottom ticks emerging from the band downward */}
      <g data-diag="bottom-ticks">
        {PHASES.map((phase, i) => {
          const len = i % 2 === 0 ? 30 : 16;
          return (
            <line
              key={phase}
              data-diag-tick
              x1={phaseX(i)}
              y1={BOTTOM_RULE_Y - len}
              x2={phaseX(i)}
              y2={BOTTOM_RULE_Y}
              className={styles.diagTick}
            />
          );
        })}
      </g>

      {/* Bottom hairline */}
      <line
        data-diag="bottom-rule"
        x1="0"
        y1={BOTTOM_RULE_Y}
        x2={W}
        y2={BOTTOM_RULE_Y}
        className={styles.diagRule}
      />

      {/* Bottom annotation — flush right */}
      <text
        data-diag="annotation"
        x={W - labelMargin}
        y={ANNOTATION_Y}
        textAnchor="end"
        className={styles.diagAnnotation}
      >
        → CONTINUOUS · CONCEPT THROUGH OPERATIONS
      </text>
    </svg>
  );
}

/**
 * The Promise — the 20-second thesis. Editorial title, two-tone statement
 * with per-character scroll fills, the layer diagram as visual answer,
 * and the operational pillars anchored to project phases.
 */
export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-anim]"), {
        opacity: 1,
        yPercent: 0,
        y: 0,
      });
      gsap.set(section.querySelectorAll("[data-rule]"), { scaleX: 1 });
      gsap.set(
        section.querySelectorAll(
          "[data-diag], [data-diag-tick], [data-diag-phase], [data-diag-band-label]"
        ),
        { opacity: 1, scaleX: 1, scaleY: 1, x: 0, y: 0 }
      );
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    // Title — mask-reveal: the word rises into the H2's clipped frame
    const title = section.querySelector("[data-anim='title']");
    if (title) {
      const t = gsap.from(title, {
        yPercent: 110,
        duration: 1.1,
        ease,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Title rule — draws across left → right after the word lands
    const titleRule = section.querySelector("[data-title-rule]");
    if (titleRule) {
      const t = gsap.from(titleRule, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.0,
        ease,
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Statement — sentence-by-sentence with staggered settle
    const statement = gsap.from(section.querySelectorAll("[data-anim='line']"), {
      opacity: 0,
      y: 28,
      filter: "blur(8px)",
      duration: 1.05,
      stagger: 0.16,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='statement']"),
        start: "top 76%",
        toggleActions: "play none none none",
      },
    });
    if (statement.scrollTrigger) triggers.push(statement.scrollTrigger);

    // Per-character color sweep — each line fills with its target color
    // as the reader scrolls past. SNAP per char (duration 0.001) to avoid
    // half-tween artefacts. Wave moves left-to-right through reading order.
    const TONE_TARGETS: Record<string, string | null> = {
      muted: "#0A0B0D", // gray → ink (negation publishes)
      punch: "#1864C8", // ink → blue (the brand answer)
      coda: null, // no sweep — final breath
    };

    section.querySelectorAll<HTMLElement>("[data-anim='line']").forEach((line) => {
      const tone = line.getAttribute("data-tone") ?? "";
      const targetColor = TONE_TARGETS[tone];
      if (!targetColor) return;

      const chars = line.querySelectorAll("[data-char]");
      if (chars.length === 0) return;

      const window =
        tone === "punch"
          ? { start: "top 75%", end: "bottom 30%" }
          : { start: "top 80%", end: "bottom 50%" };

      const sweep = gsap.to(chars, {
        color: targetColor,
        duration: 0.001,
        ease: "none",
        stagger: 1 / chars.length,
        scrollTrigger: {
          trigger: line,
          start: window.start,
          end: window.end,
          scrub: 0.5,
        },
      });
      if (sweep.scrollTrigger) triggers.push(sweep.scrollTrigger);
    });

    // Punch line scale bump — answer "lands" as sweep completes
    const punchLine = section.querySelector<HTMLElement>(
      "[data-anim='line'][data-tone='punch']"
    );
    if (punchLine) {
      const punchScale = gsap.fromTo(
        punchLine,
        { scale: 1 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: punchLine,
            start: "top 75%",
            end: "bottom 30%",
            scrub: 0.6,
          },
          transformOrigin: "left center",
        }
      );
      if (punchScale.scrollTrigger) triggers.push(punchScale.scrollTrigger);
    }

    // Layer diagram — the visual answer to "we are a layer". Choreographed
    // entrance: phase labels fade in, top ticks scale down, blue band draws
    // left to right, label appears inside, bottom ticks scale up, bottom
    // rule draws, annotation lands last.
    const diagram = section.querySelector("[data-anim='diagram']");
    if (diagram) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: diagram,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        defaults: { ease },
      });

      // Top rule draws
      tl.from(
        diagram.querySelector("[data-diag='top-rule']"),
        { scaleX: 0, transformOrigin: "left center", duration: 0.9 },
        0
      );

      // Phase labels stagger in
      tl.from(
        diagram.querySelectorAll("[data-diag-phase]"),
        { opacity: 0, y: 8, duration: 0.5, stagger: 0.06 },
        0.15
      );

      // Top ticks scale down from rule
      tl.from(
        diagram.querySelectorAll(
          "[data-diag='top-ticks'] [data-diag-tick]"
        ),
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.45,
          stagger: 0.04,
        },
        0.6
      );

      // The band draws across — the moment
      tl.from(
        diagram.querySelector("[data-diag-band-rect]"),
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
        },
        0.75
      );

      // Band label fades in after band fills
      tl.from(
        diagram.querySelector("[data-diag-band-label]"),
        { opacity: 0, duration: 0.55 },
        1.5
      );

      // Bottom ticks rise into the bottom rule
      tl.from(
        diagram.querySelectorAll(
          "[data-diag='bottom-ticks'] [data-diag-tick]"
        ),
        {
          scaleY: 0,
          transformOrigin: "bottom center",
          duration: 0.45,
          stagger: 0.04,
        },
        1.05
      );

      // Bottom rule draws
      tl.from(
        diagram.querySelector("[data-diag='bottom-rule']"),
        { scaleX: 0, transformOrigin: "left center", duration: 0.9 },
        1.1
      );

      // Annotation lands last
      tl.from(
        diagram.querySelector("[data-diag='annotation']"),
        { opacity: 0, x: -16, duration: 0.6 },
        1.7
      );

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    // Architectural rule above pillars draws across before the pillars enter
    const rule = section.querySelector("[data-rule]");
    if (rule) {
      const ruleTween = gsap.from(rule, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease,
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='pillars']"),
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (ruleTween.scrollTrigger) triggers.push(ruleTween.scrollTrigger);
    }

    // Pillar numerals — large editorial counter-up
    const numerals = gsap.from(section.querySelectorAll("[data-anim='numeral']"), {
      opacity: 0,
      y: 36,
      duration: 1.0,
      stagger: 0.12,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='pillars']"),
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
    if (numerals.scrollTrigger) triggers.push(numerals.scrollTrigger);

    // Pillar text body — staggered behind the numerals
    const pillars = gsap.from(section.querySelectorAll("[data-anim='pillar-body']"), {
      opacity: 0,
      y: 18,
      duration: 0.85,
      stagger: 0.12,
      ease,
      scrollTrigger: {
        trigger: section.querySelector("[data-anim='pillars']"),
        start: "top 76%",
        toggleActions: "play none none none",
      },
    });
    if (pillars.scrollTrigger) triggers.push(pillars.scrollTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.promise} aria-label="The promise">
      <div className={styles.container}>
        {/* Editorial title — one word, doing all the work */}
        <header className={styles.titleBlock}>
          <h2 className={styles.title}>
            <span data-anim="title" className={styles.titleInner}>
              Promise.
            </span>
          </h2>
          <span
            data-title-rule
            className={styles.titleRule}
            aria-hidden="true"
          />
        </header>

        {/* Two-tone statement with scroll-driven per-char color sweep */}
        <div data-anim="statement" className={styles.statement}>
          <p className={styles.statementText}>
            <span data-anim="line" data-tone="muted" className={styles.statementMuted}>
              <CharSweep text="We are not a software company." />
            </span>
            <span data-anim="line" data-tone="muted" className={styles.statementMuted}>
              <CharSweep text="We are not a framework." />
            </span>
            <span data-anim="line" data-tone="punch" className={styles.statementInk}>
              <CharSweep text="We are a Layer of confidence when it comes to Heavy Civil Mega Projects." />
            </span>
            <span data-anim="line" data-tone="coda" className={styles.statementCoda}>
              <CharSweep text="Pre-construction through handover. A digital model the owner can use from day one of operations." />
            </span>
          </p>
        </div>

        {/* The Layer Diagram — visual answer to "we are a layer" */}
        <LayerDiagram />

        {/* Pillar grid — operational details, anchored to project phases */}
        <div data-anim="pillars" className={styles.pillars}>
          <span data-rule className={styles.rule} aria-hidden="true" />

          {PILLARS.map((p) => (
            <article key={p.label} className={styles.pillar}>
              <span data-anim="numeral" className={styles.numeral} aria-hidden="true">
                {p.index}
              </span>

              <div data-anim="pillar-body" className={styles.pillarText}>
                <p className={styles.pillarPhase}>{p.phase}</p>
                <p className={styles.pillarLabel}>{p.label}</p>
                <p className={styles.pillarBody}>{p.body}</p>
                <p className={styles.pillarDetail}>{p.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
