"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./FlowCompare.module.css";

const STAGES = [
  {
    title: "Fragmented industry inputs",
    text: "Parallel updates arrive with duplicated context, inconsistent naming, and disconnected handoffs.",
  },
  {
    title: "Structured information management",
    text: "Information is named, linked, governed, and carried forward instead of being rebuilt at each step.",
  },
  {
    title: "Aligned construction flow",
    text: "Teams act from one clearer thread with stronger accountability, cleaner coordination, and better delivery timing.",
  },
];

const CHAOS_PATHS = [
  {
    d: "M 60 84 C 226 84, 282 138, 390 138 S 526 98, 640 136 S 826 236, 1140 230",
    tone: "steel",
  },
  {
    d: "M 60 128 C 208 128, 284 194, 356 214 S 494 304, 644 294 S 858 184, 1140 110",
    tone: "ghost",
  },
  {
    d: "M 60 172 C 210 172, 278 174, 372 164 S 510 128, 648 110 S 866 92, 1140 84",
    tone: "primary",
  },
  {
    d: "M 60 216 C 212 216, 284 236, 388 252 S 528 316, 654 332 S 872 344, 1140 352",
    tone: "ghost",
  },
  {
    d: "M 60 260 C 220 260, 284 258, 380 246 S 514 204, 654 170 S 860 160, 1140 166",
    tone: "steel",
  },
  {
    d: "M 60 304 C 212 304, 286 306, 388 316 S 532 346, 668 364 S 884 396, 1140 412",
    tone: "primary",
  },
  {
    d: "M 60 348 C 212 348, 298 330, 402 318 S 546 278, 672 236 S 870 208, 1140 204",
    tone: "ghost",
  },
  {
    d: "M 60 392 C 216 392, 300 388, 414 400 S 554 430, 696 434 S 902 420, 1140 364",
    tone: "steel",
  },
  {
    d: "M 60 436 C 218 436, 304 438, 426 430 S 566 410, 704 392 S 910 348, 1140 282",
    tone: "primary",
  },
];

const ALIGNED_PATHS = [
  {
    d: "M 60 84 C 194 84, 272 96, 374 128 S 514 144, 560 144 S 672 144, 742 128 S 950 126, 1140 126",
    tone: "steel",
  },
  {
    d: "M 60 128 C 208 128, 280 136, 382 144 S 520 162, 560 162 S 674 162, 742 144 S 952 144, 1140 144",
    tone: "ghost",
  },
  {
    d: "M 60 172 C 214 172, 286 176, 390 166 S 526 180, 560 180 S 678 180, 742 162 S 954 162, 1140 162",
    tone: "primary",
  },
  {
    d: "M 60 216 C 208 216, 286 226, 388 240 S 522 254, 560 254 S 678 254, 746 238 S 952 236, 1140 236",
    tone: "ghost",
  },
  {
    d: "M 60 260 C 214 260, 290 260, 394 252 S 528 272, 560 272 S 680 272, 748 254 S 954 254, 1140 254",
    tone: "steel",
  },
  {
    d: "M 60 304 C 214 304, 294 300, 400 314 S 532 290, 560 290 S 682 290, 748 272 S 954 272, 1140 272",
    tone: "primary",
  },
  {
    d: "M 60 348 C 214 348, 292 340, 398 330 S 534 364, 560 364 S 684 364, 750 346 S 954 346, 1140 346",
    tone: "ghost",
  },
  {
    d: "M 60 392 C 218 392, 300 390, 408 402 S 540 382, 560 382 S 686 382, 754 364 S 958 364, 1140 364",
    tone: "steel",
  },
  {
    d: "M 60 436 C 220 436, 304 438, 416 430 S 548 400, 560 400 S 690 400, 758 382 S 962 382, 1140 382",
    tone: "primary",
  },
];

const INPUT_NODE_Y = [84, 128, 172, 216, 260, 304, 348, 392, 436];
const OUTPUT_NODE_Y = [126, 144, 162, 236, 254, 272, 346, 364, 382];

function getToneClassName(tone: string) {
  if (tone === "primary") {
    return styles.pathPrimary;
  }

  if (tone === "steel") {
    return styles.pathSteel;
  }

  return styles.pathGhost;
}

