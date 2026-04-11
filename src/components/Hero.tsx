"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const introItems = section.querySelectorAll("[data-reveal]");

      gsap.from(introItems, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(`.${styles.mediaFrame}`, {
        y: 52,
        opacity: 0,
        scale: 0.96,
        duration: 1.15,
        ease: "power3.out",
        delay: 0.18,
      });

      gsap.from(`.${styles.mediaCaption}`, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.42,
      });

      gsap.from(`.${styles.scrollCue}`, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.76,
      });

      gsap.to(`.${styles.copy}`, {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(`.${styles.mediaVisual}`, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      gsap.to(`.${styles.scrollCue}`, {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top+=240 top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow} data-reveal>
            Structured information management for complex engineering delivery
          </p>

          <h1 className={styles.headline} data-reveal>
            Engineering clarity for projects that cannot afford noise.
          </h1>

          <p className={styles.body} data-reveal>
            Infraforma brings design, commercial, governance, and field
            information into one disciplined operating environment so teams can
            make decisions with confidence.
          </p>

          <div className={styles.actions} data-reveal>
            <a className="btn btn-primary" href="#industry-issue">
              See the industry issue
            </a>
            <a className="btn btn-outline" href="#delivery-environment">
              Explore the framework
            </a>
          </div>
        </div>

        <div className={styles.mediaColumn} data-reveal>
          <div className={styles.mediaFrame}>
            <div className={styles.mediaVisual}>
              <Image
                src="/images/bridge-hero.jpg"
                alt="Large-scale infrastructure structure"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 46vw"
                className={styles.image}
              />
            </div>

            <div className={styles.mediaOverlay} />

            <div className={styles.mediaCaption}>
              <p className={styles.captionTitle}>
                Serious delivery work needs structure, not spectacle.
              </p>
              <p className={styles.captionBody}>
                A project image can set the tone. It should never pretend to be
                the operating system behind the work.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Scroll to the industry issue</span>
      </div>
    </section>
  );
}
