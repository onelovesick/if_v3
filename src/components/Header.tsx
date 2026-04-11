"use client";

import { useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
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
        <a href="/contact" className={styles.cta}>
          Work With Us
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
            <a key={link.href} href={link.href} className={styles.mobileLink}>
              {link.label}
            </a>
          ))}
          <a href="/contact" className={styles.mobileCta}>
            Work With Us
          </a>
        </div>
      )}
    </header>
  );
}
