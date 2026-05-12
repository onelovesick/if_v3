"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Position.module.css";

export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (reduce) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        return;
      }

      reveals.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
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

        <p data-reveal className={styles.statement}>
          Infraforma is a neutral information management
          practice for major infrastructure programs.
        </p>

        <p data-reveal className={styles.statement}>
          We work between owners, designers, and contractors
          on the country&rsquo;s flagship programs —
          embedded in delivery, accountable to the project
          itself.
        </p>

        <p data-reveal className={styles.statement}>
          We govern the information, structure the
          deliverables, and hand operations a working asset
          on day one.
        </p>

        <span data-reveal className={styles.signOff}>
          Quebec City · Montreal · Ottawa
        </span>
      </div>
    </section>
  );
}
