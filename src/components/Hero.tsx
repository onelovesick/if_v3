"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

const FLOW_MIST_PATHS = [
  "M -120 648 C 182 654, 420 620, 694 546 S 1180 356, 1710 128",
  "M -88 590 C 214 596, 454 568, 722 500 S 1190 334, 1710 142",
  "M -64 546 C 236 550, 470 530, 736 468 S 1200 316, 1710 164",
];

const FLOW_LINES = [
  {
    d: "M -86 684 C 168 684, 354 648, 612 564 S 1088 372, 1710 132",
    tone: "ghost",
  },
  {
    d: "M -76 646 C 182 646, 370 620, 628 548 S 1100 362, 1710 138",
    tone: "steel",
  },
  {
    d: "M -64 608 C 194 608, 386 592, 644 528 S 1110 348, 1710 146",
    tone: "soft",
  },
  {
    d: "M -50 570 C 206 570, 402 564, 662 508 S 1122 336, 1710 158",
    tone: "ghost",
  },
  {
    d: "M -34 532 C 220 532, 420 536, 684 490 S 1140 326, 1710 176",
    tone: "steel",
  },
  {
    d: "M -18 494 C 236 494, 438 508, 706 474 S 1160 320, 1710 202",
    tone: "soft",
  },
  {
    d: "M -4 456 C 252 456, 456 478, 726 458 S 1180 320, 1710 232",
    tone: "ghost",
  },
];

const ACCENT_LINES = [
  "M 72 612 C 334 612, 556 564, 790 488 S 1200 320, 1710 148",
  "M 34 574 C 300 574, 534 538, 782 468 S 1204 310, 1710 160",
];

