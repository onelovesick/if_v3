"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Industries.module.css";

/**
 * Industries — light section after Parallax.
 *
 * Bento grid of five sectors: one large feature cell (01) beside a
 * 2x2 block of the other four. Each cell is a sector image that
 * reveals with the same diagonal clip-path "cube" unwind used in
 * PositionBrief (the section below the hero): clip-path
 * inset(0 100% 100% 0) -> inset(0), a 1.1 -> 1 scale, and a blue
 * point that tracks the unwinding corner. Sector numeral, name, and
 * scope sit over a legibility scrim; cells reveal staggered on scroll.
 */

interface Industry {
  number: string;
  name: string;
  region: string;
  scope: string[];
  image: string;
  alt: string;
  feature?: boolean;
}

const INDUSTRIES: Industry[] = [
  {
    number: "01",
    name: "Transportation",
    region: "QC · CA",
    scope: ["Rail", "Transit", "Highways", "Airports", "Ports"],
    image: "/solutions-1-1600.jpg",
    alt: "Transportation infrastructure program",
    feature: true,
  },
  {
    number: "02",
    name: "Energy",
    region: "QC · CA",
    scope: ["Hydro", "Nuclear", "Transmission", "Wind & solar"],
    image: "/solutions-2-1600.jpg",
    alt: "Energy infrastructure program",
  },
  {
    number: "03",
    name: "Heavy Civil & Water",
    region: "QC · CA",
    scope: ["Dams", "Flood works", "Water / wastewater", "Earthworks"],
    image: "/solutions-3-1600.jpg",
    alt: "Heavy civil and water program",
  },
  {
    number: "04",
    name: "Buildings & Facilities",
    region: "QC · CA",
    scope: ["Hospitals", "Campuses", "Civic", "Transit hubs"],
    image: "/solutions-4-1600.jpg",
    alt: "Major building and facilities program",
  },
  {
    number: "05",
    name: "Industrial",
    region: "QC · CA",
    scope: ["Mining", "Processing", "Manufacturing plants"],
    image: "/parallax-hero.jpg",
    alt: "Industrial facility program",
  },
];

const HEADLINE_LINES = [
  "We work where the country's",
  "flagship programs get built.",
];

export default function Industries() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>(
        `.${CSS.escape(styles.cell)}`,
      );
      const sweeps = root.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.titleLineSweep)}`,
      );

      // Reduced motion: everything resolves to its final, visible state.
      if (reduce) {
        cells.forEach((cell) => {
          const clip = cell.querySelector<HTMLElement>(
            `.${CSS.escape(styles.cellClip)}`,
          );
          const img = cell.querySelector<HTMLElement>(
            `.${CSS.escape(styles.cellImg)}`,
          );
          if (clip) clip.style.clipPath = "inset(0 0% 0% 0)";
          if (img) img.style.transform = "scale(1)";
        });
        gsap.set(sweeps, { xPercent: 101 });
        gsap.set(root.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // Header reveals.
      gsap.from(root.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      if (sweeps.length) {
        gsap.fromTo(
          sweeps,
          { xPercent: 0 },
          {
            xPercent: 101,
            duration: 1.1,
            ease: "power3.inOut",
            stagger: 0.16,
            scrollTrigger: {
              trigger: root,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Per-cell diagonal clip-path "cube" reveal, matching PositionBrief:
      // the image unwinds from top-left to bottom-right while a blue
      // point tracks the unwinding corner and the image settles from a
      // slight overscale.
      cells.forEach((cell, i) => {
        const clip = cell.querySelector<HTMLElement>(
          `.${CSS.escape(styles.cellClip)}`,
        );
        const img = cell.querySelector<HTMLElement>(
          `.${CSS.escape(styles.cellImg)}`,
        );
        const pt = cell.querySelector<HTMLElement>(
          `.${CSS.escape(styles.cellRevealPt)}`,
        );
        if (!clip || !img) return;

        gsap.set(clip, { clipPath: "inset(0 100% 100% 0)" });
        gsap.set(img, { scale: 1.1 });
        if (pt) gsap.set(pt, { opacity: 0, left: "0%", top: "0%" });

        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          duration: 1.15,
          ease: "power3.inOut",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: cell,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            const p = state.p;
            const inset = (100 * (1 - p)).toFixed(3);
            clip.style.clipPath = `inset(0 ${inset}% ${inset}% 0)`;
            img.style.transform = `scale(${(1.1 - 0.1 * p).toFixed(4)})`;
            if (pt) {
              const pos = (p * 100).toFixed(2);
              pt.style.left = `${pos}%`;
              pt.style.top = `${pos}%`;
              pt.style.opacity = p > 0.02 && p < 0.98 ? "1" : "0";
            }
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="industries"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="industries-title"
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span data-reveal className={styles.eyebrow}>
            Industries
          </span>
          <h2 id="industries-title" className={styles.title}>
            {HEADLINE_LINES.map((line, i) => (
              <span key={i} className={styles.titleLine}>
                <span className={styles.titleLineText}>{line}</span>
                <span
                  className={styles.titleLineSweep}
                  aria-hidden="true"
                />
              </span>
            ))}
          </h2>
        </div>
        <div className={styles.headerRight}>
          <p data-reveal className={styles.lead}>
            Five sectors, one operating system. The information layer
            that carries a program from brief to operations is the same
            across all of them.
          </p>
          <span data-reveal className={styles.counter}>
            n = 5 sectors
          </span>
        </div>
      </div>

      <div className={styles.bento}>
        {INDUSTRIES.map((ind) => (
          <article
            key={ind.number}
            className={[
              styles.cell,
              ind.feature ? styles.cellFeature : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.cellClip}>
              <img
                className={styles.cellImg}
                src={ind.image}
                alt={ind.alt}
                loading="lazy"
              />
            </div>
            <span className={styles.cellScrim} aria-hidden="true" />
            <span className={styles.cellRevealPt} aria-hidden="true" />

            <div className={styles.cellTop}>
              <span className={styles.cellNum}>{ind.number}</span>
              <span className={styles.cellRegion}>{ind.region}</span>
            </div>

            <div className={styles.cellFoot}>
              <h3 className={styles.cellName}>{ind.name}</h3>
              <ul className={styles.cellScope}>
                {ind.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
