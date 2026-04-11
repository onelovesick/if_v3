"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

const FLOW_MIST_PATHS = [
  "M -120 640 C 180 648, 420 608, 690 530 S 1160 342, 1710 120",
  "M -90 586 C 210 594, 448 562, 716 492 S 1176 324, 1710 136",
  "M -72 540 C 226 548, 462 522, 728 458 S 1188 306, 1710 156",
];

const FLOW_LINES = [
  {
    d: "M -84 668 C 176 668, 350 628, 604 548 S 1076 360, 1708 126",
    tone: "ghost",
  },
  {
    d: "M -76 630 C 184 630, 364 600, 618 530 S 1086 350, 1708 132",
    tone: "steel",
  },
  {
    d: "M -68 592 C 194 592, 376 572, 632 512 S 1098 338, 1706 140",
    tone: "soft",
  },
  {
    d: "M -58 554 C 202 554, 390 544, 646 492 S 1110 326, 1706 150",
    tone: "ghost",
  },
  {
    d: "M -48 516 C 214 516, 404 514, 662 474 S 1122 316, 1706 162",
    tone: "soft",
  },
  {
    d: "M -36 478 C 224 478, 420 484, 680 458 S 1140 308, 1706 180",
    tone: "steel",
  },
  {
    d: "M -24 440 C 236 440, 434 454, 698 442 S 1158 304, 1706 206",
    tone: "ghost",
  },
  {
    d: "M -12 404 C 248 404, 452 424, 720 428 S 1180 306, 1706 236",
    tone: "steel",
  },
];

const ACCENT_LINES = [
  "M 84 604 C 350 604, 556 556, 784 478 S 1192 316, 1710 144",
  "M 42 560 C 314 560, 528 526, 770 456 S 1194 304, 1710 154",
  "M 12 520 C 290 520, 512 498, 762 438 S 1192 300, 1710 176",
];

function getToneClassName(tone: string) {
  if (tone === "soft") {
    return styles.pathSoft;
  }

  if (tone === "steel") {
    return styles.pathSteel;
  }

  return styles.pathGhost;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const flowPaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-flow-path]")
      );

      flowPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.from("[data-copy-item]", {
        y: 36,
        opacity: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(`.${styles.flowField}`, {
        opacity: 0,
        scale: 0.98,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.18,
      });

      gsap.to(flowPaths, {
        strokeDashoffset: 0,
        duration: 1.8,
        stagger: 0.03,
        ease: "power2.out",
        delay: 0.22,
      });

      gsap.to(`.${styles.imageField}`, {
        yPercent: -4,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(`.${styles.flowField}`, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.74,
        },
      });

      gsap.to(`.${styles.copy}`, {
        y: -26,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.68,
        },
      });

      gsap.to(`.${styles.scrollCue}`, {
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top+=220 top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.imageField}>
          <Image
            src="/images/bridge-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>

        <div className={styles.imageVeil} />
        <div className={styles.atmosphere} />

        <svg
          className={styles.flowField}
          viewBox="0 0 1700 900"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="hero-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <filter id="hero-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className={styles.mistLayer} filter="url(#hero-soft-glow)">
            {FLOW_MIST_PATHS.map((path) => (
              <path key={path} d={path} className={styles.mistPath} />
            ))}
          </g>

          <g className={styles.lineLayer}>
            {FLOW_LINES.map((path) => (
              <path
                key={path.d}
                d={path.d}
                data-flow-path
                className={`${styles.flowPath} ${getToneClassName(path.tone)}`}
              />
            ))}
          </g>

          <g className={styles.accentLayer} filter="url(#hero-line-glow)">
            {ACCENT_LINES.map((path) => (
              <path
                key={path}
                d={path}
                data-flow-path
                className={`${styles.flowPath} ${styles.accentPath}`}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className={`${styles.inner} page-container`}>
        <div className={styles.copy}>
          <h1 className={styles.headline} data-copy-item>
            Human-Led, Digitally Enabled.
          </h1>

          <p className={styles.body} data-copy-item>
            Infraforma brings fragmented construction information into a
            disciplined flow so project teams can make clearer decisions,
            maintain context, and deliver with greater control.
          </p>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Scroll to see the industry problem</span>
      </div>
    </section>
  );
}
