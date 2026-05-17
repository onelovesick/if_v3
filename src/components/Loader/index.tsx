"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Loader.module.css";

/**
 * White splash loader: ghost "infraforma" watermark across the
 * viewport, the brand's open circle wrapping the wordmark, and a
 * left-to-right blue fill that resolves as the page becomes ready.
 * Locks body scroll while active; on exit, slides up and flips
 * MotionReady so Lenis + hero entry can fire.
 */
export default function Loader() {
  const { setReady } = useMotionReady();
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-loading");

    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fill = fillRef.current;

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
      if (fill) fill.style.setProperty("--fill", "0%");
      tl.set(root, { opacity: 1 });
      tl.to({}, { duration: 0.3 });
    } else {
      tl.to(root, { opacity: 1, duration: 0.5 }, 0)
        .to(root.querySelectorAll<HTMLElement>("[data-ghost]"), { opacity: 1, duration: 0.9 }, 0.1)
        .to(root.querySelectorAll<HTMLElement>("[data-stage]"), { opacity: 1, duration: 0.7 }, 0.25)
        .to(root.querySelectorAll<HTMLElement>("[data-caption]"), { opacity: 1, duration: 0.6 }, 0.55);

      if (fill) {
        const obj = { val: 100 };
        tl.to(
          obj,
          {
            val: 0,
            duration: 2.4,
            ease: "power2.inOut",
            onUpdate: () => {
              fill.style.setProperty("--fill", `${obj.val}%`);
            },
            onComplete: () => {
              fill.style.setProperty("--fill", "0%");
            },
          },
          0.55,
        );
      }

      // Hold a beat at full fill before exit
      tl.to({}, { duration: 0.35 });
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
      <div className={styles.ghost} aria-hidden="true">
        <span data-ghost className={styles.ghostWord}>infraforma</span>
      </div>

      <div data-stage className={styles.stage}>
        <div className={styles.circle}>
          <span className={styles.wordWrap}>
            <span className={styles.wordBase}>infraforma</span>
            <span
              ref={fillRef}
              className={styles.wordFill}
              style={{ "--fill": "100%" } as CSSProperties}
            >
              infraforma
            </span>
          </span>
        </div>
        <span data-caption className={styles.caption}>
          Est. Quebec · 2026
        </span>
      </div>
    </div>
  );
}
