"use client";

import { useRef } from "react";
import DepthLayers from "./DepthLayers";
import HeroContent from "./HeroContent";
import Topbar from "./Topbar";
import { useHeroMotion } from "./useHeroMotion";
import styles from "./Hero.module.css";

/**
 * Cinematic hero — 200vh tall scroll scene, pinned for one viewport.
 * The scene is a stack of six depth layers behind the content, with a
 * digital tracking overlay that calibrates onto the physical bridge.
 */
export default function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  useHeroMotion(sceneRef);

  return (
    <>
      <Topbar />

      <section
        ref={sceneRef}
        className={styles.scene}
        aria-label="Infraforma hero"
      >
        <div data-pin className={styles.pin}>
          <DepthLayers />

          {/* Dual-exposure mask: ink-left to clear-right */}
          <div data-mask className={styles.mask} aria-hidden="true" />

          {/* Phase C: vertical light gradient that cross-fades in at end of pin */}
          <div data-mask-light className={styles.maskLight} aria-hidden="true" />

          {/* Film grain: unifies dark + footage as one image */}
          <div className={styles.grain} aria-hidden="true" />

          {/* Ink overlay: covers viewport on mount, translates right to reveal mask */}
          <div data-ink-overlay className={styles.inkOverlay} aria-hidden="true" />

          {/* Hero content (left column) */}
          <div className={styles.contentWrap}>
            <HeroContent />
          </div>

          {/* Vertical edge label — refined editorial detail on the right */}
          <div data-edge-label className={styles.edgeLabel} aria-hidden="true">
            INFRAFORMA · 2026
          </div>
        </div>
      </section>
    </>
  );
}
