"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Nav.module.css";

const LEFT_LINKS = [
  { label: "Practice", href: "#position" },
  { label: "Capabilities", href: "#layers" },
  { label: "Work", href: "#howwework" },
  { label: "Writing", href: "#close" },
];

const RIGHT_LINKS = [
  { label: "About", href: "#practice" },
  { label: "Team", href: "#practice" },
  { label: "Contact", href: "#contact" },
];

type Mode = "transparent" | "is-light" | "is-dark";

export default function Nav() {
  const { ready } = useMotionReady();
  const [mode, setMode] = useState<Mode>("transparent");
  const [collapsed, setCollapsed] = useState(false);
  const lastYRef = useRef(0);
  const stopTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );
    if (!sections.length) return;

    const hero = document.querySelector<HTMLElement>("#top");

    const computeMode = () => {
      const probe = 60;

      // While the hero is still on screen, stay transparent.
      if (hero) {
        const r = hero.getBoundingClientRect();
        if (r.bottom > probe) {
          setMode("transparent");
          return;
        }
      }

      // Past the hero, pick light/dark glass based on the current
      // section's tone.
      let next: Mode = "transparent";
      for (const s of sections) {
        if (s === hero) continue;
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          const tone = s.getAttribute("data-tone");
          next = tone === "dark" ? "is-dark" : "is-light";
          break;
        }
      }
      setMode(next);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      const atTop = y < 60;

      // Collapse on active downward scroll past the top of the page.
      // Expand on upward scroll or at the very top.
      if (atTop) {
        setCollapsed(false);
      } else if (delta > 3) {
        setCollapsed(true);
      } else if (delta < -3) {
        setCollapsed(false);
      }

      lastYRef.current = y;

      // Expand again after the scroll has stopped for ~320ms.
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = window.setTimeout(() => {
        setCollapsed(false);
      }, 320);

      computeMode();
    };

    computeMode();
    lastYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(stopTimerRef.current);
    };
  }, []);

  return (
    <header
      className={`${styles.nav} ${ready ? styles.visible : ""} ${
        mode === "is-light"
          ? styles.light
          : mode === "is-dark"
            ? styles.dark
            : ""
      } ${collapsed ? styles.collapsed : ""}`}
    >
      <nav
        className={`${styles.links} ${styles.leftLinks}`}
        aria-label="What we do"
      >
        {LEFT_LINKS.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      <a href="#top" className={styles.brand} aria-label="Infraforma — home">
        <span className={styles.brandMark} aria-hidden="true" />
        <span className={styles.brandName}>Infraforma</span>
      </a>

      <nav
        className={`${styles.links} ${styles.rightLinks}`}
        aria-label="Connect"
      >
        {RIGHT_LINKS.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
