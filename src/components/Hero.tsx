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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frameId = 0;
    let width = 0;
    let height = 0;

    const strands: Strand[] = Array.from({ length: 22 }, (_, index) => {
      const spread = index / 21 - 0.5;

      return {
        amplitude: 12 + Math.random() * 18,
        bend: 90 + Math.random() * 160,
        end: 0.34 + spread * 0.16,
        focus: spread * 72,
        opacity: 0.06 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0001 + Math.random() * 0.00018,
        start: 0.56 + spread * 0.28,
        width: index % 5 === 0 ? 2.8 : 1 + Math.random() * 0.9,
      };
    });

    const particles: Particle[] = Array.from({ length: 30 }, (_, index) => ({
      lane: index / 29 - 0.5,
      phase: Math.random(),
      size: 1.4 + Math.random() * 3,
      speed: 0.00004 + Math.random() * 0.00008,
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

      const focusX = width * 0.695;
      const focusY = height * 0.63;

      const coreGlow = context.createRadialGradient(
        focusX,
        focusY,
        0,
        focusX,
        focusY,
        width * 0.22
      );
      coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      coreGlow.addColorStop(0.2, "rgba(207, 232, 252, 0.54)");
      coreGlow.addColorStop(0.46, "rgba(174, 211, 240, 0.18)");
      coreGlow.addColorStop(1, "rgba(174, 211, 240, 0)");

      context.fillStyle = coreGlow;
      context.beginPath();
      context.arc(focusX, focusY, width * 0.22, 0, Math.PI * 2);
      context.fill();

      strands.forEach((strand, index) => {
        const wave = Math.sin(time * strand.speed + strand.phase);
        const startY = height * strand.start + wave * strand.amplitude;
        const endY =
          height * strand.end +
          Math.cos(time * strand.speed * 0.72 + strand.phase) *
            strand.amplitude *
            0.58;
        const focusOffset =
          strand.focus +
          Math.sin(time * strand.speed * 1.15 + strand.phase) * 14;

        const path = new Path2D();
        path.moveTo(-100, startY);
        path.bezierCurveTo(
          width * 0.18,
          startY - strand.bend * 0.24,
          width * 0.49,
          focusY + focusOffset,
          focusX,
          focusY + focusOffset * 0.22
        );
        path.bezierCurveTo(
          width * 0.84,
          focusY + focusOffset * 0.1,
          width * 0.96,
          endY,
          width + 100,
          endY
        );

        context.globalAlpha = 0.1 + strand.opacity * 0.55;
        context.strokeStyle = "rgba(180, 216, 244, 0.82)";
        context.lineWidth = strand.width * 3.6;
        context.shadowBlur = 0;
        context.stroke(path);

        const gradient = context.createLinearGradient(0, startY, width, endY);
        gradient.addColorStop(0, `rgba(85, 116, 146, ${strand.opacity * 0.3})`);
        gradient.addColorStop(0.36, `rgba(147, 185, 218, ${strand.opacity})`);
        gradient.addColorStop(
          0.62,
          `rgba(255, 255, 255, ${Math.min(strand.opacity + 0.24, 0.52)})`
        );
        gradient.addColorStop(1, `rgba(155, 189, 221, ${strand.opacity * 0.18})`);

        context.globalAlpha = 1;
        context.strokeStyle = gradient;
        context.lineWidth = strand.width;
        context.shadowBlur = index % 4 === 0 ? 16 : 6;
        context.shadowColor = "rgba(190, 229, 255, 0.34)";
        context.stroke(path);
      });

      context.shadowBlur = 0;

      particles.forEach((particle) => {
        const progress = (time * particle.speed + particle.phase) % 1;
        const x = focusX - width * 0.28 + width * 0.46 * progress;
        const y =
          focusY +
          particle.lane * 52 * (1 - progress) +
          Math.sin(progress * Math.PI * 7 + particle.phase * Math.PI * 2) * 12;
        const alpha = 0.22 + (1 - Math.abs(progress - 0.5) * 1.7) * 0.56;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.shadowBlur = 22;
        context.shadowColor = "rgba(255, 255, 255, 0.62)";
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      context.globalAlpha = 1;

      if (!prefersReducedMotion) {
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

      const introItems = section.querySelectorAll<HTMLElement>("[data-reveal]");
      const indicatorRing = section.querySelector<SVGElement>("[data-indicator-ring]");
      const depthItems = section.querySelectorAll<HTMLElement>("[data-depth]");
      const tiltItems = section.querySelectorAll<HTMLElement>("[data-tilt]");
      const floatingLayers = section.querySelectorAll<HTMLElement>(
        `.${styles.depthPlaneMid}, .${styles.depthPlaneNear}, .${styles.glassPaneRight}, .${styles.focusHalo}, .${styles.canvasShell}`
      );
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      gsap.from(introItems, {
        y: 36,
        opacity: 0,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.18,
      });

      gsap.from(`.${styles.signalCard}`, {
        y: 54,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.34,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.82,
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

      if (!prefersReducedMotion) {
        gsap.to(floatingLayers, {
          xPercent: 1.5,
          yPercent: -2.5,
          repeat: -1,
          yoyo: true,
          duration: 7.4,
          ease: "sine.inOut",
          stagger: {
            each: 0.28,
            from: "random",
          },
        });

        gsap.to(`.${styles.focusBloom}`, {
          scale: 1.08,
          opacity: 0.98,
          repeat: -1,
          yoyo: true,
          duration: 4.2,
          ease: "sine.inOut",
        });

        gsap.to(`.${styles.focusCore}`, {
          scale: 1.04,
          repeat: -1,
          yoyo: true,
          duration: 3.4,
          ease: "sine.inOut",
        });
      }

      gsap.to(`.${styles.content}`, {
        y: -88,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.82,
        },
      });

      gsap.to(`.${styles.signalColumn}`, {
        y: -126,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      if (prefersReducedMotion || !hasFinePointer) {
        return;
      }

      const setDepth = (x: number, y: number) => {
        depthItems.forEach((item) => {
          const depth = Number(item.dataset.depth ?? 1);

          gsap.to(item, {
            x: x * depth * 34,
            y: y * depth * 26,
            duration: 1.15,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        tiltItems.forEach((item) => {
          const depth = item.dataset.tilt === "card" ? 1.25 : 0.65;

          gsap.to(item, {
            x: x * depth * 22,
            y: y * depth * 16,
            rotationY: x * depth * 5.5,
            rotationX: -y * depth * 4.8,
            duration: 1.15,
            ease: "power3.out",
            overwrite: "auto",
            transformPerspective: 1800,
            transformOrigin: "center center",
          });
        });
      };

      const handlePointerMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setDepth(x, y);
      };

      const handlePointerLeave = () => {
        setDepth(0, 0);
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <div
          className={`${styles.depthPlane} ${styles.depthPlaneFar}`}
          data-depth="0.4"
        />
        <div
          className={`${styles.depthPlane} ${styles.depthPlaneMid}`}
          data-depth="0.8"
        />
        <div
          className={`${styles.depthPlane} ${styles.depthPlaneNear}`}
          data-depth="1.25"
        />
        <div className={styles.lightColumn} data-depth="0.5" />
        <div
          className={`${styles.glassPane} ${styles.glassPaneLeft}`}
          data-depth="0.95"
        />
        <div
          className={`${styles.glassPane} ${styles.glassPaneRight}`}
          data-depth="1.4"
        />
        <div className={styles.skyGlow} data-depth="0.3" />
        <div className={styles.horizonGlow} data-depth="0.7" />
        <div className={styles.atmosphereBand} />
        <div className={styles.grid} data-depth="0.28" />
        <div className={styles.focusBloom} data-depth="1.55" />
        <div className={styles.focusHalo} data-depth="1.9" />
        <div className={styles.focusCore} data-depth="2.2" />

        <div className={styles.canvasShell} data-depth="1.05">
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>

        <div className={styles.noise} />
      </div>

      <div className={`${styles.inner} page-container`}>
        <div className={styles.content}>
          <div className={styles.contentTilt} data-tilt="content">
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
        </div>

        <div className={styles.signalColumn}>
          <aside className={styles.signalCard} aria-label="Delivery signal overview" data-tilt="card">
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
              Built for programmes coordinating BIM, schedule, field,
              governance, and commercial decisions at the same time.
            </p>
          </aside>
        </div>
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
          <circle
            cx="21"
            cy="21"
            r="20.25"
            stroke="currentColor"
            strokeOpacity="0.24"
          />
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
