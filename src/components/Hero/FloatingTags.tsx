"use client";

import styles from "./FloatingTags.module.css";

const TAGS = [
  { id: "1", top: "22%", left: "56%", text: "PYLON 01 · LOD 400 · IFC4" },
  { id: "2", top: "42%", left: "70%", text: "DECK · 240M · POURED Q3" },
  { id: "3", top: "32%", left: "82%", text: "CRANE 02 · ACTIVE LIFT" },
];

export default function FloatingTags() {
  return (
    <div className={styles.tags} aria-hidden="true">
      {TAGS.map((t) => (
        <div
          key={t.id}
          data-tag={t.id}
          className={styles.tag}
          style={{ top: t.top, left: t.left }}
        >
          <span className={styles.dot} />
          <span className={styles.text}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
