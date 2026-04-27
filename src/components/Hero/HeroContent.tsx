"use client";

import styles from "./HeroContent.module.css";

/**
 * The text content of the hero. Positioning copy is locked verbatim — see BRAND.md.
 * Words "digital" and "delivery" carry the brand blue.
 */
export default function HeroContent() {
  return (
    <div data-anim="content" className={styles.content}>
      <p data-anim="eyebrow" className={styles.eyebrow}>
        <span className={styles.eyebrowDot} aria-hidden="true" />
        Construction · digital delivery · pre-con through handover
      </p>

      <h1 className={styles.headline}>
        <span data-anim="word">A</span>{" "}
        <span data-anim="word">specialised</span>{" "}
        <span data-anim="word">construction</span>{" "}
        <br />
        <span data-anim="word" className={styles.blue}>
          digital
        </span>{" "}
        <span data-anim="word" className={styles.blue}>
          delivery
        </span>{" "}
        <span data-anim="word">partner.</span>
      </h1>

      <p data-anim="sub" className={styles.sub}>
        We embed into construction projects, pre-construction through handover,
        and deliver the digital asset supporting the physical one.
      </p>

      <div data-anim="cta" className={styles.ctaRow}>
        {/* TODO: link to /practice */}
        <a href="#" className={styles.ctaPrimary}>
          Read the practice
          <span aria-hidden="true" className={styles.arrow}>
            →
          </span>
        </a>
        {/* TODO: link to /work */}
        <a href="#" className={styles.ctaGhost}>
          View work
        </a>
      </div>
    </div>
  );
}
