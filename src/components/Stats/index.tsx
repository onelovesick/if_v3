"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Stats.module.css";

const STATS = [
  { num: "$12", unit: "B+", label: "Programme value under digital delivery" },
  { num: "47", unit: "", label: "Active programmes across North America" },
  { num: "8.4", unit: "M", label: "Model elements coordinated to date" },
  { num: "19650", unit: "", label: "ISO compliant by default · audit trail end-to-end" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      const t = gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        delay: i * 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <span data-reveal className={styles.eyebrow}>
          By the numbers
        </span>
        <h2 data-reveal className={styles.title}>
          Powerful resources. Proven results.
        </h2>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <div key={i} data-reveal className={styles.stat}>
              <span className={styles.num}>
                {stat.num}
                {stat.unit ? <span className={styles.unit}>{stat.unit}</span> : null}
              </span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
