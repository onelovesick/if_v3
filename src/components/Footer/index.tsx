"use client";

import styles from "./Footer.module.css";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Capabilities", href: "#capabilities" },
      { label: "CDE", href: "#cde" },
      { label: "Programme controls", href: "#programme" },
      { label: "Handover", href: "#capabilities-detail" },
    ],
  },
  {
    heading: "Sectors",
    links: [
      { label: "Bridges", href: "#bridges" },
      { label: "Rail & transit", href: "#transit" },
      { label: "Tunnels", href: "#tunnels" },
      { label: "Water & dams", href: "#water" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Partners", href: "#partners" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#careers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className={styles.foot}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <a href="#top" className={styles.brand}>
              Infraforma<span className={styles.dot} aria-hidden="true" />
            </a>
            <p className={styles.brandText}>
              The digital delivery platform for major infrastructure
              programmes. From design coordination through asset handover.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading} className={styles.col}>
              <h4 className={styles.colHead}>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>Infraforma · 2026 · Quebec City</span>
          <span className={styles.spacer} />
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">hello@infraforma.com</a>
        </div>
      </div>
    </footer>
  );
}
