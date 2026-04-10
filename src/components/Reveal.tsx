"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}

export default function Reveal({ children, delay = 0, y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: "power3.out", // matches cubic-bezier(0.16, 1, 0.3, 1)
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
