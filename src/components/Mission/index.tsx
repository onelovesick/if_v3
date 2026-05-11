"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./Mission.module.css";

const STRIP = [
  {
    src: "https://images.pexels.com/photos/14066336/pexels-photo-14066336.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Site overview",
    tag: "Bridges",
  },
  {
    src: "https://images.pexels.com/photos/10751048/pexels-photo-10751048.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Tunnel infrastructure",
    tag: "Transit",
  },
  {
    src: "https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Highway aerial",
    tag: "Highways",
  },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      const t = gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "expo.out",
        delay: i * 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="programme" className={styles.section}>
      <div className={styles.head}>
        <div data-reveal>
          <span className={styles.eyebrow}>Our approach</span>
          <h2 className={styles.title}>
            Built for the programmes the world can&rsquo;t fail.
          </h2>
        </div>
        <div data-reveal>
          <p className={styles.lead}>
            Infraforma is the digital delivery platform behind major
            infrastructure. We sit at the seam between design and
            construction, between owner and contractor, and we make that
            seam disappear.
          </p>
          <a href="#about" className={styles.link}>
            Read our approach <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className={styles.strip} data-reveal>
        {STRIP.map((cell, i) => (
          <div key={i} className={styles.cell}>
            <img src={cell.src} alt={cell.alt} loading="lazy" />
            <span className={styles.tag}>{cell.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
