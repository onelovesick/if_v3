"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Values.module.css";

/**
 * Values — dark closing section.
 *
 * Layout follows the reference: a 51/49 split carrying the page's
 * vertical line. Left holds the eyebrow, the square marker, and the
 * display headline; right is a three-item accordion (one value open
 * by default, plus/minus toggles, hairline rules between items). Each
 * open panel carries body copy, a "Learn more" CTA, and an image, as
 * in the reference.
 *
 * The headline fills word-by-word from muted to white on scroll, the
 * same effect as the Problem (dark band) statement above. Item
 * separators span the full right column so they meet the 51% vertical
 * divider on the left and reach the column edge on the right.
 *
 * Images are placeholders from existing project assets; there is no
 * value-specific photography yet and the brand rejects generic stock.
 */

interface Value {
  title: string;
  body: string;
  image: string;
  alt: string;
}

const VALUES: Value[] = [
  {
    title: "Neutrality",
    body: "We sit between owners, designers, contractors, and operators. We answer to the project, not to one side of the table.",
    image: "/solutions-1-1600.jpg",
    alt: "Coordination across an infrastructure program",
  },
  {
    title: "Lifecycle",
    body: "Information has to outlive the build. We structure it to carry from design through delivery and into decades of operation.",
    image: "/solutions-3-1600.jpg",
    alt: "Asset information across the project lifecycle",
  },
  {
    title: "Standards",
    body: "ISO 19650, a common data environment, a clear taxonomy. The structure is set before the work starts.",
    image: "/section2.jpg",
    alt: "A governed common data environment",
  },
];

const TITLE = "Principles that hold from the first model to final handover.";

export default function Values() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const { ready } = useMotionReady();

  const titleWords = useMemo(() => TITLE.split(/\s+/).filter(Boolean), []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const titleWordEls = root.querySelectorAll<HTMLElement>(
        `.${CSS.escape(styles.titleWord)}`,
      );

      if (reduce) {
        gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        titleWordEls.forEach((w) => w.classList.add(styles.titleWordFilled));
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

      // Headline fills word-by-word from muted to white as the user
      // scrolls past, mirroring the Problem (dark band) statement.
      const titleEl = root.querySelector(`.${CSS.escape(styles.headTitle)}`);
      if (titleEl && titleWordEls.length) {
        ScrollTrigger.create({
          trigger: titleEl,
          start: "top 85%",
          end: "top 48%",
          scrub: true,
          onUpdate: (self) => {
            const filled = Math.floor(
              self.progress * (titleWordEls.length + 3),
            );
            titleWordEls.forEach((w, i) => {
              if (i < filled) w.classList.add(styles.titleWordFilled);
              else w.classList.remove(styles.titleWordFilled);
            });
          },
        });
      }
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
          <h2 id="values-title" className={styles.headTitle}>
            {titleWords.map((word, i) => (
              <span key={i} className={styles.titleWord}>
                {word}
                {i < titleWords.length - 1 ? " " : ""}
              </span>
            ))}
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
                      <div className={styles.panelGrid}>
                        <div className={styles.panelText}>
                          <p className={styles.itemBody}>{v.body}</p>
                          <a className={styles.panelCta} href="#">
                            <span className={styles.panelCtaLabel}>
                              Learn more
                            </span>
                            <span
                              className={styles.panelCtaArrow}
                              aria-hidden="true"
                            >
                              <span className={styles.panelCtaArrowGlyph}>
                                &rarr;
                              </span>
                            </span>
                          </a>
                        </div>
                        <div className={styles.panelMedia}>
                          <img src={v.image} alt={v.alt} loading="lazy" />
                        </div>
                      </div>
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
