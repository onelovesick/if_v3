"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const FRAGMENT_ROWS = [
  {
    offset: "0%",
    segments: [
      { width: "20%", tone: "ghost" },
      { width: "12%", tone: "steel" },
      { width: "16%", tone: "blue" },
      { width: "10%", tone: "ghost" },
    ],
  },
  {
    offset: "8%",
    segments: [
      { width: "14%", tone: "steel" },
      { width: "18%", tone: "ghost" },
      { width: "10%", tone: "blue" },
      { width: "16%", tone: "ghost" },
    ],
  },
  {
    offset: "2%",
    segments: [
      { width: "16%", tone: "blue" },
      { width: "10%", tone: "ghost" },
      { width: "18%", tone: "steel" },
      { width: "12%", tone: "ghost" },
    ],
  },
  {
    offset: "12%",
    segments: [
      { width: "12%", tone: "ghost" },
      { width: "20%", tone: "steel" },
      { width: "14%", tone: "ghost" },
      { width: "10%", tone: "blue" },
    ],
  },
  {
    offset: "4%",
    segments: [
      { width: "18%", tone: "ghost" },
      { width: "14%", tone: "blue" },
      { width: "12%", tone: "ghost" },
      { width: "20%", tone: "steel" },
    ],
  },
  {
    offset: "10%",
    segments: [
      { width: "10%", tone: "steel" },
      { width: "18%", tone: "ghost" },
      { width: "16%", tone: "blue" },
      { width: "14%", tone: "ghost" },
    ],
  },
  {
    offset: "0%",
    segments: [
      { width: "22%", tone: "ghost" },
      { width: "12%", tone: "steel" },
      { width: "14%", tone: "ghost" },
      { width: "10%", tone: "blue" },
    ],
  },
];

function getSegmentClassName(tone: string) {
  if (tone === "blue") {
    return styles.segmentBlue;
  }

  if (tone === "steel") {
    return styles.segmentSteel;
  }

  return styles.segmentGhost;
}

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const fragmentRows = Array.from(
        section.querySelectorAll<HTMLElement>("[data-fragment-row]")
      );

      gsap.from("[data-problem-copy]", {
        y: 34,
        opacity: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 74%",
        },
      });

      gsap.from(fragmentRows, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
      });

      gsap.to(fragmentRows, {
        xPercent: (index) => (index % 2 === 0 ? 6 : -8),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(`.${styles.copy}`, {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.82,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.copy}>
          <p className={styles.kicker} data-problem-copy>
            The Industry Problem
          </p>

          <h2 className={styles.headline} data-problem-copy>
            Construction information is not missing. It is fragmented.
          </h2>

          <p className={styles.support} data-problem-copy>
            Design, programme, procurement, commercial, and site updates move
            in parallel, but they do not move through one dependable structure.
            Context drops at every handoff.
          </p>
        </div>

        <div className={styles.fragmentField} aria-hidden="true">
          {FRAGMENT_ROWS.map((row, index) => (
            <div
              key={`${row.offset}-${index}`}
              data-fragment-row
              className={styles.fragmentRow}
              style={{ marginLeft: row.offset }}
            >
              {row.segments.map((segment, segmentIndex) => (
                <span
                  key={`${segment.tone}-${segment.width}-${segmentIndex}`}
                  className={`${styles.segment} ${getSegmentClassName(segment.tone)}`}
                  style={{ width: segment.width }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
