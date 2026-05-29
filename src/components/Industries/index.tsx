"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Industries.module.css";

/**
 * Industries — light section after Parallax.
 *
 * 51/49 split that continues the page-wide vertical hairline.
 * Left column holds a 3x2 grid of tiles (5 industries + 1 small
 * summary cell). Right rail shows a shared photo + project-type
 * list that swap when a tile is hovered or focused. Default
 * active tile is 01.
 */

interface Industry {
  number: string;
  name: string;
  region: string;
  oneLine: string;
  scope: string[];
  image: string;
  alt: string;
}

const INDUSTRIES: Industry[] = [
  {
    number: "01",
    name: "Transportation",
    region: "QC · CA",
    oneLine: "Rail, transit, highways, airports, ports.",
    scope: ["Rail", "Transit", "Highways", "Airports", "Ports"],
    image: "/solutions-1-1600.jpg",
    alt: "Transportation infrastructure program",
  },
  {
    number: "02",
    name: "Energy",
    region: "QC · CA",
    oneLine: "Hydro, nuclear, transmission, renewables.",
    scope: ["Hydro", "Nuclear", "Transmission", "Wind & solar"],
    image: "/solutions-2-1600.jpg",
    alt: "Energy infrastructure program",
  },
  {
    number: "03",
    name: "Heavy Civil & Water",
    region: "QC · CA",
    oneLine: "Dams, flood works, water, earthworks.",
    scope: ["Dams", "Flood works", "Water / wastewater", "Earthworks"],
    image: "/solutions-3-1600.jpg",
    alt: "Heavy civil and water program",
  },
  {
    number: "04",
    name: "Buildings & Facilities",
    region: "QC · CA",
    oneLine: "Hospitals, campuses, civic, transit hubs.",
    scope: ["Hospitals", "Campuses", "Civic", "Transit hubs"],
    image: "/solutions-4-1600.jpg",
    alt: "Major building and facilities program",
  },
  {
    number: "05",
    name: "Industrial",
    region: "QC · CA",
    oneLine: "Mining, processing, manufacturing plants.",
    scope: ["Mining", "Processing", "Manufacturing plants"],
    image: "/parallax-hero.jpg",
    alt: "Industrial facility program",
  },
];

const HEADLINE_LINES = [
  "We work where the country's",
  "flagship programs get built.",
];

const pad = (n: number) =>
  String(Math.max(0, Math.round(n))).padStart(4, "0");

