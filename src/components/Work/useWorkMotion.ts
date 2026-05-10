"use client";

import { useEffect, RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Per-band scroll choreography: image scale-in, text stagger fade-up.
 */
export function useWorkMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ease = "expo.out";
    const triggers: ScrollTrigger[] = [];

    // Section header reveal
    const head = root.querySelector("[data-anim='head']");
    if (head) {
      const t = gsap.from(head, {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Each band
    root.querySelectorAll<HTMLElement>("[data-band]").forEach((band) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: band,
          start: "top 76%",
          toggleActions: "play none none none",
        },
        defaults: { ease },
      });

      const img = band.querySelector("[data-anim='img']");
      const numeral = band.querySelector("[data-anim='numeral']");
      const title = band.querySelector("[data-anim='title']");
      const punch = band.querySelector("[data-anim='punch']");
      const body = band.querySelector("[data-anim='body']");
      const link = band.querySelector("[data-anim='link']");

      if (img) {
        tl.from(
          img,
          { scale: 1.08, opacity: 0, duration: 1.4, ease: "power3.out" },
          0,
        );
      }
      if (numeral) tl.from(numeral, { opacity: 0, y: 14, duration: 0.55 }, 0.2);
      if (title) tl.from(title, { opacity: 0, y: 28, duration: 0.95 }, 0.3);
      if (punch) tl.from(punch, { opacity: 0, y: 14, duration: 0.7 }, 0.5);
      if (body) tl.from(body, { opacity: 0, y: 14, duration: 0.7 }, 0.65);
      if (link) tl.from(link, { opacity: 0, y: 10, duration: 0.55 }, 0.85);

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [rootRef]);
}
