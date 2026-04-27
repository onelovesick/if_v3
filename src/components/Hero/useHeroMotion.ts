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

    let entranceTl: gsap.core.Timeline | null = null;

    const reduced = prefersReducedMotion();

    /* ── A. ENTRANCE ── */
    const inkOverlay = scene.querySelector("[data-ink-overlay]") as HTMLElement | null;

    if (reduced) {
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

      // 6. Editorial chrome (frame meta, crossfade mark, edge label, spine)
      // staggered from 1.4s
      const chromeTargets = [
        scene.querySelector("[data-frame-meta]"),
        scene.querySelector("[data-anim='crossfade']"),
        scene.querySelector("[data-edge-label]"),
        scene.querySelector("[data-spine]"),
      ].filter(Boolean) as Element[];

      entranceTl.from(
        chromeTargets,
        { opacity: 0, y: 8, duration: 0.4, stagger: 0.08 },
        1.4
      );
    }

    /* ── B. SCROLL CHOREOGRAPHY ── */
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];

    /* Subtle parallax — video drifts slightly slower than scroll */
    const layers: { sel: string; speed: number; scale?: number }[] = [
      { sel: "[data-depth='0']", speed: 0.15 },
      { sel: "[data-depth='1']", speed: 0.30 },
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

    /* Content drifts up + fades as user scrolls past */
    const content = scene.querySelector("[data-anim='content']");
    if (content) {
      const tween = gsap.to(content, {
        yPercent: -20,
        opacity: 0.2,
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
      triggers.forEach((t) => t.kill());
    };
  }, [sceneRef]);
}
