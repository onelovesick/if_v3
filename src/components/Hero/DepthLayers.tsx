"use client";

import styles from "./DepthLayers.module.css";

/**
 * Six stacked depth layers, each parallaxing at a different speed.
 * The motion is wired in useHeroMotion via the [data-depth] attributes.
 */
export default function DepthLayers() {
  return (
    <>
      {/* ─── DEPTH 0 — Video / fallback still ─── */}
      <div data-depth="0" className={styles.layer0} aria-hidden="true">
        {/* SWAP THIS BLOCK FOR REAL VIDEO — see VIDEO.md
            Replace the .fallbackStill div below with:

            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/poster.jpg"
              className={styles.video}
            >
              <source src="/hero.webm" type="video/webm" />
              <source src="/hero.mp4" type="video/mp4" />
            </video>
        */}
        <div className={styles.fallbackStill}>
          <svg
            className={styles.fallbackSvg}
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="dusk-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0b14" />
                <stop offset="40%" stopColor="#1a1820" />
                <stop offset="78%" stopColor="#3a2c30" />
                <stop offset="100%" stopColor="#503a36" />
              </linearGradient>
              <radialGradient id="dusk-sun" cx="0.78" cy="0.62" r="0.38">
                <stop offset="0%" stopColor="rgba(255, 168, 88, 0.55)" />
                <stop offset="60%" stopColor="rgba(255, 130, 70, 0.08)" />
                <stop offset="100%" stopColor="rgba(255, 100, 60, 0)" />
              </radialGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#dusk-sky)" />
            <rect width="1920" height="1080" fill="url(#dusk-sun)" />
            {/* horizon glow band */}
            <rect
              x="0"
              y="660"
              width="1920"
              height="40"
              fill="rgba(255, 158, 90, 0.18)"
            />
          </svg>
        </div>
      </div>

      {/* ─── DEPTH 1 — Atmospheric haze + gradients ─── */}
      <div data-depth="1" className={styles.layer1} aria-hidden="true" />

      {/* ─── DEPTH 2 — Distant silhouettes (far cranes / city) ─── */}
      <div data-depth="2" className={styles.layer2} aria-hidden="true">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className={styles.svg}
        >
          {/* Distant city band, near horizon */}
          <g fill="rgba(8, 10, 14, 0.6)">
            <rect x="120" y="640" width="80" height="50" />
            <rect x="220" y="620" width="40" height="70" />
            <rect x="280" y="650" width="60" height="40" />
            <rect x="360" y="610" width="55" height="80" />
            <rect x="430" y="635" width="90" height="55" />
            <rect x="540" y="625" width="45" height="65" />
            <rect x="600" y="660" width="35" height="30" />
            <rect x="650" y="635" width="70" height="55" />
            <rect x="740" y="615" width="50" height="75" />
            <rect x="820" y="640" width="60" height="50" />
            <rect x="1500" y="630" width="60" height="60" />
            <rect x="1580" y="620" width="45" height="70" />
            <rect x="1640" y="640" width="80" height="50" />
            <rect x="1740" y="615" width="55" height="75" />
          </g>
          {/* Distant cranes */}
          <g
            stroke="rgba(8, 10, 14, 0.55)"
            strokeWidth="2"
            fill="none"
          >
            <line x1="180" y1="640" x2="180" y2="500" />
            <line x1="180" y1="510" x2="280" y2="510" />
            <line x1="180" y1="520" x2="160" y2="540" />
            <line x1="1620" y1="640" x2="1620" y2="490" />
            <line x1="1620" y1="500" x2="1730" y2="500" />
            <line x1="1620" y1="510" x2="1600" y2="535" />
          </g>
        </svg>
      </div>

      {/* ─── DEPTH 3 — Primary subject (bridge silhouette + main cranes) ─── */}
      <div data-depth="3" className={styles.layer3} aria-hidden="true">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className={styles.svg}
        >
          {/* Bridge deck */}
          <rect
            x="200"
            y="700"
            width="1520"
            height="14"
            fill="rgba(6, 7, 9, 0.92)"
          />
          {/* Bridge supports */}
          <rect x="200" y="714" width="14" height="200" fill="rgba(6, 7, 9, 0.9)" />
          <rect x="1706" y="714" width="14" height="200" fill="rgba(6, 7, 9, 0.9)" />
          {/* Twin pylons (cable-stayed) */}
          <g fill="rgba(6, 7, 9, 0.94)">
            <polygon points="700,200 720,200 730,704 690,704" />
            <polygon points="1200,200 1220,200 1230,704 1190,704" />
          </g>
          {/* Pylon caps */}
          <rect x="688" y="190" width="44" height="14" fill="rgba(6, 7, 9, 0.95)" />
          <rect x="1188" y="190" width="44" height="14" fill="rgba(6, 7, 9, 0.95)" />
          {/* Cable stays */}
          <g
            stroke="rgba(6, 7, 9, 0.7)"
            strokeWidth="1.4"
            fill="none"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`l-cable-${i}`}
                x1="710"
                y1="208"
                x2={350 + i * 42}
                y2="700"
              />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`r-cable-l-${i}`}
                x1="710"
                y1="208"
                x2={750 + i * 42}
                y2="700"
              />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`l-cable-r-${i}`}
                x1="1210"
                y1="208"
                x2={850 + i * 42}
                y2="700"
              />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`r-cable-r-${i}`}
                x1="1210"
                y1="208"
                x2={1250 + i * 42}
                y2="700"
              />
            ))}
          </g>
          {/* Foreground crane */}
          <g
            stroke="rgba(6, 7, 9, 0.95)"
            strokeWidth="3"
            fill="none"
          >
            <line x1="1430" y1="900" x2="1430" y2="220" />
            <line x1="1430" y1="240" x2="1700" y2="240" />
            <line x1="1430" y1="260" x2="1280" y2="320" />
            <line x1="1700" y1="240" x2="1700" y2="430" />
          </g>
        </svg>
      </div>

      {/* ─── DEPTH 4 — Digital tracking overlay (fades in late) ─── */}
      <div
        data-depth="4"
        data-anim="digital-overlay"
        className={styles.layer4}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className={styles.svg}
        >
          {/* HUD brackets on pylon tops */}
          <g
            stroke="var(--c-blue-bright)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.85"
          >
            <polyline points="666,182 666,170 696,170" />
            <polyline points="754,170 728,170 728,182" />
            <polyline points="666,212 666,224 696,224" />
            <polyline points="754,224 728,224 728,212" />
            <polyline points="1166,182 1166,170 1196,170" />
            <polyline points="1254,170 1228,170 1228,182" />
            <polyline points="1166,212 1166,224 1196,224" />
            <polyline points="1254,224 1228,224 1228,212" />
          </g>
          {/* Tracking nodes */}
          <g fill="var(--c-blue-bright)">
            <circle cx="710" cy="708" r="4" />
            <circle cx="1210" cy="708" r="4" />
            <circle cx="960" cy="708" r="4" />
            <circle cx="200" cy="708" r="3" />
            <circle cx="1720" cy="708" r="3" />
          </g>
          {/* Dashed connection lines along the deck */}
          <line
            x1="200"
            y1="708"
            x2="1720"
            y2="708"
            stroke="rgba(46, 124, 230, 0.45)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
          {/* Vertical reference rule from each pylon */}
          <line
            x1="710"
            y1="190"
            x2="710"
            y2="900"
            stroke="rgba(46, 124, 230, 0.18)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <line
            x1="1210"
            y1="190"
            x2="1210"
            y2="900"
            stroke="rgba(46, 124, 230, 0.18)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        </svg>
      </div>

      {/* ─── DEPTH 5 — Foreground particles + scan line ─── */}
      <div data-depth="5" className={styles.layer5} aria-hidden="true">
        <div className={styles.scanLine} />
        <div className={styles.particles} />
      </div>

      {/* ─── Bottom vignette (deepens on scroll) ─── */}
      <div
        data-anim="vignette"
        className={styles.bottomVignette}
        aria-hidden="true"
      />

      {/* ─── Section blend bleed (transparent → ink → white) ─── */}
      <div className={styles.blend} aria-hidden="true" />
    </>
  );
}
