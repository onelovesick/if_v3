"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

const FLOW_PATHS = [
  {
    d: "M -40 706 C 160 706, 238 652, 360 628 S 562 570, 724 474 S 1044 286, 1460 278",
    tone: "ghost",
  },
  {
    d: "M -32 642 C 154 642, 250 612, 380 596 S 580 530, 748 428 S 1060 264, 1460 226",
    tone: "soft",
  },
  {
    d: "M -26 586 C 158 586, 266 562, 396 546 S 608 486, 776 380 S 1080 222, 1460 180",
    tone: "primary",
  },
  {
    d: "M -20 532 C 162 532, 270 516, 408 500 S 624 444, 798 332 S 1096 198, 1460 146",
    tone: "soft",
  },
  {
    d: "M -12 478 C 160 478, 274 470, 416 452 S 636 398, 816 284 S 1110 178, 1460 126",
    tone: "primary",
  },
  {
    d: "M -8 424 C 164 424, 280 422, 432 406 S 652 354, 838 238 S 1124 160, 1460 114",
    tone: "ghost",
  },
  {
    d: "M 0 370 C 170 370, 292 372, 448 362 S 670 318, 860 212 S 1138 150, 1460 118",
    tone: "soft",
  },
];

const FLOW_NODES = [
  { cx: 864, cy: 318, r: 5.5 },
  { cx: 934, cy: 262, r: 4.5 },
  { cx: 1016, cy: 214, r: 5 },
  { cx: 1092, cy: 172, r: 4.5 },
  { cx: 1168, cy: 142, r: 5.5 },
];

function getToneClassName(tone: string) {
  if (tone === "primary") {
    return styles.pathPrimary;
  }

  if (tone === "soft") {
    return styles.pathSoft;
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
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(`.${styles.flowNode}`, {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "back.out(1.7)",
        delay: 0.4,
      });

      gsap.to(flowPaths, {
        strokeDashoffset: 0,
        duration: 1.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.18,
      });

      gsap.to(`.${styles.imageField}`, {
        yPercent: -8,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      gsap.to(`.${styles.flowField}`, {
        yPercent: -10,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.82,
        },
      });

      gsap.to(`.${styles.copy}`, {
        y: -42,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(`.${styles.scrollCue}`, {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top+=260 top",
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
        <div className={styles.structureGlow} />

        <svg
          className={styles.flowField}
          viewBox="0 0 1400 900"
          preserveAspectRatio="none"
        >
          {FLOW_PATHS.map((path) => (
            <path
              key={path.d}
              d={path.d}
              data-flow-path
              className={`${styles.flowPath} ${getToneClassName(path.tone)}`}
            />
          ))}

          {FLOW_NODES.map((node) => (
            <circle
              key={`${node.cx}-${node.cy}`}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              className={styles.flowNode}
            />
          ))}
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
