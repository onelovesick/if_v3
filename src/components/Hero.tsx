"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(`.${styles.monoLabel}`, {
        y: 12,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
      })
        .from(
          `.${styles.headline}`,
          { y: 30, opacity: 0, duration: 1 },
          "-=0.5"
        )
        .from(
          `.${styles.subtitle}`,
          { y: 20, opacity: 0, duration: 0.8 },
          "-=0.6"
        )
        .from(
          `.${styles.scrollIndicator}`,
          { opacity: 0, duration: 0.6 },
          "-=0.3"
        );

      // Headline sinks downward — disappears behind S2's white background
      gsap.to(`.${styles.headline}`, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Subtitle drifts down and right — exits the screen
      gsap.to(`.${styles.subtitle}`, {
        y: 180,
        x: 250,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <video
        className={styles.video}
        src="https://sivjrtksrxzakjqj.public.blob.vercel-storage.com/video_1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className={styles.overlay}>
        {/* Top — mono label */}
        <p className={`${styles.monoLabel}`}>Digital Delivery Partner</p>

        {/* Mid-right — subtitle */}
        <div className={styles.subtitle}>
          <p className={styles.subtitleText}>
            We bring structured information management to the world&apos;s most
            complex infrastructure projects.
          </p>
          <p className={styles.subtitleStrong}>
            Every asset governed, every decision informed.
          </p>
        </div>

        {/* Bottom-left — headline */}
        <h1 className={styles.headline}>
          Human-Led,
          <br />
          Digitally Enabled.
        </h1>

        {/* Bottom-right — scroll indicator */}
        <div className={styles.scrollIndicator}>
          <svg
            width="14"
            height="24"
            viewBox="0 0 14 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 0v20m0 0l6-6m-6 6l-6-6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
