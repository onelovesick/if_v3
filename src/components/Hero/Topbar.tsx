"use client";

import { useEffect, useState } from "react";
import styles from "./Topbar.module.css";

const NAV_ITEMS = [
  { label: "Practice", href: "#" },
  { label: "Work", href: "#" },
  { label: "Thinking", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.left}>
        <a href="/" className={styles.brand} aria-label="Infraforma — home">
          Infraforma
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <a href="#" className={styles.cta}>
        {/* TODO: link to /contact */}
        Get in touch
      </a>
    </header>
  );
}
