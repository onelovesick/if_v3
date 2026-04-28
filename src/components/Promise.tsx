"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

type Layer = {
  idx: string;
  name: string;
  active?: boolean;
  sub?: string;
};

const LAYERS: Layer[] = [
  { idx: "01", name: "Owner · Stakeholders" },
  { idx: "02", name: "Designers · Engineers" },
  { idx: "03", name: "Structural · Civil · Geotech" },
  {
    idx: "04",
    name: "Infraforma · The Information Layer",
    active: true,
    sub: "Continuous through every phase. Holding the digital truth that the asset will run on.",
  },
  { idx: "05", name: "Contractor · Subcontractors" },
  { idx: "06", name: "Quality · Compliance · Handover" },
  { idx: "07", name: "Operations · Maintenance" },
];

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
 * Renders a string as per-character spans for scroll-driven color sweep.
 * Full sentence is mirrored in an off-screen sr-only span for assistive tech.
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
 * The Layers Inventory — Infraforma shown as the one ACTIVE layer in a
 * stack of project disciplines. Standard layers are thin hairline rows;
 * the Infraforma row is a tall blue card padded out with a sub-tagline.
 * The visual metaphor IS the message: "we are a layer in your project."
 */
function LayersInventory() {
  const total = LAYERS.length;
  const activeCount = LAYERS.filter((l) => l.active).length;

  return (
    <div data-anim="layers" className={styles.layers}>
      <header className={styles.layersHeader}>
        <span>Project Layers · Inventory</span>
        <span>
          {String(total).padStart(2, "0")} Layers ·{" "}
          {String(activeCount).padStart(2, "0")} Active
        </span>
      </header>

      <ol className={styles.layersList}>
        {LAYERS.map((layer) => (
          <li
            key={layer.idx}
            data-anim-layer
            className={layer.active ? styles.layerActive : styles.layer}
          >
            <span className={styles.layerDot} aria-hidden="true" />
            <span className={styles.layerIdx}>{layer.idx}</span>
            <div className={styles.layerBody}>
              <span className={styles.layerName}>{layer.name}</span>
              {layer.sub ? (
                <span className={styles.layerSub}>{layer.sub}</span>
              ) : null}
            </div>
            <span className={styles.layerStatus}>
              {layer.active ? "Active" : "Visible"}
            </span>
          </li>
        ))}
      </ol>

      <footer className={styles.layersFooter}>
        <span>Continuous · Concept through Operations</span>
        <span>↗ We sit at the interface of all</span>
      </footer>
    </div>
  );
}

/**
 * The Promise — editorial title, two-tone statement with scroll-driven
 * per-character color fills, the layers inventory as visual answer
 * ("we are A LAYER"), and the operational pillars as the how.
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
      gsap.set(section.querySelectorAll("[data-anim-layer]"), {
        opacity: 1,
        y: 0,
      });
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

    // Per-character color sweep — snap-fill, distinct color per tone
    const TONE_TARGETS: Record<string, string | null> = {
      muted: "#0A0B0D",
      punch: "#1864C8",
      coda: null,
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

    // Layers inventory — cascade rows top-to-bottom; the active (Infraforma)
    // row gets a horizontal blue-fill reveal as it lands.
    const layersPanel = section.querySelector<HTMLElement>("[data-anim='layers']");
    if (layersPanel) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: layersPanel,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        defaults: { ease },
      });

      // Whole panel gentle entrance
      tl.from(
        layersPanel,
        { opacity: 0, y: 18, duration: 0.6 },
        0
      );

      // Cascade rows
      tl.from(
        layersPanel.querySelectorAll("[data-anim-layer]"),
        { opacity: 0, y: 14, duration: 0.4, stagger: 0.08 },
        0.15
      );

      // Active (Infraforma) row — subtle scale "click" once it lands
      const activeRow = layersPanel.querySelector(
        `.${styles.layerActive}`
      ) as HTMLElement | null;
      if (activeRow) {
        tl.fromTo(
          activeRow,
          { scaleX: 0.985, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.5 },
          ">-0.1"
        );
      }

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    // Architectural rule above pillars
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

    // Pillar text body
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

        {/* The Layers Inventory — visual answer to "we are a layer" */}
        <LayersInventory />

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
