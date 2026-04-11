"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

const DELIVERY_SIGNAL = [
  {
    label: "Capture the signal",
    text: "Pull design, schedule, field, and commercial inputs into one structured layer.",
  },
  {
    label: "Connect the system",
    text: "Align teams around shared control points instead of disconnected handoffs.",
  },
  {
    label: "Drive delivery",
    text: "Turn live information into decisions the programme can trust and execute.",
  },
];

type Strand = {
  amplitude: number;
  bend: number;
  end: number;
  focus: number;
  opacity: number;
  phase: number;
  speed: number;
  start: number;
  width: number;
};

type Particle = {
  lane: number;
  phase: number;
  size: number;
  speed: number;
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frameId = 0;
    let width = 0;
    let height = 0;

    const strands: Strand[] = Array.from({ length: 18 }, (_, index) => {
      const spread = index / 17 - 0.5;

      return {
        amplitude: 16 + Math.random() * 20,
        bend: 72 + Math.random() * 140,
        end: 0.4 + spread * 0.14,
        focus: spread * 64,
        opacity: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00014 + Math.random() * 0.00016,
        start: 0.54 + spread * 0.24,
        width: index % 4 === 0 ? 2.4 : 1.05 + Math.random() * 0.7,
      };
    });

    const particles: Particle[] = Array.from({ length: 26 }, (_, index) => ({
      lane: index / 25 - 0.5,
      phase: Math.random(),
      size: 1.6 + Math.random() * 2.8,
      speed: 0.00005 + Math.random() * 0.00008,
    }));

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      const focusX = width * 0.69;
      const focusY = height * 0.63;

      strands.forEach((strand, index) => {
        const wave = Math.sin(time * strand.speed + strand.phase);
        const startY = height * strand.start + wave * strand.amplitude;
        const endY =
          height * strand.end +
          Math.cos(time * strand.speed * 0.72 + strand.phase) * strand.amplitude * 0.55;
        const focusOffset =
          strand.focus + Math.sin(time * strand.speed * 1.15 + strand.phase) * 12;

        const gradient = context.createLinearGradient(0, startY, width, endY);
        gradient.addColorStop(0, `rgba(86, 119, 150, ${strand.opacity * 0.42})`);
        gradient.addColorStop(0.48, `rgba(120, 170, 219, ${strand.opacity})`);
        gradient.addColorStop(
          0.72,
          `rgba(255, 255, 255, ${Math.min(strand.opacity + 0.2, 0.45)})`
        );
        gradient.addColorStop(1, `rgba(138, 170, 202, ${strand.opacity * 0.28})`);

        context.beginPath();
        context.moveTo(-80, startY);
        context.bezierCurveTo(
          width * 0.2,
          startY - strand.bend * 0.32,
          width * 0.5,
          focusY + focusOffset,
          focusX,
          focusY + focusOffset * 0.2
        );
        context.bezierCurveTo(
          width * 0.84,
          focusY + focusOffset * 0.15,
          width * 0.96,
          endY,
          width + 80,
          endY
        );

        context.strokeStyle = gradient;
        context.lineWidth = strand.width;
        context.shadowBlur = index % 4 === 0 ? 14 : 0;
        context.shadowColor = "rgba(163, 217, 255, 0.38)";
        context.stroke();
      });

      context.shadowBlur = 0;

      particles.forEach((particle) => {
        const progress = (time * particle.speed + particle.phase) % 1;
        const x = focusX - width * 0.24 + width * 0.42 * progress;
        const y =
          focusY +
          particle.lane * 44 * (1 - progress) +
          Math.sin(progress * Math.PI * 6 + particle.phase * Math.PI * 2) * 10;
        const alpha = 0.24 + (1 - Math.abs(progress - 0.5) * 1.6) * 0.52;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.shadowBlur = 18;
        context.shadowColor = "rgba(255, 255, 255, 0.5)";
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const introItems = section.querySelectorAll("[data-reveal]");
      const indicatorRing = section.querySelector("[data-indicator-ring]");

      gsap.from(introItems, {
        y: 36,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.18,
      });

      gsap.from(`.${styles.signalCard}`, {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.34,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.8,
      });

      if (indicatorRing) {
        gsap.to(indicatorRing, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.35,
          ease: "sine.inOut",
        });
      }

      gsap.to(`.${styles.content}`, {
        y: -84,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(`.${styles.signalCard}`, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.skyGlow} />
        <div className={styles.horizonGlow} />
        <div className={styles.atmosphereBand} />
        <div className={styles.grid} />
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.noise} />
      </div>

      <div className={`${styles.inner} page-container`}>
        <div className={styles.content}>
          <p className={styles.eyebrow} data-reveal>
            Information Flow, Structured
          </p>
          <h1 className={styles.headline} data-reveal>
            From fragmented flow to controlled delivery.
          </h1>
          <p className={styles.body} data-reveal>
            Complex programmes generate information from every direction.
            Infraforma shapes that flow into a delivery environment teams can
            manage, trust, and execute against.
          </p>

          <div className={styles.actions} data-reveal>
            <a className="btn btn-primary" href="#delivery-environment">
              Explore the framework
            </a>
            <a className="btn btn-outline" href="#proof">
              See why it works
            </a>
          </div>
        </div>

        <aside className={styles.signalCard} aria-label="Delivery signal overview">
          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>Delivery Signal</span>
            <span className={styles.cardStatus}>
              <span className={styles.cardStatusDot} />
              Live
            </span>
          </div>

          <div className={styles.cardTrack}>
            {DELIVERY_SIGNAL.map((item, index) => (
              <div key={item.label} className={styles.cardRow}>
                <span className={styles.cardNumber}>0{index + 1}</span>
                <div>
                  <p className={styles.cardLabel}>{item.label}</p>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.cardFootnote}>
            Built for programmes coordinating BIM, schedule, field, governance,
            and commercial decisions at the same time.
          </p>
        </aside>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll to see the flow</span>
        <svg
          data-indicator-ring
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="21" cy="21" r="20.25" stroke="currentColor" strokeOpacity="0.24" />
          <path
            d="M21 11.5V27.5M21 27.5L15.5 22M21 27.5L26.5 22"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
