"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Problem.module.css";

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const meta = section.querySelectorAll<HTMLElement>("[data-meta-item]");
      const lines = section.querySelectorAll<HTMLElement>("[data-line]");
      const rule = section.querySelector<HTMLElement>("[data-rule]");
      const body = section.querySelector<HTMLElement>("[data-body]");
      const watermark = section.querySelector<HTMLElement>("[data-watermark]");

      if (!rule || !body || !watermark) return;

      gsap.set(meta, { y: 14, opacity: 0 });
      gsap.set(lines, { y: 48, opacity: 0 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(body, { y: 20, opacity: 0 });
      gsap.set(watermark, { opacity: 0, x: -24 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        })
        .to(watermark, { opacity: 1, x: 0, duration: 1.2 }, 0)
        .to(meta, { y: 0, opacity: 1, stagger: 0.08, duration: 0.8 }, 0.1)
        .to(lines, { y: 0, opacity: 1, stagger: 0.14, duration: 1.1 }, 0.28)
        .to(rule, { scaleX: 1, duration: 1.1, ease: "power2.out" }, 0.9)
        .to(body, { y: 0, opacity: 1, duration: 0.9 }, 1.05);

      // Subtle parallax drift on the whole stage as you scroll through
      gsap.to(`.${styles.stage}`, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="problem" className={styles.section}>
      <span data-watermark className={styles.watermark} aria-hidden="true">
        02
      </span>

      <div className={styles.container}>
        <header className={styles.meta}>
          <p data-meta-item className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            The Real Problem
          </p>
          <p data-meta-item className={styles.index}>
            S2 / Problem
          </p>
        </header>

        <div className={styles.stage}>
          <h2 className={styles.headline}>
            <span data-line className={`${styles.line} ${styles.soft}`}>
              Projects don&apos;t fail
            </span>
            <span data-line className={`${styles.line} ${styles.strong}`}>
              from lack of tools.
            </span>
            <span data-line className={`${styles.line} ${styles.soft}`}>
              They fail
            </span>
            <span data-line className={`${styles.line} ${styles.strong}`}>
              from lack of structure.
            </span>
          </h2>

          <aside className={styles.support}>
            <div data-rule className={styles.rule} aria-hidden="true" />
            <p data-body className={styles.body}>
              Every programme already has software. What breaks is the
              information layer between teams — the decisions, handoffs, and
              context that no single tool owns.
            </p>
            <p data-body className={styles.bodyAccent}>
              That&apos;s the layer we build.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
