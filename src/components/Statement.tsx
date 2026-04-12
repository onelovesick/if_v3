"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

/* ─── Data rows config ─── */

interface RowConfig {
  shift: number;
  signalWidth: string;
  word?: string;
  particles: { x: string; size: number; opacity: number }[];
}

const ROWS: RowConfig[] = [
  {
    shift: -26,
    signalWidth: "clamp(90px, 8vw, 150px)",
    particles: [
      { x: "6%", size: 3, opacity: 0.22 },
      { x: "18%", size: 4, opacity: 0.28 },
      { x: "35%", size: 3, opacity: 0.18 },
      { x: "62%", size: 4, opacity: 0.24 },
      { x: "78%", size: 3, opacity: 0.2 },
      { x: "91%", size: 4, opacity: 0.26 },
    ],
  },
  {
    shift: -34,
    signalWidth: "clamp(110px, 10vw, 180px)",
    particles: [
      { x: "8%", size: 4, opacity: 0.26 },
      { x: "22%", size: 3, opacity: 0.2 },
      { x: "41%", size: 4, opacity: 0.3 },
      { x: "58%", size: 3, opacity: 0.18 },
      { x: "73%", size: 4, opacity: 0.24 },
      { x: "88%", size: 3, opacity: 0.2 },
    ],
  },
  {
    shift: -20,
    signalWidth: "clamp(100px, 9vw, 160px)",
    word: "We",
    particles: [
      { x: "5%", size: 3, opacity: 0.2 },
      { x: "15%", size: 4, opacity: 0.26 },
      { x: "32%", size: 3, opacity: 0.18 },
      { x: "67%", size: 4, opacity: 0.24 },
      { x: "82%", size: 3, opacity: 0.22 },
      { x: "94%", size: 4, opacity: 0.28 },
    ],
  },
  {
    shift: -38,
    signalWidth: "clamp(120px, 11vw, 190px)",
    word: "Close",
    particles: [
      { x: "9%", size: 4, opacity: 0.28 },
      { x: "21%", size: 3, opacity: 0.2 },
      { x: "36%", size: 4, opacity: 0.26 },
      { x: "64%", size: 3, opacity: 0.18 },
      { x: "77%", size: 4, opacity: 0.24 },
      { x: "92%", size: 3, opacity: 0.2 },
    ],
  },
  {
    shift: -16,
    signalWidth: "clamp(95px, 8.5vw, 155px)",
    word: "That",
    particles: [
      { x: "7%", size: 3, opacity: 0.22 },
      { x: "19%", size: 4, opacity: 0.26 },
      { x: "38%", size: 3, opacity: 0.18 },
      { x: "61%", size: 4, opacity: 0.24 },
      { x: "79%", size: 3, opacity: 0.2 },
      { x: "93%", size: 4, opacity: 0.26 },
    ],
  },
  {
    shift: -30,
    signalWidth: "clamp(105px, 9.5vw, 170px)",
    word: "Gap.",
    particles: [
      { x: "10%", size: 4, opacity: 0.26 },
      { x: "24%", size: 3, opacity: 0.2 },
      { x: "40%", size: 4, opacity: 0.28 },
      { x: "59%", size: 3, opacity: 0.16 },
      { x: "75%", size: 4, opacity: 0.22 },
      { x: "90%", size: 3, opacity: 0.2 },
    ],
  },
  {
    shift: -22,
    signalWidth: "clamp(85px, 7.5vw, 140px)",
    particles: [
      { x: "8%", size: 3, opacity: 0.2 },
      { x: "20%", size: 4, opacity: 0.24 },
      { x: "37%", size: 3, opacity: 0.18 },
      { x: "55%", size: 4, opacity: 0.26 },
      { x: "71%", size: 3, opacity: 0.2 },
      { x: "87%", size: 4, opacity: 0.24 },
    ],
  },
  {
    shift: -32,
    signalWidth: "clamp(95px, 8vw, 155px)",
    particles: [
      { x: "6%", size: 4, opacity: 0.24 },
      { x: "17%", size: 3, opacity: 0.18 },
      { x: "34%", size: 4, opacity: 0.26 },
      { x: "52%", size: 3, opacity: 0.2 },
      { x: "69%", size: 4, opacity: 0.22 },
      { x: "85%", size: 3, opacity: 0.18 },
      { x: "95%", size: 4, opacity: 0.24 },
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
      const words = Array.from(
        section.querySelectorAll<HTMLElement>("[data-word]")
      );
      const beam = section.querySelector(`.${styles.centerBeam}`);

      // Initial states
      rows.forEach((row) => {
        gsap.set(row, { xPercent: Number(row.dataset.shift ?? 0) });
      });

      gsap.set(signals, {
        opacity: 0.25,
        scaleX: 0.6,
        transformOrigin: "center center",
      });

      gsap.set(particles, {
        opacity: 0.08,
        scale: 0.6,
        transformOrigin: "center center",
      });

      gsap.set(words, { opacity: 0, y: 8 });

      if (beam) gsap.set(beam, { opacity: 0, scaleY: 0.4, transformOrigin: "center center" });

      // Phase 1: Character reveal as section enters
      gsap.to(chars, {
        color: "var(--navy)",
        ease: "none",
        stagger: { each: 1 / chars.length },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.5,
        },
      });

      // Phase 2: Rows align
      rows.forEach((row, i) => {
        gsap.to(row, {
          xPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "center center",
            scrub: 0.5 + i * 0.02,
          },
        });
      });

      // Signals solidify as rows align
      gsap.to(signals, {
        opacity: 1,
        scaleX: 1,
        stagger: 0.01,
        scrollTrigger: {
          trigger: section,
          start: "top 40%",
          end: "center center",
          scrub: 0.5,
        },
      });

      // Particles
      gsap.to(particles, {
        opacity: (_, target) =>
          Number((target as HTMLElement).dataset.opacity ?? 0.3),
        scale: 1,
        stagger: 0.003,
        scrollTrigger: {
          trigger: section,
          start: "top 40%",
          end: "center center",
          scrub: 0.5,
        },
      });

      // Center beam
      if (beam) {
        gsap.to(beam, {
          opacity: 0.5,
          scaleY: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 30%",
            end: "center center",
            scrub: 0.4,
          },
        });
      }

      // Phase 3: Words reveal after alignment
      words.forEach((word, i) => {
        gsap.to(word, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "center 55%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  // Build statement characters
  const statPart1 = "$1.8 Trillion";
  const statPart2 = " lost to bad data in a single year.";

  const renderChars = (text: string, offset: number, highlight: boolean) =>
    text.split("").map((char, i) => (
      <span
        key={`c-${offset + i}`}
        data-char
        className={highlight ? styles.charHighlight : styles.char}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      {/* Statement text — top half */}
      <div className={styles.copy}>
        <p className={styles.kicker}>The Industry Problem</p>
        <h2 className={styles.headline}>
          {renderChars(statPart1, 0, true)}
          {renderChars(statPart2, statPart1.length, false)}
        </h2>
      </div>

      {/* Data field — bottom half */}
      <div className={styles.field} aria-hidden="true">
        <div className={styles.centerBeam} />

        {ROWS.map((row, i) => (
          <div key={`row-${i}`} className={styles.rowWrap}>
            <div
              data-row
              data-shift={row.shift}
              className={styles.row}
              style={{ "--signal-width": row.signalWidth } as CSSProperties}
            >
              <span className={styles.signal} data-signal />

              {row.particles.map((p, pi) => (
                <span
                  key={`p-${i}-${pi}`}
                  data-particle
                  data-opacity={p.opacity}
                  className={styles.particle}
                  style={
                    {
                      "--particle-x": p.x,
                      "--particle-size": `${p.size}px`,
                      "--particle-opacity": p.opacity,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            {row.word && (
              <span data-word className={styles.word}>
                {row.word}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
