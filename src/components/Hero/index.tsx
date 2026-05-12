"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Hero.module.css";

const VIDEO_SRC = "/hero-loop.mp4";

const HEADLINE_LINES: ReadonlyArray<ReadonlyArray<{ word: string }>> = [
  [{ word: "The intelligence layer" }],
  [{ word: "behind infrastructure delivery." }],
];

type Row = { label: string; value: string; accent?: boolean };
type Callout = {
  id: string;
  rows: Row[];
  /** Position as CSS top/left/right/bottom percent strings. */
  pos: React.CSSProperties;
};

const CALLOUTS: Callout[] = [
  {
    id: "asset",
    pos: { top: "16%", left: "8%" },
    rows: [
      { label: "Asset ID", value: "BR-04 · PIER 12" },
      { label: "Federation Status", value: "Verified", accent: true },
      { label: "LOD", value: "400" },
      { label: "Last Coordinated", value: "02:14 EST" },
    ],
  },
  {
    id: "activity",
    pos: { top: "28%", right: "6%" },
    rows: [
      { label: "Activity ID", value: "A-1247.04" },
      { label: "4D Phase", value: "ERECTION · STAGE 3" },
      { label: "Progress vs Plan", value: "+2.4 d", accent: true },
      { label: "Clash Count", value: "0 active" },
    ],
  },
  {
    id: "coord",
    pos: { bottom: "16%", left: "10%" },
    rows: [
      { label: "Easting", value: "307,452.18 m" },
      { label: "Northing", value: "5,041,236.65 m" },
      { label: "Elevation", value: "18.62 m" },
      { label: "Datum", value: "NAD83 (CSRS)" },
      { label: "Tolerance", value: "±0.012 m", accent: true },
    ],
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.85;
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      const callouts = root.querySelectorAll<HTMLElement>("[data-callout]");

      if (reduce) {
        gsap.set(words, { opacity: 1, y: 0 });
        gsap.set(callouts, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (words.length) {
        tl.to(words, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.2);
      }
      if (callouts.length) {
        tl.to(
          callouts,
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
          0.6,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-section
      data-tone="dark"
      data-dark
      className={styles.hero}
      aria-label="Infraforma"
    >
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      {/* Floating instrument-readout callouts */}
      <div className={styles.callouts} aria-hidden="true">
        {CALLOUTS.map((c) => (
          <div
            key={c.id}
            data-callout
            className={styles.callout}
            style={c.pos}
          >
            {c.rows.map((row, i) => (
              <div key={i} className={styles.row}>
                <span className={styles.rowLabel}>{row.label}</span>
                <span
                  className={`${styles.rowValue} ${row.accent ? styles.rowAccent : ""}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <h1 className={styles.headline}>
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} className={styles.line}>
              <span>
                {line.map((tok, wi) => (
                  <span key={wi} data-word>
                    {tok.word}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
