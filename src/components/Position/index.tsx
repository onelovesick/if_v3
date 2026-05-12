"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Position.module.css";

/**
 * S2 Position — pure-white editorial spread. The story of the practice
 * presented as three paragraphs of mixed-size display type, with key
 * phrases that fill electric blue as they cross the scroll threshold.
 * The eye is meant to travel through the section, not just read it.
 */
export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
      const fills = root.querySelectorAll<HTMLElement>("[data-fill]");

      if (reduce) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        fills.forEach((el) => el.classList.add(styles.filled));
        return;
      }

      reveals.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 1.15,
          ease: "expo.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });
      });

      fills.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          onEnter: () => el.classList.add(styles.filled),
          onLeaveBack: () => el.classList.remove(styles.filled),
        });
      });

      ScrollTrigger.refresh();
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
        <span data-reveal className={styles.eyebrow}>
          The Practice
        </span>

        <div className={styles.spread}>
          <p data-reveal className={styles.para}>
            Infraforma is an{" "}
            <span className={styles.emph}>
              independent information management
            </span>{" "}
            practice serving major{" "}
            <span data-fill className={styles.fill}>
              infrastructure programs.
            </span>
          </p>

          <p data-reveal className={`${styles.para} ${styles.paraRight}`}>
            We operate at the{" "}
            <span className={styles.emph}>intersection</span> of owners,
            designers, contractors, and operators, embedded within delivery
            teams and{" "}
            <span data-fill className={styles.fill}>
              aligned to the needs of the project as a whole.
            </span>
          </p>

          <p data-reveal className={styles.para}>
            We establish the{" "}
            <span className={styles.emph}>information framework</span>{" "}
            that allows delivery teams to{" "}
            <span data-fill className={styles.fill}>
              understand, control, and trust
            </span>{" "}
            what is being designed, built, approved, and handed over,
            turning{" "}
            <span data-fill className={styles.fill}>
              project data
            </span>{" "}
            into{" "}
            <span data-fill className={styles.fill}>
              usable intelligence
            </span>{" "}
            from execution through operations.
          </p>
        </div>
      </div>
    </section>
  );
}
