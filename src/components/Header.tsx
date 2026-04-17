"use client";

import { useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Capabilities", href: "#platform" },
  { label: "Approach", href: "#workflow" },
  { label: "Outcomes", href: "#outcomes" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a href="#top" className={styles.logo}>
        Infraforma
      </a>

      <div className={styles.navGroup}>
        <nav className={styles.navPill}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className={styles.cta}>
          Contact
        </a>
      </div>

      <button
        type="button"
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
      </button>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
