"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("[hero] mount — videoRef:", videoRef.current);
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");

    v.addEventListener("loadstart", () => console.log("[hero] loadstart"));
    v.addEventListener("loadeddata", () => console.log("[hero] loadeddata"));
    v.addEventListener("canplay", () => console.log("[hero] canplay"));
    v.addEventListener("playing", () => console.log("[hero] playing"));
    v.addEventListener("error", (e) => console.error("[hero] error", v.error, e));

    const tryPlay = async () => {
      try {
        await v.play();
        console.log("[hero] play() succeeded");
      } catch (err) {
        console.warn("[hero] autoplay blocked, waiting for interaction", err);
        const onInteract = () => {
          v.play().catch(() => {});
          window.removeEventListener("pointerdown", onInteract);
          window.removeEventListener("keydown", onInteract);
          window.removeEventListener("scroll", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
        window.addEventListener("pointerdown", onInteract, { once: true });
        window.addEventListener("keydown", onInteract, { once: true });
        window.addEventListener("scroll", onInteract, { once: true, passive: true });
        window.addEventListener("touchstart", onInteract, { once: true, passive: true });
      }
    };

    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener("loadeddata", tryPlay, { once: true });
    }
  }, []);

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

      gsap.to(`.${styles.siteGrid}`, {
        yPercent: -2,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.72,
        },
      });

      // Headline drifts down + toward center
      gsap.to(`.${styles.headlineWrap}`, {
        y: 100,
        x: 80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      // Body copy drifts down + toward center
      gsap.to(`.${styles.bodyWrap}`, {
        y: 120,
        x: -60,
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
        {/* Background video */}
        <div className={styles.imageField}>
          <video
            ref={videoRef}
            className={styles.image}
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 999,
              outline: "6px solid lime",
            }}
          />
        </div>

        {/* Gradient veils */}
        <div className={styles.imageVeil} />
        <div className={styles.atmosphere} />
        <div className={styles.siteGrid} />
      </div>

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.headlineWrap} data-copy-item>
            <p className={styles.eyebrow}>Digital Delivery Partner</p>
            <h1 className={styles.headline}>
              <span>Human-Led,</span>
              <span>Digitally Enabled.</span>
            </h1>
          </div>

          <div className={styles.bodyWrap} data-copy-item>
            <p className={styles.body}>
              Infraforma structures design, field, schedule, and commercial
              information so infrastructure teams can make clearer decisions,
              manage handoffs with less friction, and deliver major works with
              stronger control from intake to handover.
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
