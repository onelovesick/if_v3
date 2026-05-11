"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MotionCtx = {
  ready: boolean;
  setReady: (v: boolean) => void;
};

const MotionContext = createContext<MotionCtx>({
  ready: false,
  setReady: () => {},
});

/**
 * Provides a global "ready" flag that the Loader flips to true when
 * its exit animation completes. Lenis smooth scroll is intentionally
 * delayed until then so the loader pin/lock stays clean.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [ready]);

  return (
    <MotionContext.Provider value={{ ready, setReady }}>
      {children}
    </MotionContext.Provider>
  );
}

export const useMotionReady = () => useContext(MotionContext);
