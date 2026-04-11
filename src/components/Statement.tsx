"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const HEADLINE = [
  "Projects",
  "do",
  "not",
  "fail",
  "from",
  "lack",
  "of",
  "tools.",
  "They",
  "fail",
  "from",
  "lack",
  "of",
  "structure.",
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      gsap.from(`.${styles.kicker}`, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
        },
      });

      gsap.from(`.${styles.support}`, {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
        },
      });

      const words = section.querySelectorAll<HTMLElement>(`.${styles.word}`);
      const total = words.length;

      words.forEach((word, index) => {
        const startPct = 82 - (index / total) * 46;
        const endPct = startPct - 8;

        gsap.to(word, {
          color: "rgb(8, 18, 37)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: `top ${startPct}%`,
            end: `top ${endPct}%`,
            scrub: 0.35,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.copyRail}>
          <p className={styles.kicker}>Delivery Principle</p>
          <p className={styles.support}>
            The digital thread only matters when it reduces risk on the asset
            itself, not when it adds another layer of software theatre.
          </p>
        </div>

        <h2 className={styles.headline}>
          {HEADLINE.map((word, index) => (
            <span key={`${word}-${index}`} className={styles.word}>
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
