"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const ROWS = [
  {
    shift: -28,
    duration: 0.78,
    signalWidth: "clamp(138px, 10vw, 194px)",
    particles: [
      { x: "7%", size: 4, opacity: 0.34 },
      { x: "16%", size: 3, opacity: 0.22 },
      { x: "29%", size: 4, opacity: 0.28 },
      { x: "47%", size: 3, opacity: 0.18 },
      { x: "68%", size: 4, opacity: 0.26 },
      { x: "83%", size: 3, opacity: 0.22 },
      { x: "92%", size: 4, opacity: 0.3 },
    ],
  },
  {
    shift: -22,
    duration: 0.56,
    signalWidth: "clamp(126px, 9vw, 176px)",
    particles: [
      { x: "10%", size: 3, opacity: 0.24 },
      { x: "21%", size: 4, opacity: 0.3 },
      { x: "34%", size: 3, opacity: 0.18 },
      { x: "52%", size: 4, opacity: 0.3 },
      { x: "64%", size: 3, opacity: 0.2 },
      { x: "79%", size: 4, opacity: 0.28 },
      { x: "90%", size: 3, opacity: 0.2 },
    ],
  },
  {
    shift: -34,
    duration: 0.84,
    signalWidth: "clamp(146px, 11vw, 208px)",
    particles: [
      { x: "8%", size: 4, opacity: 0.36 },
      { x: "19%", size: 3, opacity: 0.22 },
      { x: "28%", size: 4, opacity: 0.3 },
      { x: "44%", size: 3, opacity: 0.16 },
      { x: "58%", size: 4, opacity: 0.22 },
      { x: "74%", size: 3, opacity: 0.24 },
      { x: "88%", size: 4, opacity: 0.3 },
    ],
  },
  {
    shift: -18,
    duration: 0.48,
    signalWidth: "clamp(118px, 8.5vw, 164px)",
    particles: [
      { x: "11%", size: 3, opacity: 0.2 },
      { x: "23%", size: 4, opacity: 0.26 },
      { x: "38%", size: 3, opacity: 0.2 },
      { x: "54%", size: 4, opacity: 0.3 },
      { x: "66%", size: 3, opacity: 0.18 },
      { x: "81%", size: 4, opacity: 0.26 },
      { x: "94%", size: 3, opacity: 0.2 },
    ],
  },
  {
    shift: -30,
    duration: 0.8,
    signalWidth: "clamp(140px, 10.5vw, 198px)",
    particles: [
      { x: "6%", size: 4, opacity: 0.32 },
      { x: "17%", size: 3, opacity: 0.2 },
      { x: "33%", size: 4, opacity: 0.28 },
      { x: "49%", size: 3, opacity: 0.18 },
      { x: "63%", size: 4, opacity: 0.24 },
      { x: "78%", size: 3, opacity: 0.22 },
      { x: "91%", size: 4, opacity: 0.28 },
    ],
  },
  {
    shift: -24,
    duration: 0.62,
    signalWidth: "clamp(130px, 9.5vw, 184px)",
    particles: [
      { x: "9%", size: 3, opacity: 0.24 },
      { x: "20%", size: 4, opacity: 0.28 },
      { x: "35%", size: 3, opacity: 0.18 },
      { x: "51%", size: 4, opacity: 0.26 },
      { x: "69%", size: 3, opacity: 0.2 },
      { x: "84%", size: 4, opacity: 0.28 },
      { x: "95%", size: 3, opacity: 0.18 },
    ],
  },
  {
    shift: -36,
    duration: 0.88,
    signalWidth: "clamp(152px, 11.2vw, 214px)",
    particles: [
      { x: "7%", size: 4, opacity: 0.34 },
      { x: "18%", size: 3, opacity: 0.2 },
      { x: "31%", size: 4, opacity: 0.3 },
      { x: "46%", size: 3, opacity: 0.16 },
      { x: "61%", size: 4, opacity: 0.22 },
      { x: "77%", size: 3, opacity: 0.2 },
      { x: "89%", size: 4, opacity: 0.28 },
    ],
  },
  {
    shift: -20,
    duration: 0.54,
    signalWidth: "clamp(122px, 9vw, 170px)",
    particles: [
      { x: "10%", size: 3, opacity: 0.22 },
      { x: "24%", size: 4, opacity: 0.28 },
      { x: "39%", size: 3, opacity: 0.18 },
      { x: "56%", size: 4, opacity: 0.28 },
      { x: "71%", size: 3, opacity: 0.2 },
      { x: "85%", size: 4, opacity: 0.26 },
      { x: "96%", size: 3, opacity: 0.18 },
    ],
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
      const signals = Array.from(
        section.querySelectorAll<HTMLElement>("[data-signal]")
      );
      const particles = Array.from(
        section.querySelectorAll<HTMLElement>("[data-particle]")
      );

      rows.forEach((row) => {
        gsap.set(row, {
          xPercent: Number(row.dataset.shift ?? 0),
        });
      });

      gsap.set(signals, {
        opacity: 0.56,
        scaleX: 0.76,
        transformOrigin: "center center",
      });

      gsap.set(particles, {
        opacity: 0.22,
        scale: 0.9,
        transformOrigin: "center center",
      });

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap.set(`.${styles.centerBeam}`, {
          opacity: 0.12,
          scaleY: 0.72,
          transformOrigin: "center top",
        });

        gsap.set(`.${styles.centerGlow}`, {
          opacity: 0.18,
          scale: 0.84,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1350",
            scrub: 0.72,
            pin: true,
          },
        });

        timeline.from(
          "[data-message-item]",
          {
            y: 36,
            opacity: 0,
            duration: 0.22,
            stagger: 0.08,
            ease: "power3.out",
          },
          0
        );

        rows.forEach((row, index) => {
          timeline.to(
            row,
            {
              xPercent: 0,
              duration: Number(row.dataset.duration ?? 0.6),
              ease: "power2.out",
            },
            0.08 + index * 0.022
          );
        });

        timeline.to(
          signals,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.24,
            stagger: 0.02,
          },
          0.28
        );

        timeline.to(
          particles,
          {
            opacity: (_, target) =>
              Number((target as HTMLElement).dataset.opacity ?? 0.3),
            scale: 1,
            duration: 0.22,
            stagger: 0.004,
          },
          0.28
        );

        timeline.to(
          `.${styles.centerBeam}`,
          {
            opacity: 0.78,
            scaleY: 1,
            duration: 0.24,
          },
          0.34
        );

        timeline.to(
          `.${styles.centerGlow}`,
          {
            opacity: 0.92,
            scale: 1,
            duration: 0.24,
          },
          0.34
        );
      });

      media.add("(max-width: 768px)", () => {
        gsap.from("[data-message-item]", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
          },
        });

        rows.forEach((row) => {
          gsap.to(row, {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              end: "bottom 26%",
              scrub: 0.9,
            },
          });
        });

        gsap.to(signals, {
          opacity: 1,
          scaleX: 1,
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });

        gsap.to(particles, {
          opacity: (_, target) =>
            Number((target as HTMLElement).dataset.opacity ?? 0.28),
          scale: 1,
          ease: "none",
          stagger: 0.004,
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.centerBeam}`, {
          opacity: 0.62,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 26%",
            scrub: 0.9,
          },
        });

        gsap.to(`.${styles.centerGlow}`, {
          opacity: 0.8,
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
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.kicker} data-message-item>
            The Industry Problem
          </p>

          <h2 className={styles.headline} data-message-item>
            Construction information is not missing. It is fragmented.
          </h2>

          <p className={styles.support} data-message-item>
            Critical updates move continuously across design, programme,
            procurement, commercial, and site delivery, but they rarely move
            through one aligned system. Fragmentation turns motion into risk.
          </p>
        </div>

        <div className={styles.field} aria-hidden="true">
          <div className={styles.centerBeam} />
          <div className={styles.centerGlow} />

          {ROWS.map((row, index) => (
            <div key={`row-${index}`} className={styles.rowWrap}>
              <div
                data-row
                data-shift={row.shift}
                data-duration={row.duration}
                className={styles.row}
                style={
                  {
                    "--signal-width": row.signalWidth,
                  } as CSSProperties
                }
              >
                <span className={styles.signal} data-signal />

                {row.particles.map((particle, particleIndex) => (
                  <span
                    key={`particle-${index}-${particleIndex}`}
                    data-particle
                    data-opacity={particle.opacity}
                    className={styles.particle}
                    style={
                      {
                        "--particle-x": particle.x,
                        "--particle-size": `${particle.size}px`,
                        "--particle-opacity": particle.opacity,
                      } as CSSProperties
                    }
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
