"use client";

import { useEffect, RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Scroll-driven reveal choreography for the SolutionLayers section.
 * Each band reveals when its top hairline crosses 78% of the viewport.
 * Hairline draws L→R, then numeral, heading, tagline, capabilities stagger.
 */
export function useLayersMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ease = "expo.out";

    if (prefersReducedMotion()) {
      // Render at final state, no motion.
      gsap.set(root.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
        scaleX: 1,
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];

    // Section header reveal
    const sectionHead = root.querySelector("[data-anim='section-head']");
    if (sectionHead) {
      const t = gsap.from(sectionHead, {
        opacity: 0,
        y: 8,
        duration: 0.65,
        ease,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Vertical full-height hairline draws top→bottom on enter
    const sideRule = root.querySelector("[data-anim='side-rule']");
    if (sideRule) {
      const t = gsap.from(sideRule, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.2,
        ease,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    // Each band: orchestrated reveal when it scrolls into view
    const bands = root.querySelectorAll<HTMLElement>("[data-band]");
    bands.forEach((band) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: band,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        defaults: { ease },
      });

      const topRule = band.querySelector("[data-anim='band-rule']");
      const numeral = band.querySelector("[data-anim='band-numeral']");
      const heading = band.querySelector("[data-anim='band-heading']");
      const tagline = band.querySelector("[data-anim='band-tagline']");
      const capsHead = band.querySelector("[data-anim='band-caps-head']");
      const caps = band.querySelectorAll("[data-anim='band-cap']");

      if (topRule) {
        tl.from(
          topRule,
          { scaleX: 0, transformOrigin: "left center", duration: 0.55 },
          0,
        );
      }
      if (numeral) {
        tl.from(numeral, { opacity: 0, y: 14, duration: 0.7 }, 0.12);
      }
      if (heading) {
        tl.from(heading, { opacity: 0, y: 18, duration: 0.85 }, 0.18);
      }
      if (tagline) {
        tl.from(tagline, { opacity: 0, y: 12, duration: 0.7 }, 0.32);
      }
      if (capsHead) {
        tl.from(capsHead, { opacity: 0, y: 8, duration: 0.5 }, 0.42);
      }
      if (caps.length) {
        tl.from(
          caps,
          { opacity: 0, y: 8, duration: 0.45, stagger: 0.06 },
          0.5,
        );
      }

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // Foot strip
    const footStrip = root.querySelector("[data-anim='foot-strip']");
    if (footStrip) {
      const t = gsap.from(footStrip, {
        opacity: 0,
        duration: 0.55,
        ease,
        scrollTrigger: {
          trigger: footStrip,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [rootRef]);
}
