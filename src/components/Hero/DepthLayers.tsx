"use client";

import { useEffect, useRef } from "react";
import styles from "./DepthLayers.module.css";

/**
 * Cinematic background. The real video carries the visual; a soft atmospheric
 * gradient sits over it for text legibility. No drawn overlays.
 */
export default function DepthLayers() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play().catch(() => {
      const onInteract = () => {
        v.play().catch(() => {});
        window.removeEventListener("pointerdown", onInteract);
        window.removeEventListener("scroll", onInteract);
        window.removeEventListener("keydown", onInteract);
      };
      window.addEventListener("pointerdown", onInteract, { once: true });
      window.addEventListener("scroll", onInteract, { once: true, passive: true });
      window.addEventListener("keydown", onInteract, { once: true });
    });
  }, []);

  return (
    <div data-depth="0" className={styles.layer0} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
