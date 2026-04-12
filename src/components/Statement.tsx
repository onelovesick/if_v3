"use client";

import { type CSSProperties, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

/* ─── The statement ─── */

const STATEMENT = "$1.8 trillion lost to bad data in a single year.";

/* ─── Data rows — 14 rows spanning the full section height ─── */

function makeParticles(count: number) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = 4 + Math.random() * 92;
    out.push({
      x: `${x.toFixed(1)}%`,
      size: Math.random() > 0.5 ? 3 : 4,
      opacity: 0.14 + Math.random() * 0.2,
    });
  }
  return out.sort((a, b) => parseFloat(a.x) - parseFloat(b.x));
}

const ROWS = Array.from({ length: 14 }, (_, i) => {
  const direction = i % 2 === 0 ? -1 : 1;
  const magnitude = 16 + Math.random() * 24;
  return {
    shift: Math.round(direction * magnitude),
    duration: 0.5 + Math.random() * 0.4,
    signalWidth: `clamp(100px, ${8 + Math.random() * 4}vw, ${160 + Math.random() * 60}px)`,
    particles: makeParticles(6 + Math.floor(Math.random() * 4)),
  };
});

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
        opacity: 0.3,
        scaleX: 0.65,
        transformOrigin: "center center",
      });

      gsap.set(particles, {
        opacity: 0.1,
        scale: 0.7,
        transformOrigin: "center center",
      });

      gsap.set(`.${styles.centerBeam}`, {
        opacity: 0,
        scaleY: 0.5,
        transformOrigin: "center center",
      });

      // Character reveal: start when section enters, complete at center
      gsap.to(chars, {
        color: "var(--navy)",
        ease: "none",
        stagger: { each: 1 / chars.length },
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 0.5,
        },
      });

      // Rows align on same scroll window
      rows.forEach((row, i) => {
        gsap.to(row, {
          xPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "center center",
            scrub: 0.6 + i * 0.02,
          },
        });
      });

      // Signals solidify
      gsap.to(signals, {
        opacity: 1,
        scaleX: 1,
        stagger: 0.01,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "center center",
          scrub: 0.6,
        },
      });

      // Particles come alive
      gsap.to(particles, {
        opacity: (_, target) =>
          Number((target as HTMLElement).dataset.opacity ?? 0.3),
        scale: 1,
        stagger: 0.003,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "center center",
          scrub: 0.6,
        },
      });

      // Center alignment beam
      gsap.to(`.${styles.centerBeam}`, {
        opacity: 0.6,
        scaleY: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 40%",
          end: "center center",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      {/* Background data field */}
      <div className={styles.field} aria-hidden="true">
        <div className={styles.centerBeam} />

        {ROWS.map((row, i) => (
          <div key={`row-${i}`} className={styles.rowWrap}>
            <div
              data-row
              data-shift={row.shift}
              data-duration={row.duration}
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
          </div>
        ))}
      </div>

      {/* Foreground text */}
      <div className={styles.copy}>
        <p className={styles.kicker}>The Industry Problem</p>
        <h2 className={styles.headline}>
          {STATEMENT.split("").map((char, i) => (
            <span key={`c-${i}`} data-char className={styles.char}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