export default function FlowCompare() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const stageCards = Array.from(
        section.querySelectorAll<HTMLElement>("[data-stage-card]")
      );
      const alignedPaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-aligned-path]")
      );

      if (stageCards.length < 3 || alignedPaths.length === 0) {
        return;
      }

      alignedPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap.set(stageCards, { opacity: 0.38, y: 22 });
        gsap.set(stageCards[0], { opacity: 1, y: 0 });
        gsap.set(`.${styles.chaosLayer}`, { opacity: 1, x: 0 });
        gsap.set(`.${styles.alignedLayer}`, { opacity: 0.16, x: -36 });
        gsap.set(`.${styles.core}`, { opacity: 0.46, scale: 0.88 });
        gsap.set(`.${styles.outputGlow}`, { opacity: 0, x: -32 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1500",
            scrub: 0.7,
            pin: true,
          },
        });

        timeline
          .to(`.${styles.chaosLayer}`, { opacity: 0.18, x: -24 }, 0.12)
          .to(stageCards[0], { opacity: 0.34, y: 18 }, 0.2)
          .to(stageCards[1], { opacity: 1, y: 0 }, 0.22)
          .to(`.${styles.core}`, { opacity: 1, scale: 1 }, 0.26)
          .to(
            alignedPaths,
            {
              strokeDashoffset: 0,
              stagger: 0.03,
            },
            0.34
          )
          .to(`.${styles.alignedLayer}`, { opacity: 1, x: 0 }, 0.38)
          .to(stageCards[1], { opacity: 0.42, y: 18 }, 0.68)
          .to(stageCards[2], { opacity: 1, y: 0 }, 0.72)
          .to(`.${styles.outputGlow}`, { opacity: 1, x: 0 }, 0.72);
      });

      media.add("(max-width: 768px)", () => {
        gsap.set(`.${styles.alignedLayer}`, { opacity: 0.2, x: -20 });
        gsap.set(`.${styles.core}`, { opacity: 0.62, scale: 0.92 });

        gsap.from(`.${styles.header}`, {
          y: 34,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        });

        gsap.from(stageCards, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
          },
        });

        gsap.to(`.${styles.chaosLayer}`, {
          opacity: 0.26,
          x: -16,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            end: "bottom 28%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.alignedLayer}`, {
          opacity: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 24%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.core}`, {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });

        gsap.to(alignedPaths, {
          strokeDashoffset: 0,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            end: "bottom 20%",
            scrub: 0.9,
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.header}>
          <p className={styles.kicker}>Alignment in Motion</p>
          <h2 className={styles.headline}>
            From fragmented industry information to aligned construction flow.
          </h2>
        </div>

        <div className={styles.stageGrid}>
          {STAGES.map((stage) => (
            <article key={stage.title} data-stage-card className={styles.stageCard}>
              <h3 className={styles.stageTitle}>{stage.title}</h3>
              <p className={styles.stageText}>{stage.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.diagramShell}>
          <div className={styles.outputGlow} aria-hidden="true" />

          <svg
            className={styles.diagram}
            viewBox="0 0 1200 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g className={styles.nodeLayer}>
              {INPUT_NODE_Y.map((cy) => (
                <circle key={`input-${cy}`} cx="60" cy={cy} r="5" className={styles.inputNode} />
              ))}

              {OUTPUT_NODE_Y.map((cy) => (
                <circle
                  key={`output-${cy}`}
                  cx="1140"
                  cy={cy}
                  r="5"
                  className={styles.outputNode}
                />
              ))}
            </g>

            <g className={styles.chaosLayer}>
              {CHAOS_PATHS.map((path) => (
                <path
                  key={path.d}
                  d={path.d}
                  className={`${styles.diagramPath} ${getToneClassName(path.tone)}`}
                />
              ))}
            </g>

            <g className={styles.core}>
              <rect
                x="518"
                y="108"
                width="164"
                height="300"
                rx="34"
                className={styles.coreFrame}
              />
              <rect x="544" y="144" width="112" height="56" rx="28" className={styles.coreBand} />
              <rect
                x="544"
                y="236"
                width="112"
                height="56"
                rx="28"
                className={styles.coreBand}
              />
              <rect
                x="544"
                y="328"
                width="112"
                height="56"
                rx="28"
                className={styles.coreBand}
              />
              <rect
                x="556"
                y="156"
                width="88"
                height="10"
                rx="5"
                className={styles.coreBandSoft}
              />
              <rect
                x="556"
                y="248"
                width="88"
                height="10"
                rx="5"
                className={styles.coreBandSoft}
              />
              <rect
                x="556"
                y="340"
                width="88"
                height="10"
                rx="5"
                className={styles.coreBandSoft}
              />
            </g>

            <g className={styles.alignedLayer}>
              {ALIGNED_PATHS.map((path) => (
                <path
                  key={path.d}
                  d={path.d}
                  data-aligned-path
                  className={`${styles.diagramPath} ${getToneClassName(path.tone)}`}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
