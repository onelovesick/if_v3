"use client";

import styles from "./Sectors.module.css";

const SECTORS = [
  { num: "01 / 08", label: "Bridges", href: "#bridges" },
  { num: "02 / 08", label: "Rail & transit", href: "#transit" },
  { num: "03 / 08", label: "Highways", href: "#highways" },
  { num: "04 / 08", label: "Tunnels", href: "#tunnels" },
  { num: "05 / 08", label: "Water & dams", href: "#water" },
  { num: "06 / 08", label: "Power", href: "#power" },
  { num: "07 / 08", label: "Buildings", href: "#buildings" },
  { num: "08 / 08", label: "Marine", href: "#marine" },
];

export default function Sectors() {
  return (
    <section id="sectors" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.left}>
            <span className={styles.eyebrow}>Our sectors</span>
            <h2 className={styles.title}>No project too large. None too complex.</h2>
          </div>
          <div className={styles.right}>
            <p className={styles.lead}>
              From cable-stay bridges and bored tunnels to hydropower and
              high-voltage transmission, our platform is built for the
              programmes that have to be right the first time.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {SECTORS.map((s) => (
            <a key={s.label} href={s.href} className={styles.cell}>
              <span className={styles.num}>{s.num}</span>
              <span className={styles.arr} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 19L19 5M19 5H8M19 5V16" />
                </svg>
              </span>
              <span className={styles.label}>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
