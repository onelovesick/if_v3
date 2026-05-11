"use client";

import styles from "./Close.module.css";

export default function Close() {
  return (
    <section id="close" data-section data-tone="light" className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <strong>S6</strong> · Close
        </span>

        <h2 className={styles.headline}>
          Infrastructure,{" "}
          <em className={styles.accent}>thought&nbsp;through.</em>
        </h2>

        <div className={styles.ctas}>
          <a href="#contact" className={styles.primary} data-cta data-magnetic>
            <span>Begin a brief</span>
            <span className={styles.arr} aria-hidden="true">→</span>
          </a>
          <a href="#writing" className={styles.secondary}>
            Read the practice
          </a>
        </div>
      </div>

      <footer id="contact" className={styles.foot}>
        <div className={styles.footInner}>
          <div className={styles.footBrandCol}>
            <a href="#top" className={styles.footBrand}>
              <span className={styles.footMark} aria-hidden="true" />
              Infraforma
            </a>
            <p className={styles.footTagline}>
              An information management practice for major infrastructure
              programs.
            </p>
          </div>

          <div className={styles.footCol}>
            <h4>Practice</h4>
            <ul>
              <li><a href="#position">Position</a></li>
              <li><a href="#layers">Capabilities</a></li>
              <li><a href="#howwework">How we work</a></li>
              <li><a href="#practice">The practice</a></li>
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Locations</h4>
            <ul>
              <li>Quebec City</li>
              <li>Montreal</li>
              <li>Ottawa</li>
            </ul>
          </div>

          <div className={styles.footCol}>
            <h4>Standards</h4>
            <ul>
              <li>ISO 19650-1</li>
              <li>ISO 19650-2</li>
              <li>ISO 19650-3</li>
            </ul>
          </div>
        </div>

        <div className={styles.footBottom}>
          <span>© Infraforma · 2026</span>
          <span className={styles.footSpacer} />
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </footer>
    </section>
  );
}
