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
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );
    if (!sections.length) return;

    const hero = document.querySelector<HTMLElement>("#top");

    const computeMode = () => {
      const probe = 60;

      if (hero) {
        const r = hero.getBoundingClientRect();
        if (r.bottom > probe) {
          setMode("transparent");
          return;
        }
      }

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

      // Always show at the top of the page. Scrolling down hides the
      // nav by translating it off-screen; scrolling up brings it back.
      if (atTop) {
        setHidden(false);
      } else if (delta > 5) {
        setHidden(true);
      } else if (delta < -5) {
        setHidden(false);
      }

      lastYRef.current = y;
      computeMode();
    };

    computeMode();
    lastYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
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
      } ${hidden ? styles.hidden : ""}`}
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
