"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const FRAGMENTS: Record<string, string[]> = {
  cost: [
    "$22.4M", "overrun", "Rev.03", "pending",
    "+34%", "contingency", "unverified", "unfunded",
    "no baseline", "budget v4", "variance",
  ],
  schedule: [
    "14 months", "DELAYED", "float eroded", "resequenced",
    "critical", "no update", "slippage", "behind",
    "baseline v4", "TBD", "0d float",
  ],
  design: [
    "clash #0441", "RFI open", "superseded", "no record",
    "Rev.F", "outdated", "coord fail", "v2.1",
    "unresolved", "detached", "missing",
  ],
  risk: [
    "HIGH", "unmitigated", "P(0.7)", "no owner",
    "escalated", "open", "unquantified", "residual",
    "tolerance", "inactive", "exposure",
  ],
};

const HEADLINE_WORDS = [
  { text: "Projects", dim: false },
  { text: "don\u2019t", dim: false },
  { text: "fail", dim: false },
  { text: "from", dim: false },
  { text: "lack", dim: false },
  { text: "of", dim: false },
  { text: "tools.", dim: false },
  { text: "They", dim: true },
  { text: "fail", dim: true },
  { text: "from", dim: true },
  { text: "lack", dim: true },
  { text: "of", dim: true },
  { text: "structure.", dim: true },
];

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  // Generate circle positions deterministically
  const fragments = useMemo(() => {
    const all: { text: string; angle: number; radius: number; rot: number; group: string }[] = [];
    const groups = Object.entries(FRAGMENTS);
    const rng = seededRandom(42);

    groups.forEach(([group, words], gi) => {
      const baseAngle = gi * 90; // cost=0, schedule=90, design=180, risk=270
      words.forEach((word, wi) => {
        const angle = baseAngle + (rng() - 0.5) * 70 + (wi - 5) * 6;
        const radius = 38 + rng() * 14; // % of viewport, large circle
        const rot = (rng() - 0.5) * 50;
        all.push({ text: word, angle, radius, rot, group });
      });
    });
    return all;
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const fragEls = section.querySelectorAll(`.${styles.fragment}`);
      const wordEls = section.querySelectorAll(`.${styles.word}`);

      // Phase 1: circle tightens — fragments move inward
      fragEls.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const currentRadius = parseFloat(htmlEl.dataset.radius || "40");
        const tighterRadius = currentRadius * 0.55; // tighten to ~55% of original
        const angle = parseFloat(htmlEl.dataset.angle || "0") * (Math.PI / 180);

        const currentX = Math.cos(angle) * currentRadius;
        const currentY = Math.sin(angle) * currentRadius;
        const newX = Math.cos(angle) * tighterRadius;
        const newY = Math.sin(angle) * tighterRadius;

        gsap.to(el, {
          x: `${(newX - currentX)}vmin`,
          y: `${(newY - currentY)}vmin`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 15%",
            scrub: 0.8,
          },
        });
      });

      // Phase 2: fragments fade out
      gsap.to(`.${styles.fragmentsLayer}`, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 15%",
          end: "top top",
          scrub: 0.6,
        },
      });

      // Phase 3: word-by-word reveal (ICOMAT style — opacity + translateY, staggered)
      wordEls.forEach((word, i) => {
        gsap.fromTo(
          word,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: `top ${-1 - i * 2.5}%`,
              end: `top ${-4 - i * 2.5}%`,
              scrub: 0.3,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Orbiting micro-text fragments */}
      <div className={styles.fragmentsLayer}>
        {fragments.map((f, i) => {
          const rad = f.angle * (Math.PI / 180);
          const x = Math.cos(rad) * f.radius;
          const y = Math.sin(rad) * f.radius;
          return (
            <span
              key={i}
              className={styles.fragment}
              data-radius={f.radius}
              data-angle={f.angle}
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x}vmin, ${y}vmin) rotate(${f.rot}deg)`,
              }}
            >
              {f.text}
            </span>
          );
        })}
      </div>

      {/* Centered headline — word by word */}
      <h2 className={styles.headline}>
        <span className={styles.line}>
          {HEADLINE_WORDS.slice(0, 7).map((w, i) => (
            <span key={i} className={styles.word}>{w.text}</span>
          ))}
        </span>
        <br />
        <span className={styles.line2}>
          {HEADLINE_WORDS.slice(7).map((w, i) => (
            <span key={i + 7} className={styles.word}>{w.text}</span>
          ))}
        </span>
      </h2>
    </section>
  );
}
