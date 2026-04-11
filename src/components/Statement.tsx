"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Statement.module.css";

const ISSUES = [
  {
    title: "Versions move faster than alignment.",
    text: "Teams lose time proving what is current, approved, and relevant to the task in front of them.",
  },
  {
    title: "Risk grows in the handoffs.",
    text: "Design, commercial, procurement, and site delivery each hold part of the picture, but not the full decision trail.",
  },
  {
    title: "Dashboards do not create discipline.",
    text: "More software does not solve the problem when the underlying information model is still fragmented.",
  },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      gsap.from(`.${styles.copyRail}`, {
        y: 28,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
        },
      });

      gsap.from(`.${styles.issueCard}`, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 66%",
        },
      });

      gsap.to(`.${styles.progressLine}`, {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 34%",
          scrub: 0.7,
        },
      });

      gsap.to(`.${styles.ambientGlow}`, {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="industry-issue" className={styles.section}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.copyRail}>
          <p className={styles.kicker}>The Industry Issue</p>
          <h2 className={styles.headline}>
            Information is everywhere. Shared control is not.
          </h2>
          <p className={styles.support}>
            Major programmes rarely struggle because teams lack data. They
            struggle because design, commercial, procurement, and site delivery
            are each working with partial context at different moments in time.
          </p>
        </div>

        <div className={styles.issueRail}>
          <div className={styles.progressLine} aria-hidden="true" />

          {ISSUES.map((issue, index) => (
            <article key={issue.title} className={styles.issueCard}>
              <p className={styles.issueIndex}>0{index + 1}</p>
              <h3 className={styles.issueTitle}>{issue.title}</h3>
              <p className={styles.issueText}>{issue.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.ambientGlow} aria-hidden="true" />
    </section>
  );
}
