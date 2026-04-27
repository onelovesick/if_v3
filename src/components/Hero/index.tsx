"use client";

import { useRef } from "react";
import DepthLayers from "./DepthLayers";
import FloatingTags from "./FloatingTags";
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
          <FloatingTags />

          {/* Frame metadata — top-right */}
          <div className={styles.frameMeta} aria-hidden="true">
            <span className={styles.frameDot} />
            In session · 27.04.2026 · 16:42 UTC
          </div>

          {/* Coordinate stamps — bottom-left + bottom-right */}
          <div className={styles.coordsLeft} aria-hidden="true">
            <div>N 45°27&apos;12&quot;</div>
            <div>W 73°35&apos;45&quot;</div>
          </div>
          <div className={styles.coordsRight} aria-hidden="true">
            <div>240 M</div>
            <div>REV 04</div>
          </div>

          {/* Centered hero content */}
          <div className={styles.contentWrap}>
            <HeroContent />
          </div>
        </div>
      </section>
    </>
  );
}
