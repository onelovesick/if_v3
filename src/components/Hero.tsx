"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import FloatingLines from "./FloatingLines";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* ── Entrance animations ── */
      gsap.from("[data-copy-item]", {
        y: 34,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.12,
      });

      /* ── Scroll parallax ── */
      gsap.to(`.${styles.imageField}`, {
        yPercent: -3,
        scale: 1.015,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.76,
        },
      });

      gsap.to(`.${styles.linesLayer}`, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.72,
        },
      });

      // Headline drifts down + left (outward)
      gsap.to(`.${styles.headlineWrap}`, {
        y: 90,
        x: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      // Body copy drifts down + right (outward)
      gsap.to(`.${styles.bodyWrap}`, {
        y: 130,
        x: 50,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.72,
        },
      });

      gsap.to(`.${styles.scrollCue}`, {
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "top+=220 top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        {/* Background image */}
        <div className={styles.imageField}>
          <Image
            src="/images/bridge-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </div>

        {/* Gradient veils */}
        <div className={styles.imageVeil} />
        <div className={styles.atmosphere} />

        {/* Floating lines shader */}
        <div className={styles.linesLayer}>
          <FloatingLines
            linesGradient={[
              "#1a3a5c",
              "#2a5a8a",
              "#47b5ff",
              "#5ac0ff",
              "#47b5ff",
              "#2a5a8a",
              "#1a3a5c",
            ]}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={[5, 4, 6]}
            lineDistance={[5, 5, 4]}
            topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
            middleWavePosition={{ x: 5.0, y: 0.1, rotate: 0.15 }}
            bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1.0 }}
            animationSpeed={0.6}
            interactive={true}
            bendRadius={4.0}
            bendStrength={-0.4}
            mouseDamping={0.035}
            parallax={true}
            parallaxStrength={0.15}
            mixBlendMode="screen"
          />
        </div>
      </div>

      {/* Bottom dissolve — outside backdrop to avoid overflow:hidden clipping */}
      <div className={styles.bottomFade} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.headlineWrap} data-copy-item>
            <h1 className={styles.headline}>
              <span>Human-Led,</span>
              <span>Digitally Enabled.</span>
            </h1>
          </div>

          <div className={styles.bodyWrap} data-copy-item>
            <p className={styles.body}>
              Infraforma brings fragmented construction information into a
              disciplined flow so project teams can make clearer decisions,
              maintain context, and deliver with greater control.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Scroll to see the industry problem</span>
      </div>
    </section>
  );
}
