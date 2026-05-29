"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Industries.module.css";

/**
 * Industries — "B+" full-width carousel, after the Parallax section.
 *
 * A light sheet rises over the dark parallax above it (negative top
 * margin + lift shadow), carrying an editorial intro (eyebrow +
 * headline left; lead + credential stats right) and a control bar
 * (swipe cue + prev/next + progress track) on the content grid, then
 * flows into an edge-to-edge horizontal scroll-snap carousel of the
 * five sectors. Wireframe sketch styling is dropped; this uses the
 * brand system (PP Neue Corp / PP Fraktion Mono, hard edges, blue
 * accent). Native horizontal scroll drives the progress bar; prev/next
 * nudge by one card.
 */

interface Industry {
  number: string;
  name: string;
  disc: string;
  desc: string;
  image: string;
  alt: string;
}

const INDUSTRIES: Industry[] = [
  {
    number: "01",
    name: "Transportation",
    disc: "Rail · Transit · Highways · Airports · Ports",
    desc: "Moving people and goods, from regional rail to international gateways.",
    image: "/solutions-1-1600.jpg",
    alt: "Transportation infrastructure program",
  },
  {
    number: "02",
    name: "Energy",
    disc: "Hydro · Nuclear · Transmission · Wind & solar",
    desc: "Generation and transmission that keep the grid reliable and cleaner.",
    image: "/solutions-2-1600.jpg",
    alt: "Energy infrastructure program",
  },
  {
    number: "03",
    name: "Heavy Civil & Water",
    disc: "Dams · Flood works · Water / wastewater · Earthworks",
    desc: "Foundational works that manage water and reshape the ground.",
    image: "/solutions-3-1600.jpg",
    alt: "Heavy civil and water program",
  },
  {
    number: "04",
    name: "Buildings & Facilities",
    disc: "Hospitals · Campuses · Civic · Transit hubs",
    desc: "Complex environments where people learn, heal, and gather.",
    image: "/solutions-4-1600.jpg",
    alt: "Major building and facilities program",
  },
  {
    number: "05",
    name: "Industrial",
    disc: "Mining · Processing · Manufacturing plants",
    desc: "Plants and processing built for uptime and throughput.",
    image: "/parallax-hero.jpg",
    alt: "Industrial facility program",
  },
];

// Only confirmed numbers. A projects count goes here once the client
// provides a real figure; do not invent one.
const STATS = [
  { no: "5", label: "Core sectors" },
  { no: "55", label: "Years of senior practice" },
];

const HEADLINE_LINES = [
  "We build across the systems",
  "that move, power & shelter",
  "modern life.",
];

export default function Industries() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const { ready } = useMotionReady();

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? track.scrollLeft / max : 0;
    bar.style.transform = `scaleX(${Math.max(0.05, pct).toFixed(4)})`;
  }, []);

  const nudge = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const card = track.querySelector<HTMLElement>(
      `.${CSS.escape(styles.card)}`,
    );
    const step = card ? card.offsetWidth + 20 : 400;
    track.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }, []);

  // Progress bar tracks horizontal scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateProgress();
    track.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      track.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  // Entrance reveals (gated on loader-ready, reduced-motion safe).
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const sweeps = root.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.titleLineSweep)}`,
      );
      const cards = root.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.card)}`,
      );

      if (reduce) {
        gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        gsap.set(sweeps, { xPercent: 101 });
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(root.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
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
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 28,
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: trackRef.current ?? root,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

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
      <div className={styles.sheet}>
        <div className={styles.intro}>
          <div className={styles.introLead}>
            <span data-reveal className={styles.eyebrow}>
              Industries · 01 / 05
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

          <div className={styles.introSupport}>
            <p data-reveal className={styles.lead}>
              From the rail lines and runways that connect regions to the
              plants that power them, our teams take on complex work in
              five core sectors, delivered to a single standard.
            </p>
            <div data-reveal className={styles.creds}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.cred}>
                  <span className={styles.credNo}>{s.no}</span>
                  <span className={styles.credLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bar}>
          <span data-reveal className={styles.swipeCue}>
            Swipe the sectors <span aria-hidden="true">&rarr;</span>
          </span>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Previous sectors"
              onClick={() => nudge(-1)}
            >
              &lsaquo;
            </button>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Next sectors"
              onClick={() => nudge(1)}
            >
              &rsaquo;
            </button>
            <div className={styles.progress}>
              <span ref={barRef} className={styles.progressBar} />
            </div>
          </div>
        </div>
      </div>

      <div ref={trackRef} className={styles.track}>
        {INDUSTRIES.map((ind) => (
          <article key={ind.number} className={styles.card}>
            <div className={styles.cardPhoto}>
              <img src={ind.image} alt={ind.alt} loading="lazy" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHead}>
                <span className={styles.cardNum}>{ind.number}</span>
                <h3 className={styles.cardName}>{ind.name}</h3>
              </div>
              <p className={styles.cardDisc}>{ind.disc}</p>
              <p className={styles.cardDesc}>{ind.desc}</p>
              <a className={styles.cardCta} href="#contact">
                <span>Explore</span>
                <span className={styles.cardArrow} aria-hidden="true">
                  &rarr;
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
