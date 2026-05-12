"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (!sections.length) return;

    const onScroll = () => {
      const probe = 60;
      let next: Mode = "transparent";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          const tone = s.getAttribute("data-tone");
          next = tone === "dark" ? "is-dark" : tone === "light" ? "is-light" : "transparent";
          break;
        }
      }
      setMode(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.nav} ${ready ? styles.visible : ""} ${
        mode === "is-light" ? styles.light : mode === "is-dark" ? styles.dark : ""
      }`}
    >
      <nav className={`${styles.links} ${styles.leftLinks}`} aria-label="What we do">
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

      <nav className={`${styles.links} ${styles.rightLinks}`} aria-label="Connect">
        {RIGHT_LINKS.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
