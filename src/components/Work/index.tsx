"use client";

import { useRef } from "react";
import { useWorkMotion } from "./useWorkMotion";
import styles from "./Work.module.css";

type Sector = {
  id: "bridges" | "tunnels" | "transit";
  numeral: string;
  title: string;
  punch: string;
  body: string;
  href: string;
  image: { src: string; alt: string };
  flipped?: boolean;
};

const SECTORS: Sector[] = [
  {
    id: "bridges",
    numeral: "01 / Sector",
    title: "Bridges",
    punch: "Long-span. Cable-stayed. Approach viaducts.",
    body: "Bridges across rivers, valleys, and rail corridors. The structures that carry the load no one wants to engineer twice.",
    href: "#bridges",
    image: {
      src: "/work-bridges.jpg",
      alt: "Long-span concrete viaduct under construction",
    },
  },
  {
    id: "tunnels",
    numeral: "02 / Sector",
    title: "Tunnels",
    punch: "Drilled. Mined. Cut-and-cover.",
    body: "Highway tubes, transit mains, utility crossings. Tunnels through the geology that pushes back.",
    href: "#tunnels",
    image: {
      src: "/work-tunnels.jpg",
      alt: "Concrete-lined tunnel interior",
    },
    flipped: true,
  },
  {
    id: "transit",
    numeral: "03 / Sector",
    title: "Transit",
    punch: "Lines. Stations. Guideways.",
    body: "Light rail, metro, regional rail. The transit infrastructure that defines a generation of city growth.",
    href: "#transit",
    image: {
      src: "/work-transit.jpg",
      alt: "Elevated transit guideway under construction",
    },
  },
];

const PLACEHOLDER_BY_ID: Record<Sector["id"], string> = {
  bridges: "placeholderBridges",
  tunnels: "placeholderTunnels",
  transit: "placeholderTransit",
};

/**
 * S02 — Work. Three horizontal bands, one per sector. Photography
 * dominates each band on one side; the content side carries a numeral,
 * an oversized title, a clipped three-word punch, a one-sentence body,
 * and a "View work" link with a hairline above. Bands alternate which
 * side the image sits on.
 */
export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  useWorkMotion(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-labelledby="work-heading"
    >
      <div data-anim="head" className={styles.headerBar}>
        <span>
          <span id="work-heading">S02 / 12</span>
          <span data-glyph />
          Work
        </span>
        <span>03 Sectors</span>
      </div>

      {SECTORS.map((sector) => (
        <article
          key={sector.id}
          data-band
          id={sector.id}
          className={`${styles.band} ${sector.flipped ? styles.flipped : ""}`}
        >
          <div data-anim="img" className={styles.imageWrap}>
            <div
              className={`${styles.placeholder} ${
                styles[PLACEHOLDER_BY_ID[sector.id]]
              }`}
              aria-hidden="true"
            />
            <img
              className={styles.image}
              src={sector.image.src}
              alt={sector.image.alt}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.imageCaption}>{sector.title}</span>
          </div>

          <div className={styles.content}>
            <span data-anim="numeral" className={styles.numeral}>
              {sector.numeral}
            </span>
            <h2 data-anim="title" className={styles.title}>
              {sector.title}
            </h2>
            <p data-anim="punch" className={styles.punch}>
              {sector.punch}
            </p>
            <p data-anim="body" className={styles.body}>
              {sector.body}
            </p>
            <a data-anim="link" href={sector.href} className={styles.link}>
              View work
              <span data-arrow aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
