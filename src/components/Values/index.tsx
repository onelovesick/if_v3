"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Values.module.css";

/**
 * Values — dark closing section.
 *
 * Layout follows the reference: a 51/49 split carrying the page's
 * vertical line. Left holds the eyebrow, the square marker, and the
 * display headline; right is a three-item accordion (one value open
 * by default, plus/minus toggles, hairline rules between items).
 * Background, divider, and type match the Problem dark band so the
 * dark tone and the 51% line read as continuous down the page.
 *
 * Text-only by intent: there is no value-specific photography yet and
 * the brand rejects generic stock, so the open panel carries copy
 * alone. An image / CTA slot can drop in once real assets land.
 */

interface Value {
  title: string;
  body: string;
}

const VALUES: Value[] = [
  {
    title: "Neutrality",
    body: "We sit between owners, designers, contractors, and operators. We answer to the project, not to one side of the table.",
  },
  {
    title: "Lifecycle",
    body: "Information has to outlive the build. We structure it to carry from design through delivery and into decades of operation.",
  },
  {
    title: "Standards",
    body: "ISO 19650, a common data environment, a clear taxonomy. The structure is set before the work starts.",
  },
];

export default function Values() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        return;
      }
      gsap.from(root.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="values"
      data-section
      data-tone="dark"
      className={styles.section}
      aria-labelledby="values-title"
    >
      <span className={styles.divider} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.leftHeader}>
            <span data-reveal className={styles.eyebrow}>
              Values
            </span>
            <span data-reveal className={styles.marker} aria-hidden="true" />
          </div>
          <h2 id="values-title" data-reveal className={styles.headTitle}>
            Principles that hold from the first model to final handover.
          </h2>
        </div>

        <div className={styles.right}>
          <ul className={styles.accordion}>
            {VALUES.map((v, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={v.title}
                  data-reveal
                  className={styles.item}
                  data-open={isOpen}
                >
                  <button
                    type="button"
                    className={styles.itemHead}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className={styles.itemTitle}>{v.title}</span>
                    <span className={styles.itemToggle} aria-hidden="true" />
                  </button>
                  <div className={styles.itemPanel}>
                    <div className={styles.itemPanelInner}>
                      <p className={styles.itemBody}>{v.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
