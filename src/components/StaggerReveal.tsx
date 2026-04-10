"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface StaggerRevealProps {
  children: React.ReactNode;
  stagger?: number;
  y?: number;
}

export default function StaggerReveal({
  children,
  stagger = 0.08,
  y = 20,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items?.length) return;

      gsap.from(items, {
        y,
        opacity: 0,
        duration: 0.8,
        stagger,
        ease: "power3.out",
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
