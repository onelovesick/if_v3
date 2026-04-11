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
        delay: 0.4,
      }).from(
        `.${styles.scrollIndicator}`,
        { opacity: 0, duration: 0.6 },
        "-=0.4"
      );

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
        <h1 className={styles.headline}>
          Human-Led,
          <br />
          Digitally Enabled.
        </h1>

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
