"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const HEADLINE = ["Projects", "don\u2019t", "fail", "from", "lack", "of", "tools.", "They", "fail", "from", "lack", "of", "structure."];
const PARTICLE_COUNT = 6;

const scrollState = { progress: 0 };

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas: 6 glowing particles that spiral inward
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      baseAngle: (i / PARTICLE_COUNT) * Math.PI * 2,
      size: 4 + Math.random() * 2,
    }));

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
      const p = scrollState.progress; // 0 → 1

      const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;
      const minRadius = Math.min(canvas.width, canvas.height) * 0.18;
      const radius = maxRadius - (maxRadius - minRadius) * p;

      // Spiral: rotate 180deg as they close in
      const spiralRotation = p * Math.PI;

      // Fade out in last 20% of scroll
      const fadeAlpha = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;

      particles.forEach((pt) => {
        const angle = pt.baseAngle + spiralRotation;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const sz = pt.size * devicePixelRatio;

        // 3D glow: radial gradient sphere
        const grad = ctx.createRadialGradient(x - sz * 0.3, y - sz * 0.3, 0, x, y, sz * 3);
        grad.addColorStop(0, `rgba(71, 181, 255, ${0.9 * fadeAlpha})`);
        grad.addColorStop(0.3, `rgba(71, 181, 255, ${0.4 * fadeAlpha})`);
        grad.addColorStop(0.6, `rgba(71, 181, 255, ${0.1 * fadeAlpha})`);
        grad.addColorStop(1, `rgba(71, 181, 255, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, sz * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(x, y, sz * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${0.95 * fadeAlpha})`;
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

      // Drive scroll progress 0→1 as section enters viewport
      gsap.to(scrollState, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      });

      // Word color: light grey → dark, staggered, all done by 100vh
      const words = section.querySelectorAll(`.${styles.word}`);
      const total = words.length;
      words.forEach((word, i) => {
        const startPct = 75 - (i / total) * 55;
        const endPct = startPct - 8;
        gsap.to(word, {
          color: "rgb(8, 8, 8)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `top ${startPct}%`,
            end: `top ${endPct}%`,
            scrub: 0.3,
          },
        });
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
