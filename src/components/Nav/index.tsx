"use client";

import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

const LEFT = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Sectors", href: "#sectors" },
  { label: "Programme", href: "#programme" },
];
const RIGHT = [
  { label: "Partners", href: "#partners" },
  { label: "About", href: "#about" },
];

/**
 * Fixed top nav. Three-position layout: left links / centered brand /
 * right links + Contact CTA. While the hero is on-screen the nav is
 * transparent + light text; once scrolled past the hero it switches
 * to a paper-backed bar with ink text.
 */
export default function Nav() {
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
    const hero = document.querySelector("section[data-hero]");
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setIsHero(entry.isIntersecting && entry.intersectionRatio > 0.15);
      },
      { threshold: [0, 0.15, 0.5, 1] },
    );

    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <header className={`${styles.nav} ${isHero ? styles.isHero : ""}`}>
      <div className={styles.row}>
        <ul className={styles.left} aria-label="What we do">
          {LEFT.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#top" className={styles.brand} aria-label="Infraforma — home">
          Infraforma<span className={styles.dot} aria-hidden="true" />
        </a>

        <ul className={styles.right} aria-label="Connect">
          {RIGHT.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className={styles.cta}>
              Contact <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>

        <button className={styles.burger} aria-label="Menu" type="button">
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
