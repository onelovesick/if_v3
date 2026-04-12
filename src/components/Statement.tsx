"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

/* ─── Statement text split into lines ─── */

const LINES = [
  "$1.8 trillion lost to bad data",
  "in a single year.",
  "",
  "Not from lack of tools.",
  "From information that lost its structure",
  "between the people who needed it.",
];

/* ─── Data rows config ─── */

const ROWS = [
  {
    shift: -32,
    duration: 0.72,
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
    shift: -24,
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
    shift: -38,
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
    duration: 0.78,
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
    shift: -26,
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
    duration: 0.52,
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
  {
    shift: -28,
    duration: 0.68,
    signalWidth: "clamp(134px, 10vw, 190px)",
    particles: [
      { x: "5%", size: 3, opacity: 0.2 },
      { x: "15%", size: 4, opacity: 0.26 },
      { x: "30%", size: 3, opacity: 0.22 },
      { x: "48%", size: 4, opacity: 0.3 },
      { x: "62%", size: 3, opacity: 0.18 },
      { x: "76%", size: 4, opacity: 0.26 },
      { x: "93%", size: 3, opacity: 0.22 },
    ],
  },
  {
    shift: -22,
    duration: 0.58,
    signalWidth: "clamp(128px, 9.2vw, 178px)",
    particles: [
      { x: "12%", size: 4, opacity: 0.28 },
      { x: "22%", size: 3, opacity: 0.2 },
      { x: "36%", size: 4, opacity: 0.24 },
      { x: "50%", size: 3, opacity: 0.16 },
      { x: "67%", size: 4, opacity: 0.22 },
      { x: "80%", size: 3, opacity: 0.24 },
      { x: "92%", size: 4, opacity: 0.26 },
    ],
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = Array.from(
        section.querySelectorAll<HTMLElement>("[data-char]")
      );
      const rows = Array.from(
        section.querySelectorAll<HTMLElement>("[data-row]")
      );
      const signals = Array.from(
        section.querySelectorAll<HTMLElement>("[data-signal]")
      );
      const particles = Array.from(
        section.querySelectorAll<HTMLElement>("[data-particle]")
      );

      // Initial states
      rows.forEach((row) => {
        gsap.set(row, { xPercent: Number(row.dataset.shift ?? 0) });
      });

      gsap.set(signals, {
        opacity: 0.4,
        scaleX: 0.7,
        transformOrigin: "center center",
      });

      gsap.set(particles, {
        opacity: 0.15,
        scale: 0.8,
        transformOrigin: "center center",
      });

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        gsap.set(`.${styles.centerBeam}`, {
          opacity: 0,
          scaleY: 0.6,
          transformOrigin: "center top",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1600",
            scrub: 0.6,
            pin: true,
          },
        });

        // Phase 1 (0 → 0.55): Characters reveal + rows align simultaneously
        tl.to(
          chars,
          {
            color: "#080808",
            duration: 0.55,
            stagger: { each: 0.55 / chars.length },
            ease: "none",
          },
          0
        );

        // Rows align in the same window
        rows.forEach((row, i) => {
          tl.to(
            row,
            {
              xPercent: 0,
              duration: Number(row.dataset.duration ?? 0.6),
              ease: "power2.out",
            },
            0.05 + i * 0.02
          );
        });

        // Phase 2 (0.35 → 0.55): Signals and particles reach full
        tl.to(
          signals,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.2,
            stagger: 0.015,
          },
          0.35
        );

        tl.to(
          particles,
          {
            opacity: (_, target) =>
              Number((target as HTMLElement).dataset.opacity ?? 0.3),
            scale: 1,
            duration: 0.2,
            stagger: 0.003,
          },
          0.35
        );

        // Center beam appears as alignment completes
        tl.to(
          `.${styles.centerBeam}`,
          {
            opacity: 0.72,
            scaleY: 1,
            duration: 0.18,
          },
          0.42
        );

        // Phase 3 (0.55 → 1.0): Hold — let user absorb the message
      });

      media.add("(max-width: 768px)", () => {
        // Mobile: scroll-driven character reveal
        gsap.to(chars, {
          color: "#080808",
          ease: "none",
          stagger: { each: 0.8 / chars.length },
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center center",
            scrub: 0.8,
          },
        });

        rows.forEach((row) => {
          gsap.to(row, {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              end: "center center",
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
            start: "top 60%",
            end: "center center",
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
            start: "top 60%",
            end: "center center",
            scrub: 0.9,
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  // Build character spans
  const renderLine = (text: string, lineIndex: number) => {
    if (text === "") {
      return <br key={`br-${lineIndex}`} />;
    }

    return (
      <span key={`line-${lineIndex}`} className={styles.line}>
        {text.split("").map((char, charIndex) => (
          <span
            key={`c-${lineIndex}-${charIndex}`}
            data-char
            className={styles.char}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      <div className={styles.panel}>
        {/* Background data field */}
        <div className={styles.field} aria-hidden="true">
          <div className={styles.centerBeam} />

          {ROWS.map((row, index) => (
            <div key={`row-${index}`} className={styles.rowWrap}>
              <div
                data-row
                data-shift={row.shift}
                data-duration={row.duration}
                className={styles.row}
                style={{ "--signal-width": row.signalWidth } as CSSProperties}
              >
                <span className={styles.signal} data-signal />

                {row.particles.map((particle, pi) => (
                  <span
                    key={`p-${index}-${pi}`}
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

        {/* Foreground text */}
        <div className={styles.copy}>
          <p className={styles.kicker}>The Industry Problem</p>
          <h2 className={styles.headline}>
            {LINES.map((line, i) => renderLine(line, i))}
          </h2>
        </div>
      </div>
    </section>
  );
}
