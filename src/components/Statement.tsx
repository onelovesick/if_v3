"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const ROWS = [
  {
    shift: -28,
    before: ["28%", "18%", "14%"],
    after: ["18%", "24%", "16%"],
  },
  {
    shift: -20,
    before: ["22%", "20%", "18%"],
    after: ["16%", "26%", "14%"],
  },
  {
    shift: -34,
    before: ["30%", "14%", "16%"],
    after: ["14%", "24%", "18%"],
  },
  {
    shift: -16,
    before: ["20%", "24%", "16%"],
    after: ["20%", "22%", "16%"],
  },
  {
    shift: -26,
    before: ["26%", "18%", "12%"],
    after: ["16%", "28%", "14%"],
  },
  {
    shift: -22,
    before: ["24%", "16%", "18%"],
    after: ["18%", "22%", "18%"],
  },
  {
    shift: -30,
    before: ["30%", "16%", "14%"],
    after: ["14%", "26%", "18%"],
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-row]"));
      const focusSegments = Array.from(
        section.querySelectorAll<HTMLElement>("[data-focus]")
      );

      rows.forEach((row) => {
        gsap.set(row, {
          xPercent: Number(row.dataset.shift ?? 0),
        });
      });

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap.set(`.${styles.axis}`, { opacity: 0.16, scaleY: 0.42 });
        gsap.set(`.${styles.axisGlow}`, { opacity: 0, scale: 0.72 });
        gsap.set(focusSegments, {
          boxShadow: "0 12px 28px rgba(71, 181, 255, 0.12)",
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1400",
            scrub: 0.75,
            pin: true,
          },
        });

        timeline
          .from(
            "[data-message-item]",
            {
              y: 30,
              opacity: 0,
              duration: 0.25,
              stagger: 0.08,
              ease: "power3.out",
            },
            0
          )
          .to(
            rows,
            {
              xPercent: 0,
              duration: 0.56,
              stagger: 0.03,
              ease: "power2.out",
            },
            0.12
          )
          .to(
            `.${styles.axis}`,
            {
              opacity: 1,
              scaleY: 1,
              duration: 0.18,
            },
            0.38
          )
          .to(
            `.${styles.axisGlow}`,
            {
              opacity: 1,
              scale: 1,
              duration: 0.2,
            },
            0.38
          )
          .to(
            focusSegments,
            {
              boxShadow: "0 18px 42px rgba(71, 181, 255, 0.22)",
              background:
                "linear-gradient(90deg, rgba(77, 186, 255, 0.95), rgba(184, 231, 255, 0.98))",
              duration: 0.2,
              stagger: 0.02,
            },
            0.38
          );
      });

      media.add("(max-width: 768px)", () => {
        gsap.from("[data-message-item]", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        });

        gsap.to(rows, {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            end: "bottom 24%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.axis}`, {
          opacity: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.axisGlow}`, {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      <div className={`${styles.panel} page-container`}>
        <div className={styles.copy}>
          <p className={styles.kicker} data-message-item>
            The Industry Problem
          </p>

          <h2 className={styles.headline} data-message-item>
            Construction information is not missing. It arrives fragmented.
          </h2>

          <p className={styles.support} data-message-item>
            Design, programme, procurement, commercial, and site updates move
            in parallel, but they do not move through one dependable structure.
            Context drops at every handoff.
          </p>
        </div>

        <div className={styles.rowsField} aria-hidden="true">
          <div className={styles.axis} />
          <div className={styles.axisGlow} />

          {ROWS.map((row, index) => (
            <div
              key={`row-${index}`}
              data-row
              data-shift={row.shift}
              className={styles.row}
            >
              <div className={styles.beforeTrack}>
                {row.before.map((width, segmentIndex) => (
                  <span
                    key={`before-${index}-${segmentIndex}`}
                    className={`${styles.segment} ${
                      segmentIndex % 2 === 0 ? styles.segmentGhost : styles.segmentSteel
                    }`}
                    style={{ width }}
                  />
                ))}
              </div>

              <span className={styles.focusSegment} data-focus />

              <div className={styles.afterTrack}>
                {row.after.map((width, segmentIndex) => (
                  <span
                    key={`after-${index}-${segmentIndex}`}
                    className={`${styles.segment} ${
                      segmentIndex % 2 === 0 ? styles.segmentSteel : styles.segmentGhost
                    }`}
                    style={{ width }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
