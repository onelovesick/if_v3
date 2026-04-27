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

    const reduced = prefersReducedMotion();

    /* ── A. ENTRANCE ── */
    if (reduced) {
      // Snap everything to its visible state — no animation
      gsap.set(
        scene.querySelectorAll(
          "[data-anim]"
        ),
        { opacity: 1, y: 0, filter: "blur(0px)" }
      );
    } else {
      const tl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      });

      tl.from(scene.querySelector("[data-anim='eyebrow']"), {
        opacity: 0,
        y: 14,
        duration: 0.7,
      }, 0.2)
        .from(scene.querySelectorAll("[data-anim='word']"), {
          opacity: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.12,
        }, 0.4)
        .from(scene.querySelector("[data-anim='digital-overlay']"), {
          opacity: 0,
          duration: 1.6,
        }, 0.9)
        .from(scene.querySelector("[data-anim='sub']"), {
          opacity: 0,
          y: 18,
          duration: 0.85,
        }, 1.05)
        .from(scene.querySelector("[data-anim='cta']"), {
          opacity: 0,
          y: 18,
          duration: 0.85,
        }, 1.2);
    }

    /* ── B. SCROLL CHOREOGRAPHY ── */
    if (reduced) return;

    const triggers: ScrollTrigger[] = [];

    /* Multi-speed parallax for the depth layers */
    const layers: { sel: string; speed: number; scale?: number }[] = [
      { sel: "[data-depth='0']", speed: 0.10 },
      { sel: "[data-depth='1']", speed: 0.25 },
      { sel: "[data-depth='2']", speed: 0.50 },
      { sel: "[data-depth='3']", speed: 0.80, scale: 1.05 },
      { sel: "[data-depth='4']", speed: 1.00 },
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

    /* Bottom vignette deepens */
    const vignette = scene.querySelector("[data-anim='vignette']");
    if (vignette) {
      const tween = gsap.to(vignette, {
        opacity: 1,
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
      triggers.forEach((t) => t.kill());
    };
  }, [sceneRef]);
}
