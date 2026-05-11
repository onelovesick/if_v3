"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Position.module.css";

const KEYWORDS = ["real data", "structure", "access", "insight", "decision support"];

export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-kw]");
      if (reduce) {
        words.forEach((w) => w.classList.add(styles.active));
        return;
      }

      words.forEach((w, i) => {
        ScrollTrigger.create({
          trigger: w,
          start: "top 70%",
          onEnter: () => w.classList.add(styles.active),
          onLeaveBack: () => w.classList.remove(styles.active),
        });
        void i;
      });

      // Node diagram status text
      const status = root.querySelector(`.${CSS.escape(styles.ndStatus)}`);
      if (status) {
        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          end: "bottom 60%",
          onEnter: () => {
            status.textContent = "Connecting";
            status.classList.add(styles.ndStatusActive);
          },
          onEnterBack: () => {
            status.textContent = "Connecting";
            status.classList.add(styles.ndStatusActive);
          },
          onLeave: () => {
            status.textContent = "Harmonized";
          },
          onLeaveBack: () => {
            status.textContent = "Standby";
            status.classList.remove(styles.ndStatusActive);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="position"
      data-section
      data-tone="light"
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>
            <strong>S2</strong> · The Practice
          </span>

          <div className={styles.manifesto}>
            <h2>
              We take{" "}
              <span data-kw className={styles.kw}>
                {KEYWORDS[0]}
              </span>
              , <span data-kw className={styles.kw}>{KEYWORDS[1]}</span> it, and
              turn it into{" "}
              <span data-kw className={styles.kw}>
                {KEYWORDS[2]}
              </span>
              , <span data-kw className={styles.kw}>{KEYWORDS[3]}</span>, and{" "}
              <span data-kw className={styles.kw}>{KEYWORDS[4]}</span>.
            </h2>
          </div>

          <div className={styles.bottom}>
            <p className={styles.supporting}>
              We sit between the parties on the project, not for any one of
              them. That neutrality is the point. We map the information,
              govern the seams, and keep the practice answering to the
              program, not the politics.
            </p>
            <div className={styles.audience}>
              <span>
                <span className={styles.lbl}>We work with</span>
                <span className={styles.val}>Owners · Designers · Contractors</span>
              </span>
              <span>
                <span className={styles.lbl}>Across</span>
                <span className={styles.val}>
                  Transportation · Energy · Civil · Buildings · Industrial
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.diagram}>
          <span className={`${styles.ndCorner} ${styles.tl}`} />
          <span className={`${styles.ndCorner} ${styles.tr}`} />
          <span className={`${styles.ndCorner} ${styles.bl}`} />
          <span className={`${styles.ndCorner} ${styles.br}`} />

          <div className={styles.ndHeader}>
            <span className={styles.ndTitle}>Information Spine</span>
            <span className={styles.ndStatus}>Standby</span>
          </div>

          <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            {/* Dashed seams */}
            <line x1="80" y1="80" x2="320" y2="320" stroke="rgba(10,14,22,0.2)" strokeDasharray="4 6" />
            <line x1="320" y1="80" x2="80" y2="320" stroke="rgba(10,14,22,0.2)" strokeDasharray="4 6" />

            {/* Connector lines from hub to outer nodes */}
            <line x1="200" y1="200" x2="80" y2="80" stroke="var(--blue)" strokeWidth="1.4" />
            <line x1="200" y1="200" x2="320" y2="80" stroke="var(--blue)" strokeWidth="1.4" />
            <line x1="200" y1="200" x2="200" y2="340" stroke="var(--blue)" strokeWidth="1.4" />

            {/* Outer nodes */}
            <g>
              <rect x="50" y="50" width="60" height="60" fill="var(--bg-soft)" stroke="var(--ink)" strokeWidth="1" />
              <text x="80" y="84" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink)" letterSpacing="0.16em">
                OWNER
              </text>
            </g>
            <g>
              <rect x="290" y="50" width="60" height="60" fill="var(--bg-soft)" stroke="var(--ink)" strokeWidth="1" />
              <text x="320" y="84" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink)" letterSpacing="0.16em">
                DESIGN
              </text>
            </g>
            <g>
              <rect x="170" y="310" width="60" height="60" fill="var(--bg-soft)" stroke="var(--ink)" strokeWidth="1" />
              <text x="200" y="344" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink)" letterSpacing="0.16em">
                BUILD
              </text>
            </g>

            {/* Hub */}
            <g>
              <rect x="160" y="160" width="80" height="80" fill="var(--ink)" />
              <text x="200" y="196" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--bg)" letterSpacing="0.18em">
                INFRA
              </text>
              <text x="200" y="212" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--bg)" letterSpacing="0.18em">
                FORMA
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
