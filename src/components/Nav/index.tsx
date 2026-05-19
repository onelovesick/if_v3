"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Nav.module.css";

const PRIMARY_LINKS = [
  { label: "Practice", href: "#position" },
  { label: "Capabilities", href: "#layers" },
  { label: "Model", href: "#model" },
  { label: "Work", href: "#howwework" },
  { label: "Writing", href: "#close" },
];

const SECONDARY_LINKS = [
  { label: "About", href: "#practice" },
  { label: "Team", href: "#practice" },
  { label: "Press", href: "#close" },
  { label: "FAQs", href: "#close" },
];

type Mode = "transparent" | "is-light" | "is-dark";

export default function Nav() {
  const { ready } = useMotionReady();
  const [mode, setMode] = useState<Mode>("transparent");
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Detect which section the nav is currently over so its colours
  // contrast with the underlying tone. No more scroll-direction
  // hide: the bar persists across the whole page.
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

    computeMode();
    const onScroll = () => computeMode();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the panel is open.
  useEffect(() => {
    if (menuOpen) {
      document.documentElement.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // ESC closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`${styles.nav} ${ready ? styles.visible : ""} ${
          mode === "is-light"
            ? styles.light
            : mode === "is-dark"
              ? styles.dark
              : styles.transparent
        }`}
      >
        <a href="#top" className={styles.brand} aria-label="Infraforma — home">
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandName}>Infraforma</span>
        </a>

        <div className={styles.pills}>
          <button
            type="button"
            className={styles.pill}
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="nav-menu-panel"
          >
            <span>Menu</span>
            <span className={styles.pillIcon} aria-hidden="true">
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </span>
          </button>
          <a href="#contact" className={styles.pill}>
            <span>Contact</span>
            <span className={styles.pillIcon} aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </header>

      {/* Backdrop + side panel ─────────────────────────────────── */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <aside
        id="nav-menu-panel"
        className={`${styles.panel} ${menuOpen ? styles.panelOpen : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Site menu"
      >
        <div className={styles.panelHeader}>
          <a
            href="#top"
            className={styles.panelBrand}
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className={styles.brandMark} aria-hidden="true" />
            <span className={styles.brandName}>Infraforma</span>
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className={styles.closeMark}>&times;</span>
          </button>
        </div>

        <nav className={styles.panelLinks} aria-label="Primary">
          {PRIMARY_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              style={{ transitionDelay: `${0.08 + i * 0.04}s` }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.panelFooter}>
          <ul className={styles.panelSecondary}>
            {SECONDARY_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.panelMeta}>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={menuOpen ? 0 : -1}
            >
              LinkedIn
            </a>
            <span className={styles.panelLang}>
              <button type="button" disabled>
                FR
              </button>
              <span aria-hidden="true">|</span>
              <button type="button" aria-pressed="true">
                EN
              </button>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
