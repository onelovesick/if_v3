"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Industries.module.css";

/**
 * Industries — Solutions-style header + scroll-driven horizontal carousel.
 *
 * Header mirrors Solutions: a 51/49 split with the page's 51% vertical
 * hairline. Left holds the big uppercase eyebrow + display headline;
 * the right zone (where Solutions has its cursor crosshair) instead
 * holds the lead paragraph + credential stats, with no mouse tracker.
 *
 * The carousel pins for a moderate distance and the five large cards
 * translate left as the user scrolls vertically, so the sectors pass
 * through one set at a time (GSAP pin + scrub, desktop only). On
 * tablet/mobile and under reduced motion it falls back to a native
 * horizontal scroll-snap row. The progress bar reflects either the
 * pin progress (desktop) or the native scrollLeft (mobile).
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

// Only confirmed numbers. Add a projects count once the client gives a
// real figure; do not invent one.
const STATS = [
  { no: "5", label: "Core sectors" },
  { no: "55", label: "Years of senior practice" },
];

export default function Industries() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const { ready } = useMotionReady();

  // Native-scroll progress (mobile / reduced motion, where the track
  // is a real scroll container). No-op on desktop where the track is
  // transform-driven and never scrolls.
  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    const pct = track.scrollLeft / max;
    bar.style.transform = `scaleX(${Math.max(0.05, pct).toFixed(4)})`;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateProgress, { passive: true });
    return () => track.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    const root = sectionRef.current;
    const pinEl = pinRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!root || !pinEl || !track || !ready) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const cards = root.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.card)}`,
      );

      if (reduce) {
        gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
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

      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: pinEl,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Desktop, motion allowed: pin the carousel and translate the
      // track horizontally as the user scrolls. Distance is just the
      // horizontal overflow, so it scrolls through the cards once and
      // releases (no eternal pin).
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () => Math.max(0, track.scrollWidth - pinEl.clientWidth);
          ScrollTrigger.create({
            trigger: pinEl,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              track.style.transform = `translate3d(${(
                -distance() * self.progress
              ).toFixed(2)}px,0,0)`;
              if (bar) {
                bar.style.transform = `scaleX(${Math.max(
                  0.05,
                  self.progress,
                ).toFixed(4)})`;
              }
            },
          });
          return () => {
            track.style.transform = "";
            if (bar) bar.style.transform = "scaleX(0.05)";
          };
        },
      );

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
      <div className={styles.headerStage}>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.pin} aria-hidden="true" />

        <div className={styles.headerLeft}>
          <span data-reveal className={styles.eyebrow}>
            Industries
          </span>
          <h2 id="industries-title" data-reveal className={styles.headTitle}>
            We build across the systems that move, power &amp; shelter
            modern life.
          </h2>
        </div>

        <div className={styles.headerRight}>
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

      <div ref={pinRef} className={styles.caroPin}>
        <div className={styles.bar}>
          <span data-reveal className={styles.swipeCue}>
            Scroll through the sectors <span aria-hidden="true">&rarr;</span>
          </span>
          <div className={styles.progress}>
            <span ref={barRef} className={styles.progressBar} />
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
      </div>
    </section>
  );
}
