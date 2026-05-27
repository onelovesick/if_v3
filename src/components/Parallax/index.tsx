"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Parallax.module.css";

/**
 * Parallax bridge section between Solutions and Layers.
 *
 * One viewport tall (100vh). Full-bleed photo with a subtle
 * parallax. One left-anchored title that spans the section
 * width, descends with scroll, and stops just short of the
 * section bottom so a margin of image is always visible below.
 *
 * The title resolves character-by-character from random scramble
 * to final text when the section enters the viewport, mirroring
 * the effect used on "Process" / "Company" in PositionBrief.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomScramble(text: string) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " " || ch === "\n") {
      out += ch;
    } else {
      out +=
        SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
  }
  return out;
}

function scrambleResolve(
  el: HTMLElement,
  finalText: string,
  duration: number,
) {
  const start = performance.now();
  const len = finalText.length;

  function step(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const resolved = Math.floor(t * (len + 4));
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = finalText[i];
      if (i < resolved || ch === " " || ch === "\n") {
        out += ch;
      } else {
        out +=
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = finalText;
    }
  }

  requestAnimationFrame(step);
}

export default function Parallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { ready } = useMotionReady();

  // Pre-scramble the title synchronously on mount, before first
  // paint, so by the time the section ever appears in view the
  // user sees random characters and never the final text.
  useIsoLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    if (!el.hasAttribute("data-final")) {
      el.setAttribute("data-final", el.textContent ?? "");
    }
    el.textContent = randomScramble(el.getAttribute("data-final") ?? "");
  }, []);

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Trigger the scramble resolve the moment the section first
    // intersects the viewport. Title is pre-scrambled by the
    // useIsoLayoutEffect above so the user sees random chars and
    // then watches them resolve left-to-right into the headline.
    let scrambleFired = false;
    const titleEl = titleRef.current;
    const scrambleObserver =
      titleEl && !reduce
        ? new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting || scrambleFired) return;
              scrambleFired = true;
              const final = titleEl.getAttribute("data-final") ?? "";
              scrambleResolve(titleEl, final, 1800);
              scrambleObserver?.disconnect();
            },
            { threshold: 0.05 },
          )
        : null;
    if (scrambleObserver) scrambleObserver.observe(section);

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Background parallax: subtle vertical drift behind the
      // title, scrubbed across the section's scroll range.
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Title descends with scroll: starts near the top of the
      // section, ends short of the bottom (leaving an image
      // margin below). Computed in JS so the end position
      // always respects the title's measured height.
      if (titleRef.current) {
        const computeDescent = () => {
          const sectionH = section.offsetHeight;
          const titleH = titleRef.current!.offsetHeight;
          // 12vh top padding + 12vh bottom padding, title fills
          // the rest of the descent travel.
          const padTop = sectionH * 0.12;
          const padBottom = sectionH * 0.12;
          return Math.max(0, sectionH - padTop - padBottom - titleH);
        };

        gsap.fromTo(
          titleRef.current,
          { y: 0 },
          {
            y: computeDescent,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // Descent completes in ~50vh of scroll (the first
              // half of the section's sticky window) so the title
              // sits at the bottom while the section finishes
              // exiting, instead of racing the section out.
              end: () => "+=" + window.innerHeight * 0.5,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      scrambleObserver?.disconnect();
      ctx.revert();
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="field"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="field-title"
    >
      <div className={styles.bgWrap} aria-hidden="true">
        <img
          ref={imgRef}
          src="/parallax-hero.jpg"
          alt=""
          className={styles.bg}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.stickyHost}>
        <h2 ref={titleRef} id="field-title" className={styles.title}>
          Where the model meets the ground.
        </h2>
      </div>
    </section>
  );
}
