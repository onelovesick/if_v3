"use client";

import { useEffect, useRef } from "react";
import styles from "./PortalTransition.module.css";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PortalTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = section.getBoundingClientRect();
      const totalTravel = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / totalTravel, 0, 1);

      section.style.setProperty("--portal-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Transition back into the live three-dimensional project world"
    >
      <div className={styles.stickyFrame}>
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.ring} aria-hidden="true" />

        <div className={styles.content}>
          <div>
            <span className={styles.label}>Portal Transition</span>
            <h2 className={styles.title}>
              Zoom through the opening and re-enter the live project field.
            </h2>
            <p className={styles.body}>
              The white-space review layer clears away, the aperture widens, and
              the active 3D delivery environment comes back into view as the page
              drops you into the next sequence.
            </p>
          </div>
        </div>

        <p className={styles.caption}>Scroll to move back into the live 3D world</p>
      </div>
    </section>
  );
}