export default function Industries() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoHostRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const coordXRef = useRef<HTMLSpanElement>(null);
  const coordYRef = useRef<HTMLSpanElement>(null);
  const { ready } = useMotionReady();

  const [activeIdx, setActiveIdx] = useState(0);

  // Reveals + per-line headline sweep.
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const section = sectionRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(section.querySelectorAll("[data-reveal]"), {
          opacity: 1,
          y: 0,
        });
        gsap.set(
          section.querySelectorAll(`.${CSS.escape(styles.titleLineSweep)}`),
          { xPercent: 101 },
        );
        return;
      }

      gsap.from(section.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      const sweeps = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.titleLineSweep)}`,
      );
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
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      const tiles = section.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.tile)}`,
      );
      if (tiles.length) {
        gsap.from(tiles, {
          opacity: 0,
          y: 28,
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 62%",
            toggleActions: "play none none none",
          },
        });
      }

      const summary = section.querySelector<HTMLElement>(
        `.${CSS.escape(styles.tileSummary)}`,
      );
      if (summary) {
        gsap.from(summary, {
          opacity: 0,
          y: 28,
          duration: 0.95,
          ease: "expo.out",
          delay: 0.42,
          scrollTrigger: {
            trigger: section,
            start: "top 62%",
            toggleActions: "play none none none",
          },
        });
      }

      const rail = section.querySelector<HTMLElement>(
        `.${CSS.escape(styles.rail)}`,
      );
      if (rail) {
        gsap.from(rail, {
          opacity: 0,
          y: 24,
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Crosshair tracker — confined to the photo frame.
  useEffect(() => {
    const host = photoHostRef.current;
    const overlay = crossRef.current;
    const coordX = coordXRef.current;
    const coordY = coordYRef.current;
    if (!host || !overlay || !coordX || !coordY) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let rect = host.getBoundingClientRect();
    const refreshRect = () => {
      rect = host.getBoundingClientRect();
    };
    refreshRect();

    const setActive = (on: boolean) => {
      overlay.style.setProperty("--crossActive", on ? "1" : "0");
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.setProperty("--cx", `${x.toFixed(1)}px`);
      overlay.style.setProperty("--cy", `${y.toFixed(1)}px`);
      coordX.textContent = `X: ${pad(x)}`;
      coordY.textContent = `Y: ${pad(y)}`;
    };
    const onEnter = () => {
      refreshRect();
      setActive(true);
    };
    const onLeave = () => {
      setActive(false);
    };

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);

    return () => {
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
    };
  }, []);

  const active = INDUSTRIES[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="industries"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="industries-title"
    >
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.pin} aria-hidden="true" />

      <div className={styles.headerStage}>
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
          <p data-reveal className={styles.lead}>
            Five sectors, one operating system. The information layer
            that carries a program from brief to operations is the same
            across all of them.
          </p>
        </div>
        <div className={styles.headerRight}>
          <span data-reveal className={styles.counter}>
            n = 5 sectors
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.gridCol}>
          <div
            className={styles.grid}
            onMouseLeave={() => setActiveIdx(0)}
          >
            {INDUSTRIES.map((ind, i) => {
              const isActive = activeIdx === i;
              const dim = !isActive;
              return (
                <button
                  key={ind.number}
                  type="button"
                  className={[
                    styles.tile,
                    isActive ? styles.tileActive : "",
                    dim ? styles.tileDim : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  aria-pressed={isActive}
                  aria-label={`${ind.name}. ${ind.oneLine}`}
                >
                  <span className={styles.tileNumber}>{ind.number}</span>
                  <span className={styles.tileName}>{ind.name}</span>
                  <span className={styles.tileOneLine}>{ind.oneLine}</span>
                  <span aria-hidden="true" className={styles.tileArrow}>
                    &rarr;
                  </span>
                </button>
              );
            })}

            <div className={styles.tileSummary} aria-hidden="true">
              <span className={styles.tileSummaryLabel}>All five</span>
              <span className={styles.tileSummaryNote}>
                One operating system across owners, designers,
                contractors, and operators.
              </span>
              <span className={styles.tileSummaryMark} />
            </div>
          </div>
        </div>

        <div className={styles.rail}>
          <div className={styles.railHead} key={activeIdx}>
            <span className={styles.railIndex} aria-hidden="true">
              {active.number}
            </span>
            <span className={styles.railName}>{active.name}</span>
            <span className={styles.railRegion}>{active.region}</span>
          </div>

          <div ref={photoHostRef} className={styles.photoFrame}>
            {INDUSTRIES.map((ind, i) => (
              <img
                key={ind.number}
                src={ind.image}
                alt={ind.alt}
                className={[
                  styles.photo,
                  activeIdx === i ? styles.photoActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                loading="lazy"
              />
            ))}
            <div
              ref={crossRef}
              className={styles.crossOverlay}
              aria-hidden="true"
            >
              <span
                className={`${styles.crossLine} ${styles.crossLineV}`}
              />
              <span
                className={`${styles.crossLine} ${styles.crossLineH}`}
              />
              <span className={styles.crossPoint} />
              <span
                ref={coordXRef}
                className={`${styles.coordItem} ${styles.coordX}`}
              >
                X: 0000
              </span>
              <span
                ref={coordYRef}
                className={`${styles.coordItem} ${styles.coordY}`}
              >
                Y: 0000
              </span>
            </div>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Scope</span>
            <ul key={activeIdx} className={styles.detailList}>
              {active.scope.map((p, i) => (
                <li key={i} className={styles.detailItem}>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
