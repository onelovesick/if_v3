"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Problem.module.css";

/**
 * S3 — The industry problem.
 *
 * Editorial dark section. Single centred column. Typography does the
 * work: eyebrow, a wide display headline that lands the problem in
 * one breath, three short paragraphs of body that name the symptoms,
 * and a coda line above a hairline that bridges into what we do
 * about it (Layers, S4).
 */
export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(section.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 28,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="problem-title"
    >
      <div className={styles.shell}>
        <span data-reveal className={styles.eyebrow}>
          <span className={styles.eyebrowMark} /> 03 · The problem we work on
        </span>

        <h2 id="problem-title" data-reveal className={styles.title}>
          On a major program, the same fact lives in{" "}
          <em>twenty systems</em> and survives in none.
        </h2>

        <div data-reveal className={styles.body}>
          <p>
            Drawings drift from the model. The model drifts from what
            gets built. The as-built drifts from what is being
            operated. Reviews stall while teams argue over which
            version is real.
          </p>
          <p>
            Decisions get made without context. Disputes compound.
            Owners take possession of an asset they cannot operate
            without rebuilding its data from scratch.
          </p>
          <p>
            The industry treats information as a by-product of
            delivery. By the end of a program it is the single most
            expensive thing it has produced, and the least defensible.
          </p>
        </div>

        <div data-reveal className={styles.codaWrap}>
          <span className={styles.codaRule} aria-hidden="true" />
          <p className={styles.coda}>
            Information management isn&rsquo;t a deliverable. It is the
            practice that makes <em>every other deliverable</em>{" "}
            defensible.
          </p>
        </div>
      </div>
    </section>
  );
}
