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

          {/* Film grain: unifies dark + footage as one image */}
          <div className={styles.grain} aria-hidden="true" />

          {/* Frame metadata — top-right */}
          <div className={styles.frameMeta} aria-hidden="true">
            <span className={styles.frameDot} />
            In session · 27.04.2026 · 16:42 UTC
          </div>

          {/* Architectural spine — connects text zone to the bridge */}
          <div className={styles.spine} aria-hidden="true">
            <span className={styles.spineNode} />
            <span className={styles.spineLine} />
            <span className={styles.spineLabel}>Project 04 · Cable-stayed · In progress</span>
          </div>

          {/* Hero content (left column) */}
          <div className={styles.contentWrap}>
            <HeroContent />
          </div>

          {/* Vertical edge label — refined editorial detail on the right */}
          <div className={styles.edgeLabel} aria-hidden="true">
            INFRAFORMA · 2026
          </div>
        </div>
      </section>
    </>
  );
}
