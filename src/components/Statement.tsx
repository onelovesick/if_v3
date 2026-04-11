"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const PARTICLE_COUNT = 120;
const HEADLINE = ["Projects", "don't", "fail", "from", "lack", "of", "tools.", "They", "fail", "from", "lack", "of", "structure."];

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const radiusState = { value: 1 };

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rng = seededRandom(77);
    const particles: { angle: number; radiusOffset: number; size: number; opacity: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (rng() - 0.5) * 0.3,
        radiusOffset: (rng() - 0.5) * 0.12,
        size: 1.5 + rng() * 2,
        opacity: 0.15 + rng() * 0.25,
      });
    }

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.42 * radiusState.value;

      particles.forEach((p) => {
        const r = baseRadius * (1 + p.radiusOffset);
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, p.size * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 90, 90, ${p.opacity})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Circle tightens
      gsap.to(radiusState, {
        value: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      });

      // Fade out canvas
      gsap.to(canvasRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 8%",
          end: "top top",
          scrub: 0.4,
        },
      });

      // Word reveal — all done by 100vh
      const words = section.querySelectorAll(`.${styles.word}`);
      const total = words.length;
      words.forEach((word, i) => {
        const startPct = 80 - (i / total) * 65;
        const endPct = startPct - 6;
        gsap.fromTo(
          word,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `top ${startPct}%`,
              end: `top ${endPct}%`,
              scrub: 0.3,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <h2 className={styles.headline}>
        <span className={styles.line1}>
          {HEADLINE.slice(0, 7).map((w, i) => (
            <span key={i} className={styles.word}>{w}</span>
          ))}
        </span>
        <br />
        <span className={styles.line2}>
          {HEADLINE.slice(7).map((w, i) => (
            <span key={i + 7} className={styles.word}>{w}</span>
          ))}
        </span>
      </h2>
    </section>
  );
}
