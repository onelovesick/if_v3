"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Feature.module.css";

export default function Feature() {
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
        y: 24,
        duration: 0.95,
        ease: "expo.out",
        delay: i * 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="cde" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.photo}>
          <img
            src="https://images.pexels.com/photos/9204747/pexels-photo-9204747.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt="Underground tunnel infrastructure"
            loading="lazy"
          />
        </div>
        <div className={styles.text}>
          <span data-reveal className={styles.eyebrow}>
            Featured capability
          </span>
          <h2 data-reveal className={styles.title}>
            Common Data Environment, reimagined.
          </h2>
          <p data-reveal className={styles.body}>
            Most CDEs were built to store files. Infraforma&rsquo;s CDE was
            built to deliver programmes. Federated models, schedule
            linkage, automated clash routing, and a deliverables workflow
            that maps to ISO 19650 out of the box.
          </p>
          <div data-reveal>
            <a href="#cde" className={styles.link}>
              How our CDE works <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
