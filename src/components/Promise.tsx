"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Promise.module.css";

const PILLARS = [
  {
    index: "01",
    label: "Human led",
    body: "Senior people in the room on day one. No junior handoff, no outsourced delivery.",
  },
  {
    index: "02",
    label: "Digitally enabled",
    body: "BIM, CDE, dashboards, automation. Used where they earn their place. Nowhere else.",
  },
  {
    index: "03",
    label: "Owner aligned",
    body: "We answer to the asset's lifetime, not a construction milestone.",
  },
];

export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];

    const headTween = gsap.from(section.querySelectorAll("[data-anim='head']"), {
      opacity: 0,
      y: 14,
      duration: 0.8,
      stagger: 0.08,
      ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
    if (headTween.scrollTrigger) triggers.push(headTween.scrollTrigger);

    const statementTween = gsap.from(
      section.querySelectorAll("[data-anim='line']"),
      {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.14,
        ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='statement']"),
          start: "top 78%",
          toggleActions: "play none none none",
        },
      }
    );
    if (statementTween.scrollTrigger) triggers.push(statementTween.scrollTrigger);

    const pillarsTween = gsap.from(
      section.querySelectorAll("[data-anim='pillar']"),
      {
        opacity: 0,
        y: 20,
        duration: 0.85,
        stagger: 0.1,
        ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        scrollTrigger: {
          trigger: section.querySelector("[data-anim='pillars']"),
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    if (pillarsTween.scrollTrigger) triggers.push(pillarsTween.scrollTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.promise} aria-label="The promise">
      <div className={styles.container}>
        <header className={styles.head}>
          <div className={styles.headLabelGroup}>
            <p data-anim data-anim-name="head" className={styles.label}>
              <span className={styles.dot} aria-hidden="true" />
              The promise
            </p>
            <p data-anim data-anim-name="head" className={styles.subLabel}>
              Read in 20 seconds
            </p>
          </div>

          <div data-anim="statement" className={styles.statement}>
            <p>
              <span data-anim="line" className={styles.statementMuted}>
                We are not a software company. We are not a framework.
              </span>{" "}
              <span data-anim="line">
                We sit inside your project and make sure the information
                survives.
              </span>{" "}
              <span data-anim="line">
                From the first sketch, through every handover, into the asset
                you actually have to run.
              </span>
            </p>
          </div>
        </header>

        <div data-anim="pillars" className={styles.pillars}>
          {PILLARS.map((p) => (
            <article key={p.label} data-anim="pillar" className={styles.pillar}>
              <p className={styles.pillarLabel}>
                <span className={styles.pillarIndex}>{p.index}</span>
                {p.label}
              </p>
              <p className={styles.pillarBody}>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
