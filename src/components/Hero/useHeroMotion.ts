"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Drives the hero's two motion phases:
 *   A. Entrance sequence — fires once on mount, choreographed per STRUCTURE.md
 *   B. Scroll choreography — pinned 200vh, multi-speed parallax + content drift
 *
 * When prefers-reduced-motion is set everything resolves to its final state
 * immediately and no scroll trigger is created.
 */
export function useHeroMotion(sceneRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 980px)").matches;

    let entranceTl: gsap.core.Timeline | null = null;
    let flipTl: gsap.core.Timeline | null = null;

    const reduced = prefersReducedMotion();

    /* ── A. ENTRANCE ── */
    const inkOverlay = scene.querySelector("[data-ink-overlay]") as HTMLElement | null;

    if (reduced || isMobile) {
      // Snap content to settled state immediately, no animation.
      // Editorial chrome (frame meta / edge label / spine / crossfade) was
      // never animated away from its natural state in this branch (the
      // timeline below never runs), so it's already correct — no manual set
      // needed for those targets.
      gsap.set(scene.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });
      if (inkOverlay) {
        // Hide ink overlay so the settled mask is visible
        inkOverlay.style.display = "none";
      }
    } else {
      entranceTl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      });

      // 1. Ink overlay retracts right over 1.0s starting at 0.3s
      if (inkOverlay) {
        entranceTl.fromTo(
          inkOverlay,
          { xPercent: 0 },
          {
            xPercent: 100,
            duration: 1.0,
            onComplete: () => {
              inkOverlay.style.display = "none";
            },
          },
          0.3
        );
      }

      // 2. Eyebrow at 0.4s
      entranceTl.from(
        scene.querySelectorAll("[data-anim='eyebrow']"),
        { opacity: 0, y: 14, duration: 0.7 },
        0.4
      );

      // 3. Headline words stagger from 0.5s, 0.12s between siblings
      entranceTl.from(
        scene.querySelectorAll("[data-anim='word']"),
        { opacity: 0, y: 28, duration: 0.85, stagger: 0.12 },
        0.5
      );

      // 4. Sub paragraph at 1.05s
      entranceTl.from(
        scene.querySelectorAll("[data-anim='sub']"),
        { opacity: 0, y: 18, duration: 0.85 },
        1.05
      );

      // 5. CTA row at 1.2s
      entranceTl.from(
        scene.querySelectorAll("[data-anim='cta']"),
        { opacity: 0, y: 18, duration: 0.85 },
        1.2
      );

      // 6. Edge label fades in last
      const edgeLabel = scene.querySelector("[data-edge-label]");
      if (edgeLabel) {
        entranceTl.from(
          edgeLabel,
          { opacity: 0, y: 8, duration: 0.4 },
          1.4
        );
      }
    }

    /* ── B. SCROLL CHOREOGRAPHY ── */
    if (reduced || isMobile) return;

    const triggers: ScrollTrigger[] = [];

    /* Subtle parallax — video drifts slightly slower than scroll */
    // Layer 1 was removed in Task 1; mask now carries the parallax.
    const layers: { sel: string; speed: number; scale?: number }[] = [
      { sel: "[data-depth='0']", speed: 0.15 },
      { sel: "[data-mask]", speed: 0.30 },
    ];

    layers.forEach(({ sel, speed, scale }) => {
      const el = scene.querySelector(sel);
      if (!el) return;
      const tween = gsap.to(el, {
        yPercent: -10 * speed,
        scale: scale ?? 1,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
      const st = tween.scrollTrigger;
      if (st) triggers.push(st);
    });

    /* Content drifts up across the pin, then fades fully out during release */
    const content = scene.querySelector("[data-anim='content']");
    if (content) {
      const driftTween = gsap.to(content, {
        yPercent: -20,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "75% top",
          scrub: 0.4,
        },
      });
      if (driftTween.scrollTrigger) triggers.push(driftTween.scrollTrigger);

      const releaseTween = gsap.to(content, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "75% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      if (releaseTween.scrollTrigger) triggers.push(releaseTween.scrollTrigger);
    }

    /* Word disperse — each headline word scatters in its own direction
       as the user scrolls past, on top of the content drift. */
    const words = Array.from(
      scene.querySelectorAll("[data-anim='word']")
    ) as HTMLElement[];
    words.forEach((word, i) => {
      const dir = i % 3 === 0 ? -1 : i % 3 === 1 ? 0 : 1;
      const xOffset = dir * (60 + (i % 4) * 30);
      const yOffset = -20 - (i % 3) * 18;
      const rotate = dir * (2 + (i % 3) * 1.2);
      const tween = gsap.to(word, {
        x: xOffset,
        y: yOffset,
        rotate,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "20% top",
          end: "75% top",
          scrub: 0.6,
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    /* ── C. RELEASE — polarity flip last 25% of pin ── */
    const maskLight = scene.querySelector("[data-mask-light]");
    const mask = scene.querySelector("[data-mask]");
    if (maskLight && mask) {
      // Fade horizontal mask out, vertical light mask in
      flipTl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "75% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      flipTl.to(mask, { opacity: 0, ease: "none" }, 0);
      flipTl.to(maskLight, { opacity: 1, ease: "none" }, 0);
      if (flipTl.scrollTrigger) triggers.push(flipTl.scrollTrigger);
    }

    /* Pin the scene for 200vh */
    const pinTrigger = ScrollTrigger.create({
      trigger: scene,
      start: "top top",
      end: "+=100%",
      pin: scene.querySelector("[data-pin]") as Element,
      pinSpacing: true,
      anticipatePin: 1,
    });
    triggers.push(pinTrigger);

    return () => {
      entranceTl?.kill();
      flipTl?.kill();
      triggers.forEach((t) => t.kill());
    };
  }, [sceneRef]);
}
