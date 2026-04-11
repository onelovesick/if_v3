"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Pillars.module.css";

const PILLARS = [
  {
    key: "teams",
    label: "Connected Teams",
    text: "Ten platforms. Six disciplines. One programme. We make them see the same project through shared data structure, not meetings.",
  },
  {
    key: "delivery",
    label: "Construction Delivery",
    text: "The model drives the build, not documents it after. Design to schedule to field, closing the gap every day instead of widening it.",
  },
  {
    key: "risk",
    label: "Risk Intelligence",
    text: "Risk is the relationship between your schedule, your budget, and the unknowns between them. We make that relationship visible and quantified.",
  },
];

export default function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Circles drift in from spread positions
      gsap.from(`.${styles.circle1}`, {
        x: -180,
        y: -120,
        scale: 0.7,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
        },
      });

      gsap.from(`.${styles.circle2}`, {
        x: 180,
        y: -120,
        scale: 0.7,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
        },
      });

      gsap.from(`.${styles.circle3}`, {
        x: 0,
        y: 180,
        scale: 0.7,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
        },
      });

      // Center target fades in after circles settle
      gsap.from(`.${styles.target}`, {
        scale: 0,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 30%",
          end: "top 5%",
          scrub: 0.6,
        },
      });

      // Pillar labels stagger in
      gsap.from(`.${styles.pillar}`, {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 40%",
          end: "top 10%",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.layout}>
        {/* Venn diagram */}
        <div className={styles.vennContainer}>
          <div className={styles.venn}>
            <div className={`${styles.circle} ${styles.circle1}`}>
              <div className={styles.circleInner} />
            </div>
            <div className={`${styles.circle} ${styles.circle2}`}>
              <div className={styles.circleInner} />
            </div>
            <div className={`${styles.circle} ${styles.circle3}`}>
              <div className={styles.circleInner} />
            </div>

            {/* Center target */}
            <div className={styles.target}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="1.5" opacity="0.8" />
                <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="1.5" opacity="0.6" />
                <circle cx="24" cy="24" r="4" fill="white" opacity="0.9" />
                <line x1="24" y1="0" x2="24" y2="10" stroke="white" strokeWidth="1" opacity="0.4" />
                <line x1="24" y1="38" x2="24" y2="48" stroke="white" strokeWidth="1" opacity="0.4" />
                <line x1="0" y1="24" x2="10" y2="24" stroke="white" strokeWidth="1" opacity="0.4" />
                <line x1="38" y1="24" x2="48" y2="24" stroke="white" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>

            {/* Connector dots on circle edges */}
            <div className={`${styles.dot} ${styles.dotTop}`} />
            <div className={`${styles.dot} ${styles.dotLeft}`} />
            <div className={`${styles.dot} ${styles.dotRight}`} />
          </div>
        </div>

        {/* Pillar text blocks */}
        <div className={styles.pillarsGrid}>
          {PILLARS.map((p, i) => (
            <div key={p.key} className={styles.pillar}>
              <span className={styles.pillarNumber}>0{i + 1}</span>
              <h3 className={styles.pillarLabel}>{p.label}</h3>
              <p className={styles.pillarText}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
