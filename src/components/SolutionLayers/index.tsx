"use client";

import { useRef } from "react";
import { useLayersMotion } from "./useLayersMotion";
import styles from "./SolutionLayers.module.css";

type Layer = {
  id: string;
  numeral: string;
  name: string;
  tagline: string;
  capabilities: string[];
  href: string;
  alt?: boolean;
};

const LAYERS: Layer[] = [
  {
    id: "information-strategy",
    numeral: "01",
    name: "Information Strategy & Governance",
    tagline:
      "The rules of the project before the first model is built. The information layer that the rest of delivery hangs from.",
    capabilities: [
      "BIM strategy",
      "EIR · Exchange Information Requirements",
      "BEP · BIM Execution Plan",
      "CDE setup",
      "LOD frameworks",
      "Naming conventions",
    ],
    href: "#information-strategy",
  },
  {
    id: "digital-delivery",
    numeral: "02",
    name: "Digital Delivery & Construction Control",
    tagline:
      "Modelling that survives contact with the site. Coordination, clash, and field control across pre-construction and build.",
    capabilities: [
      "Federated BIM modelling",
      "Clash detection",
      "Scan-to-BIM",
      "4D scheduling",
      "Field BIM",
      "Quality assurance",
    ],
    href: "#digital-delivery",
    alt: true,
  },
  {
    id: "asset-intelligence",
    numeral: "03",
    name: "Asset Intelligence & Digital Twin",
    tagline:
      "What the owner inherits on day one of operations. As-built verification, structured data, the foundations of a working twin.",
    capabilities: [
      "As-built verification",
      "COBie handover",
      "Operations dashboards",
      "Digital twin foundations",
      "Asset register",
    ],
    href: "#asset-intelligence",
  },
];

/**
 * S03 — Solution Layers, treated as a stratigraphic section drawing.
 * Three horizontal bands stacked vertically. The middle band carries
 * a slight tonal shift to make the geological metaphor literal.
 * A vertical hairline runs the full height with a rotated mono label.
 */
export default function SolutionLayers() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayersMotion(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="scope"
      className={styles.section}
      aria-labelledby="scope-heading"
    >
      <div className={styles.container}>
        {/* Vertical full-height hairline + rotated mono label */}
        <span data-anim="side-rule" className={styles.sideRule} aria-hidden="true" />
        <span className={styles.sideLabel} aria-hidden="true">
          Stratigraphy · 03 Layers · ISO 19650-2
        </span>

        {/* Section running header */}
        <div data-anim="section-head" className={styles.headerBar}>
          <span>
            <span id="scope-heading">S03 / 12</span>
            <span data-glyph />
            Scope
          </span>
          <span>03 Layers</span>
        </div>

        {/* Stratigraphic bands */}
        <div className={styles.bands}>
          {LAYERS.map((layer) => (
            <article
              key={layer.id}
              data-band
              className={`${styles.band} ${layer.alt ? styles.bandAlt : ""}`}
            >
              <span
                data-anim="band-rule"
                className={styles.bandRule}
                aria-hidden="true"
              />

              <div className={styles.bandGrid}>
                <p
                  data-anim="band-numeral"
                  className={styles.numeral}
                  aria-hidden="true"
                >
                  {layer.numeral}
                </p>

                <div className={styles.headingBlock}>
                  <h2 data-anim="band-heading" className={styles.heading}>
                    <a href={layer.href} className={styles.headingLink}>
                      {layer.name}
                    </a>
                  </h2>
                  <p data-anim="band-tagline" className={styles.tagline}>
                    {layer.tagline}
                  </p>
                </div>

                <div className={styles.capabilities}>
                  <div
                    data-anim="band-caps-head"
                    className={styles.capsHeader}
                  >
                    <span>Scope of Work</span>
                    <span>0{layer.capabilities.length}</span>
                  </div>
                  <ul className={styles.capsList}>
                    {layer.capabilities.map((cap, i) => (
                      <li key={cap} data-anim="band-cap">
                        <span>{cap}</span>
                        <span className={styles.capIndex}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Foot strip */}
        <div data-anim="foot-strip" className={styles.footStrip}>
          <span>Stratigraphy</span>
          <span>ISO 19650-2 aligned</span>
        </div>
      </div>
    </section>
  );
}
