"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(`.${styles.headline}`, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
      })
        .from(
          `.${styles.descriptorClaim}`,
          { y: 16, opacity: 0, duration: 0.8 },
          "-=0.6"
        )
        .from(
          `.${styles.descriptorVision}`,
          { y: 12, opacity: 0, duration: 0.7 },
          "-=0.4"
        )
        .from(
          `.${styles.scrollIndicator}`,
          { opacity: 0, duration: 0.5 },
          "-=0.3"
        );

      gsap.to(`.${styles.headline}`, {
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

      gsap.to(`.${styles.descriptor}`, {
        y: 160,
        x: -280,
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

      <div className={styles.vignette} />

      <div className={styles.overlay}>
        <h1 className={styles.headline}>
          Human-Led,
          <br />
          Digitally Enabled.
        </h1>

        <div className={styles.descriptor}>
          <p className={styles.descriptorClaim}>
            The infrastructure industry loses $1.8 trillion a year to bad data.
          </p>
          <p className={styles.descriptorVision}>
            We exist to close that gap.
          </p>
        </div>

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
