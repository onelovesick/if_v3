"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const FRAGMENTS = {
  cost: [
    "$22.4M", "overrun", "Rev.03", "estimate pending",
    "$1.2B", "contingency", "unverified", "budget v4",
    "no baseline", "+34%", "unfunded",
  ],
  design: [
    "clash #0441", "RFI pending", "superseded", "no record",
    "Rev.F", "model outdated", "coord fail", "v2.1",
    "unresolved", "detached", "markup lost",
  ],
  schedule: [
    "14 months", "DELAYED", "baseline v4", "float eroded",
    "critical path", "no update", "slippage", "resequenced",
    "TBD", "behind", "0 days float",
  ],
  risk: [
    "HIGH", "unmitigated", "P(0.7)", "no owner",
    "likelihood 4", "open", "unquantified", "escalated",
    "residual", "inactive", "tolerance breached",
  ],
};

// Generate scattered positions for each corner
function generatePositions(corner: string, count: number) {
  const positions: { x: number; y: number; rot: number }[] = [];
  for (let i = 0; i < count; i++) {
    const spread = 280;
    const jitter = () => Math.random() * spread;
    const rot = (Math.random() - 0.5) * 60;
    switch (corner) {
      case "tl": positions.push({ x: jitter() * 0.8, y: jitter() * 0.6, rot }); break;
      case "tr": positions.push({ x: jitter() * 0.8, y: jitter() * 0.6, rot }); break;
      case "bl": positions.push({ x: jitter() * 0.8, y: jitter() * 0.6, rot }); break;
      case "br": positions.push({ x: jitter() * 0.8, y: jitter() * 0.6, rot }); break;
    }
  }
  return positions;
}

const CORNERS = [
  { key: "cost", anchor: "tl", label: "Cost", data: FRAGMENTS.cost },
  { key: "design", anchor: "tr", label: "Design", data: FRAGMENTS.design },
  { key: "schedule", anchor: "bl", label: "Schedule", data: FRAGMENTS.schedule },
  { key: "risk", anchor: "br", label: "Risk", data: FRAGMENTS.risk },
];

const HEADLINE_WORDS = ["Projects", "don't", "fail", "from", "lack", "of", "tools.", "They", "fail", "from", "lack", "of", "structure."];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Phase 1: fragments drift inward as section enters viewport
      const fragmentEls = section.querySelectorAll(`.${styles.fragment}`);
      fragmentEls.forEach((el) => {
        const corner = (el as HTMLElement).dataset.corner;
        // Drift direction: toward center
        let xDrift = 0, yDrift = 0;
        switch (corner) {
          case "tl": xDrift = 60; yDrift = 40; break;
          case "tr": xDrift = -60; yDrift = 40; break;
          case "bl": xDrift = 60; yDrift = -40; break;
          case "br": xDrift = -60; yDrift = -40; break;
        }
        // Add some randomness to drift
        xDrift += (Math.random() - 0.5) * 30;
        yDrift += (Math.random() - 0.5) * 20;

        gsap.to(el, {
          x: xDrift,
          y: yDrift,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 10%",
            scrub: 0.8,
          },
        });
      });

      // Phase 2: fragments fade out once section is fully in view
      gsap.to(fragmentsRef.current, {
        opacity: 0,
        duration: 0.01,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 10%",
          end: "top top",
          scrub: 0.6,
        },
      });

      // Phase 3: headline words appear one at a time
      const words = section.querySelectorAll(`.${styles.word}`);
      words.forEach((word, i) => {
        gsap.fromTo(
          word,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.01,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: `top ${-2 - i * 3}%`,
              end: `top ${-5 - i * 3}%`,
              scrub: 0.4,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Micro-text fragments */}
      <div ref={fragmentsRef} className={styles.fragmentsLayer}>
        {CORNERS.map((corner) => {
          const positions = generatePositions(corner.anchor, corner.data.length);
          return (
            <div
              key={corner.key}
              className={`${styles.cornerCluster} ${styles[corner.anchor]}`}
            >
              {corner.data.map((text, i) => (
                <span
                  key={i}
                  className={styles.fragment}
                  data-corner={corner.anchor}
                  style={{
                    transform: `translate(${positions[i].x}px, ${positions[i].y}px) rotate(${positions[i].rot}deg)`,
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Headline */}
      <div ref={headlineRef} className={styles.headline}>
        {HEADLINE_WORDS.map((word, i) => (
          <span key={i} className={styles.word}>
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
