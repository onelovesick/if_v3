"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Loader.module.css";

/**
 * Matter-style intro loader: top bar with brand + locale, centered
 * tagline, bottom bar with massive 0% → 100% counter. Locks body
 * scroll while active; on exit, slides up and flips MotionReady to
 * true so Lenis + hero entry can fire.
 */
export default function Loader() {
  const { setReady } = useMotionReady();
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loading");

    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = counterRef.current;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setExiting(true);
        setTimeout(() => {
          document.body.classList.remove("is-loading");
          setReady(true);
        }, 1050);
      },
    });

    if (reduce) {
      // Fast path: skip the staged loader, jump to "ready"
      if (counter) counter.textContent = "100";
      tl.to({}, { duration: 0.2 });
    } else {
      tl.to(root.querySelectorAll<HTMLElement>("[data-brand]"), { opacity: 1, duration: 0.6 }, 0.2)
        .to(root.querySelectorAll<HTMLElement>("[data-corner]"), { opacity: 1, duration: 0.6 }, 0.3)
        .to(root.querySelectorAll<HTMLElement>("[data-tagline]"), { opacity: 1, duration: 0.7 }, 0.5)
        .to(root.querySelectorAll<HTMLElement>("[data-counter]"), { opacity: 1, duration: 0.5 }, 0.5)
        .to(root.querySelectorAll<HTMLElement>("[data-meta]"), { opacity: 1, duration: 0.5 }, 0.6);

      if (counter) {
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: 100,
            duration: 2.6,
            ease: "power2.out",
            onUpdate: () => {
              counter.textContent = String(Math.floor(obj.val)).padStart(2, "0");
            },
            onComplete: () => {
              counter.textContent = "100";
            },
          },
          0.7,
        );
      }

      // Hold a beat before exit
      tl.to({}, { duration: 0.3 });
    }

    return () => {
      tl.kill();
    };
  }, [setReady]);

  return (
    <div
      ref={rootRef}
      className={`${styles.loader} ${exiting ? styles.exiting : ""}`}
      aria-hidden="true"
    >
      <div className={styles.top}>
        <span data-brand className={styles.brand}>
          <span className={styles.mark} /> Infraforma
        </span>
        <span data-corner className={styles.corner}>
          Est. Quebec · 2026
        </span>
      </div>

      <div className={styles.center}>
        <p data-tagline className={styles.tagline}>
          An information management practice for major infrastructure
          programs. We work between owners, designers, and contractors.
        </p>
      </div>

      <div className={styles.bottom}>
        <span data-meta className={styles.meta}>
          Loading practice
        </span>
        <span data-counter className={styles.counter}>
          <span ref={counterRef}>00</span>
          <span className={styles.pct}>%</span>
        </span>
        <span data-meta className={`${styles.meta} ${styles.right}`}>
          QC · MTL · OTT
        </span>
      </div>
    </div>
  );
}
