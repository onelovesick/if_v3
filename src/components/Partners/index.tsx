"use client";

import styles from "./Partners.module.css";

const TRACKS = [
  {
    ix: "01 / Owners",
    title: "For asset owners and programme leads.",
    body: "Procurement, governance, and assurance services that bring digital delivery rigour to your programme — without disrupting it.",
    link: { label: "Owner programmes", href: "#owners" },
  },
  {
    ix: "02 / Contractors",
    title: "For GCs, EPCs, and joint ventures.",
    body: "Embedded BIM and information-management teams that integrate into your delivery model and ship to the owner's spec.",
    link: { label: "Contractor support", href: "#contractors" },
  },
  {
    ix: "03 / Designers",
    title: "For engineering and design firms.",
    body: "Federated coordination, CDE operations, and the property-set discipline that turns a model package into a delivery asset.",
    link: { label: "Designer services", href: "#designers" },
  },
];

export default function Partners() {
  return (
    <section id="partners" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Who we work with</span>
          <h2 className={styles.title}>
            One platform. Every seat at the table.
          </h2>
        </div>

        <div className={styles.grid}>
          {TRACKS.map((t) => (
            <article key={t.ix} className={styles.track}>
              <span className={styles.ix}>{t.ix}</span>
              <h3 className={styles.trackTitle}>{t.title}</h3>
              <p className={styles.trackBody}>{t.body}</p>
              <a href={t.link.href} className={styles.more}>
                {t.link.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
