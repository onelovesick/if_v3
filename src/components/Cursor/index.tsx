"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

/**
 * Custom cursor. 6px dot default, 60px ring on hoverable targets,
 * 80px solid blue on CTAs. Optional label appears under cursor for
 * elements with [data-cursor]. Hidden on touch.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    setEnabled(true);
    document.body.classList.add("cursor-custom");

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;

    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (label) {
        label.style.transform = `translate(${x}px, ${y + 38}px) translate(-50%, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!activated) {
        setActivated(true);
        x = e.clientX;
        y = e.clientY;
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      const cta = t.closest("[data-cta]");
      const hoverEl = t.closest("a, button, [data-cursor]");
      const onDark = t.closest("[data-dark]");

      dot.classList.toggle(styles.isCta, !!cta);
      dot.classList.toggle(styles.isHover, !!hoverEl && !cta);
      dot.classList.toggle(styles.isDark, !!onDark);

      if (label) {
        const text = (hoverEl as HTMLElement | null)?.getAttribute("data-cursor");
        if (text) {
          label.textContent = text;
          label.classList.add(styles.labelVisible);
        } else {
          label.classList.remove(styles.labelVisible);
        }
      }
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [activated]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.cursor} ${activated ? styles.active : ""}`}
        aria-hidden="true"
      />
      <div ref={labelRef} className={styles.label} aria-hidden="true" />
    </>
  );
}
