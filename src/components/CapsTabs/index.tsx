"use client";

import { useState } from "react";
import styles from "./CapsTabs.module.css";

type Tab = {
  id: string;
  num: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
  link: { label: string; href: string };
  image: { src: string; alt: string };
};

const TABS: Tab[] = [
  {
    id: "t1",
    num: "01",
    label: "Coordination",
    title: "BIM coordination, industrialised.",
    body: "Federated models across every discipline, automated clash detection, and a routing engine that sends issues to the right team without anyone having to chase.",
    bullets: [
      "Federated multi-discipline models",
      "Automated clash routing",
      "Design Issue Reports, branded",
      "Property-Set discipline",
      "4D linkage to schedule",
      "Civil 3D + Revit + IFC",
    ],
    link: { label: "Coordination details", href: "#coordination" },
    image: {
      src: "https://images.pexels.com/photos/6032899/pexels-photo-6032899.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Bridge structure",
    },
  },
  {
    id: "t2",
    num: "02",
    label: "Data",
    title: "The data layer beneath the programme.",
    body: "A structured PDS taxonomy, governed Property-Set definitions, and an information-management spine that holds up under the load of a multi-billion-dollar programme.",
    bullets: [
      "PDS taxonomy templates",
      "Governed Property Sets",
      "ISO 19650 information model",
      "BS 1192-aligned naming",
      "Asset Information Requirements",
      "API access end-to-end",
    ],
    link: { label: "Data architecture", href: "#data" },
    image: {
      src: "https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Highway interchange",
    },
  },
  {
    id: "t3",
    num: "03",
    label: "Programme controls",
    title: "Schedule, cost, progress — in one frame.",
    body: "Every model element tied to a schedule activity, every activity tied to cost. Real-time progress dashboards from the same data that runs design.",
    bullets: [
      "4D schedule linkage",
      "5D cost integration",
      "Progress dashboards",
      "Earned-value tracking",
      "Risk register integration",
      "Owner-side reporting",
    ],
    link: { label: "Programme controls", href: "#controls" },
    image: {
      src: "https://images.pexels.com/photos/14066336/pexels-photo-14066336.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Construction site overview",
    },
  },
  {
    id: "t4",
    num: "04",
    label: "Handover",
    title: "Handover that doesn't lose anything.",
    body: "The asset information model the operator actually wanted, handed over clean, structured, validated, and ready to load into the CMMS on day one.",
    bullets: [
      "AIM handover packages",
      "COBie + custom schemas",
      "CMMS-ready exports",
      "Validated against AIR",
      "O&M document linking",
      "Long-term archive",
    ],
    link: { label: "Handover services", href: "#handover" },
    image: {
      src: "https://images.pexels.com/photos/10751048/pexels-photo-10751048.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Tunnel infrastructure",
    },
  },
  {
    id: "t5",
    num: "05",
    label: "Advisory",
    title: "Strategy for owners and contractors.",
    body: "BIM mandates, EIR drafting, BEP review, programme assurance — the senior-level guidance that keeps a digital delivery strategy from collapsing into PDF chaos.",
    bullets: [
      "BIM strategy & mandates",
      "EIR / BEP drafting",
      "Programme assurance",
      "Vendor selection",
      "Capability uplift",
      "Audit & benchmarking",
    ],
    link: { label: "Advisory services", href: "#advisory" },
    image: {
      src: "https://images.pexels.com/photos/35259449/pexels-photo-35259449.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Energy infrastructure",
    },
  },
];

export default function CapsTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section id="capabilities-detail" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>What we do</span>
          <h2 className={styles.title}>End-to-end expertise. Exceptional execution.</h2>
          <p className={styles.lead}>
            Five disciplines, one platform. Each engineered for the
            realities of mega-project delivery and each available
            standalone or as part of an integrated programme rollout.
          </p>
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === active}
              className={`${styles.tab} ${tab.id === active ? styles.tabActive : ""}`}
              onClick={() => setActive(tab.id)}
              type="button"
            >
              <span className={styles.tabNum}>{tab.num}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.photo}>
            <img src={current.image.src} alt={current.image.alt} loading="lazy" />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.panelTitle}>{current.title}</h3>
            <p className={styles.panelBody}>{current.body}</p>
            <ul className={styles.bullets}>
              {current.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <a href={current.link.href} className={styles.link}>
              {current.link.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
