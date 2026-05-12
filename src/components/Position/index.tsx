"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Position.module.css";

/**
 * S2 Position — Kiewit-style composition: text column left, overlapping
 * photo collage right. Dark ground. Mixed-size emphasis inline; key
 * phrases fill electric blue as they enter the viewport.
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
      const photos = root.querySelectorAll<HTMLElement>("[data-photo]");

      if (reduce) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(photos, { opacity: 1, y: 0, scale: 1 });
        fills.forEach((el) => el.classList.add(styles.filled));
        return;
      }

      reveals.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });
      });

      photos.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          scale: 0.96,
          duration: 1.4,
          ease: "expo.out",
          delay: i * 0.14,
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
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
      data-tone="dark"
      data-dark
      className={styles.section}
    >
      <div className={styles.inner}>
        {/* Left: typographic story */}
        <div className={styles.text}>
          <span data-reveal className={styles.rule} aria-hidden="true" />

          <h2 data-reveal className={styles.title}>
            Independent information
            management for the projects
            the country can&rsquo;t afford
            to fail.
          </h2>

          <div className={styles.spread}>
            <p data-reveal className={styles.para}>
              Infraforma operates at the{" "}
              <span data-fill className={styles.fill}>
                intersection of owners, designers, contractors, and
                operators
              </span>
              , embedded within delivery teams and aligned to the needs
              of the project as a whole.
            </p>

            <p data-reveal className={styles.para}>
              We establish the information framework that allows
              delivery teams to{" "}
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

          <a data-reveal href="#layers" className={styles.cta}>
            Explore the practice
            <span aria-hidden="true" className={styles.arr}>
              →
            </span>
          </a>
        </div>

        {/* Right: overlapping photo collage */}
        <div className={styles.collage}>
          <figure
            data-photo
            className={`${styles.photo} ${styles.photoTop}`}
          >
            <img
              src="https://images.pexels.com/photos/6032899/pexels-photo-6032899.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Bridge structure under construction"
              loading="lazy"
            />
          </figure>

          <figure
            data-photo
            className={`${styles.photo} ${styles.photoMain}`}
          >
            <img
              src="https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=1800"
              alt="Aerial view of a multi-level highway interchange"
              loading="lazy"
            />
          </figure>

          <figure
            data-photo
            className={`${styles.photo} ${styles.photoBottom}`}
          >
            <img
              src="https://images.pexels.com/photos/9242803/pexels-photo-9242803.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Design team coordinating around drawings"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