const DEPTH_LINES = [
  "M -76 646 C 182 646, 370 620, 628 548 S 1100 362, 1710 138",
  "M -34 532 C 220 532, 420 536, 684 490 S 1140 326, 1710 176",
  "M 72 612 C 334 612, 556 564, 790 488 S 1200 320, 1710 148",
  "M 34 574 C 300 574, 534 538, 782 468 S 1204 310, 1710 160",
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

      const cleanup: Array<() => void> = [];

      const flowPaths = Array.from(
        section.querySelectorAll<SVGPathElement>("[data-flow-path]")
      );
      const flowField = section.querySelector<SVGSVGElement>(`.${styles.flowField}`);
      const imageField = section.querySelector<HTMLElement>(`.${styles.imageField}`);
      const atmosphere = section.querySelector<HTMLElement>(`.${styles.atmosphere}`);
      const mistLayer = section.querySelector<SVGGElement>(`.${styles.mistLayer}`);
      const depthLayer = section.querySelector<SVGGElement>(`.${styles.depthLayer}`);
      const lineLayer = section.querySelector<SVGGElement>(`.${styles.lineLayer}`);
      const accentLayer = section.querySelector<SVGGElement>(`.${styles.accentLayer}`);

      flowPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.from("[data-copy-item]", {
        y: 34,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(`.${styles.flowField}`, {
        opacity: 0,
        scale: 0.985,
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
        yPercent: -3,
        scale: 1.015,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.76,
        },
      });

      gsap.to(`.${styles.flowField}`, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.72,
        },
      });

      gsap.to(`.${styles.headlineWrap}`, {
        y: 74,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(`.${styles.bodyWrap}`, {
        y: 116,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.72,
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

      if (
        window.matchMedia("(min-width: 769px) and (pointer: fine)").matches &&
        flowField &&
        imageField &&
        atmosphere &&
        mistLayer &&
        depthLayer &&
        lineLayer &&
        accentLayer
      ) {
        gsap.set(section, {
          transformPerspective: 1400,
        });

        const moveImageX = gsap.quickTo(imageField, "x", {
          duration: 1.2,
          ease: "power3.out",
        });
        const moveImageY = gsap.quickTo(imageField, "y", {
          duration: 1.2,
          ease: "power3.out",
        });
        const moveAtmosphereX = gsap.quickTo(atmosphere, "x", {
          duration: 1.12,
          ease: "power3.out",
        });
        const moveAtmosphereY = gsap.quickTo(atmosphere, "y", {
          duration: 1.12,
          ease: "power3.out",
        });
        const moveMistX = gsap.quickTo(mistLayer, "x", {
          duration: 1.04,
          ease: "power3.out",
        });
        const moveMistY = gsap.quickTo(mistLayer, "y", {
          duration: 1.04,
          ease: "power3.out",
        });
        const moveDepthX = gsap.quickTo(depthLayer, "x", {
          duration: 0.98,
          ease: "power3.out",
        });
        const moveDepthY = gsap.quickTo(depthLayer, "y", {
          duration: 0.98,
          ease: "power3.out",
        });
        const moveLineX = gsap.quickTo(lineLayer, "x", {
          duration: 0.92,
          ease: "power3.out",
        });
        const moveLineY = gsap.quickTo(lineLayer, "y", {
          duration: 0.92,
          ease: "power3.out",
        });
        const moveAccentX = gsap.quickTo(accentLayer, "x", {
          duration: 0.84,
          ease: "power3.out",
        });
        const moveAccentY = gsap.quickTo(accentLayer, "y", {
          duration: 0.84,
          ease: "power3.out",
        });
        const rotateFlowX = gsap.quickTo(flowField, "rotationX", {
          duration: 1.05,
          ease: "power3.out",
        });
        const rotateFlowY = gsap.quickTo(flowField, "rotationY", {
          duration: 1.05,
          ease: "power3.out",
        });
        const scaleFlow = gsap.quickTo(flowField, "scale", {
          duration: 1.05,
          ease: "power3.out",
        });

        const handlePointerMove = (event: PointerEvent) => {
          const bounds = section.getBoundingClientRect();
          const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

          moveImageX(offsetX * 10);
          moveImageY(offsetY * 8);
          moveAtmosphereX(offsetX * 18);
          moveAtmosphereY(offsetY * 14);
          moveMistX(offsetX * 14);
          moveMistY(offsetY * 10);
          moveDepthX(offsetX * 18);
          moveDepthY(offsetY * 14);
          moveLineX(offsetX * 24);
          moveLineY(offsetY * 18);
          moveAccentX(offsetX * 34);
          moveAccentY(offsetY * 22);
          rotateFlowY(offsetX * 1.85);
          rotateFlowX(offsetY * -1.35);
          scaleFlow(1.008);
        };

        const resetInteraction = () => {
          moveImageX(0);
          moveImageY(0);
          moveAtmosphereX(0);
          moveAtmosphereY(0);
          moveMistX(0);
          moveMistY(0);
          moveDepthX(0);
          moveDepthY(0);
          moveLineX(0);
          moveLineY(0);
          moveAccentX(0);
          moveAccentY(0);
          rotateFlowX(0);
          rotateFlowY(0);
          scaleFlow(1);
        };

        section.addEventListener("pointermove", handlePointerMove);
        section.addEventListener("pointerleave", resetInteraction);

        cleanup.push(() => {
          section.removeEventListener("pointermove", handlePointerMove);
          section.removeEventListener("pointerleave", resetInteraction);
          resetInteraction();
        });
      }

      return () => {
        cleanup.forEach((fn) => fn());
      };
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
        <div className={styles.bottomBlend} />

        <svg
          className={styles.flowField}
          viewBox="0 0 1700 900"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="hero-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter id="hero-line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
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

          <g className={styles.depthLayer} filter="url(#hero-soft-glow)">
            {DEPTH_LINES.map((path) => (
              <path
                key={path}
                d={path}
                data-flow-path
                className={`${styles.flowPath} ${styles.depthPath}`}
              />
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

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.headlineWrap} data-copy-item>
            <h1 className={styles.headline}>
              <span>Human-Led,</span>
              <span>Digitally Enabled.</span>
            </h1>
          </div>

          <div className={styles.bodyWrap} data-copy-item>
            <p className={styles.body}>
              Infraforma brings fragmented construction information into a
              disciplined flow so project teams can make clearer decisions,
              maintain context, and deliver with greater control.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Scroll to see the industry problem</span>
      </div>
    </section>
  );
}
