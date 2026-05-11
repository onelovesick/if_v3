"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Layers.module.css";

const LAYERS = [
  {
    num: "I",
    tag: "Layer 01 / Foundation",
    title: "Information Management.",
    desc: "The information layer that the rest of delivery hangs from. ISO 19650 alignment, structured taxonomies, CDE governance, naming, and audit. Set up before the first model is built and held to standard across every party.",
    list: [
      "ISO 19650 alignment",
      "Information requirements",
      "CDE setup & operation",
      "Naming conventions",
      "LOD frameworks",
      "Information governance",
    ],
  },
  {
    num: "II",
    tag: "Layer 02 / Build phase",
    title: "Execution Intelligence.",
    desc: "Modelling that survives contact with the site. Scan-to-BIM verification, 4D scheduling, progress capture, and field BIM. The intelligence layer that keeps construction honest against the model.",
    list: [
      "Federated coordination",
      "Scan-to-BIM verification",
      "4D scheduling",
      "Progress capture",
      "Field BIM",
      "Quality records",
    ],
  },
  {
    num: "III",
    tag: "Layer 03 / Asset life",
    title: "O&M Digital Twin.",
    desc: "What the owner inherits on day one of operations. COBie handover, structured AIM, twin foundations, and the dashboards that turn a model into something the operator actually runs.",
    list: [
      "AIM handover",
      "COBie structures",
      "Twin foundations",
      "Operations dashboards",
      "Sensor integration",
      "Long-term archive",
    ],
  },
];

export default function Layers() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const stage = root.querySelector(`.${CSS.escape(styles.stage)}`) as HTMLElement | null;
      const wash = root.querySelector(`.${CSS.escape(styles.wash)}`) as HTMLElement | null;
      const fill = root.querySelector(`.${CSS.escape(styles.spineFill)}`) as HTMLElement | null;
      if (!stage) return;

      if (reduce) {
        if (wash) wash.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
        if (fill) fill.style.height = "100%";
        setActive(2);
        return;
      }

      // Diagonal wash sweeps in as the section enters
      if (wash) {
        gsap.to(wash, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "top 5%",
            scrub: 0.6,
          },
        });
      }

      // Spine fill
      if (fill) {
        gsap.to(fill, {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      }

      // Pin + active layer index via progress
      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=" + LAYERS.length * 100 + "%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(LAYERS.length - 1, Math.floor(self.progress * LAYERS.length));
          setActive(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="layers"
      data-section
      data-tone="dark"
      data-dark
      className={styles.section}
    >
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.pin}>
        <div className={styles.intro}>
          <span className={`${styles.eyebrow} ${styles.eyebrowDark}`}>
            <strong>S3</strong> · Capabilities
          </span>
          <h2>
            Three layers of <em>practice</em>, one continuous thread.
          </h2>
          <p>
            The practice is organised in three layers — one per phase of an
            asset&rsquo;s information life. We move with the project from
            governance through operations.
          </p>
        </div>

        <div className={styles.stage}>
          <div className={styles.spine}>
            <div className={styles.spineFill} />
          </div>

          <div className={styles.progress}>
            {LAYERS.map((l, i) => (
              <span
                key={l.num}
                className={`${styles.tick} ${i === active ? styles.tickActive : ""}`}
              >
                {l.tag}
              </span>
            ))}
          </div>

          {LAYERS.map((l, i) => (
            <article
              key={l.num}
              className={`${styles.layer} ${i === active ? styles.layerVisible : ""}`}
            >
              <span className={styles.num} aria-hidden="true">
                {l.num}
              </span>
              <div className={styles.content}>
                <span className={styles.tag}>{l.tag}</span>
                <h3>{l.title}</h3>
                <p className={styles.desc}>{l.desc}</p>
                <ul className={styles.list}>
                  {l.list.map((item) => (
                    <li key={item} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
