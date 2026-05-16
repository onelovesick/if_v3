"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./PositionBrief.module.css";

const HEADLINE = "We connect the people, the data, and the decisions";
const SUBHEAD = "behind critical infrastructure projects.";

const blocks = [
  {
    label: "Approach",
    phrase: "Structure the project from the start",
    body: "We define how information is organized, exchanged, reviewed, approved, and delivered. From CDE workflows to model data, document control, requirements, and asset information, we build the framework that keeps project information usable.",
    href: "#layers",
  },
  {
    label: "Delivery",
    phrase: "Give teams a clearer view",
    body: "We connect the information sitting across design, construction, coordination, controls, and handover. The result is a clearer view of what is being developed, reviewed, delayed, approved, and delivered.",
    href: "#howwework",
  },
  {
    label: "Outcome",
    phrase: "Turn information into control",
    body: "Infraforma gives project teams the structure needed to manage complexity, track obligations, support decisions, and carry clean information from execution into operations.",
    href: "#close",
  },
];

/**
 * Render text as a sequence of word-masked spans suitable for a
 * stagger reveal. Each word sits inside a mask (overflow hidden) and
 * the inner span is translated 110% below; GSAP slides it back to 0.
 */
function splitWords(text: string) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className={styles.wordMask}>
        <span className={styles.wordInner}>{word}</span>
      </span>
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}

export default function PositionBrief() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wordInners = root.querySelectorAll(
      `.${CSS.escape(styles.wordInner)}`,
    );
    const photo = root.querySelector(`.${CSS.escape(styles.photoImg)}`);
    const coords = root.querySelectorAll(`.${CSS.escape(styles.coordItem)}`);
    const cornerMark = root.querySelector(`.${CSS.escape(styles.cornerMark)}`);
    const crossH = root.querySelector(`.${CSS.escape(styles.crossH)}`);
    const crossV = root.querySelector(`.${CSS.escape(styles.crossV)}`);
    const cells = root.querySelectorAll(`.${CSS.escape(styles.cell)}`);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(wordInners, { y: 0 });
        return;
      }

      // Photo scales in slightly from oversized.
      if (photo) {
        gsap.from(photo, {
          scale: 1.08,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Crosshair lines draw outward from centre.
      if (crossH) {
        gsap.from(crossH, {
          scaleX: 0,
          transformOrigin: "50% 50%",
          duration: 1.1,
          ease: "expo.out",
          delay: 0.35,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
      if (crossV) {
        gsap.from(crossV, {
          scaleY: 0,
          transformOrigin: "50% 50%",
          duration: 1.1,
          ease: "expo.out",
          delay: 0.45,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Coords + corner mark fade in after the photo settles.
      const overlayTargets = [
        ...Array.from(coords),
        cornerMark,
      ].filter(Boolean) as Element[];
      if (overlayTargets.length) {
        gsap.from(overlayTargets, {
          opacity: 0,
          y: 6,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.7,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Headline word-mask reveal.
      gsap.to(wordInners, {
        y: 0,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Cards rise in stagger after the headline is mostly through.
      gsap.from(cells, {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: root,
          start: "top 55%",
          toggleActions: "play none none none",
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="position"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="position-brief-title"
    >
      <div className={styles.grid}>
        <figure className={styles.photoPane}>
          <img
            className={styles.photoImg}
            src="https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Aerial view of a multi-level highway interchange"
            loading="lazy"
          />
          <span className={`${styles.crossLine} ${styles.crossH}`} aria-hidden="true" />
          <span className={`${styles.crossLine} ${styles.crossV}`} aria-hidden="true" />
          <p className={styles.coords}>
            <span className={styles.coordItem}>X: 1250</span>
            <span className={styles.coordItem}>Y: 1285</span>
          </p>
          <span className={styles.cornerMark} aria-hidden="true" />
        </figure>

        <div className={styles.contentPane}>
          <div className={styles.statement}>
            <h2 id="position-brief-title" className={styles.title}>
              {splitWords(HEADLINE)}
            </h2>
            <p className={styles.subhead}>{splitWords(SUBHEAD)}</p>
          </div>

          <div className={styles.cells}>
            {blocks.map((b) => (
              <article key={b.label} className={styles.cell}>
                <div className={styles.cellHead}>
                  <span>{b.label}</span>
                  <i aria-hidden="true" />
                </div>
                <h3 className={styles.cellPhrase}>{b.phrase}</h3>
                <p>{b.body}</p>
                <a className={styles.cellCta} href={b.href}>
                  <span className={styles.cellCtaText} aria-hidden="true">
                    <span className={styles.cellCtaText1}>Learn more</span>
                    <span className={styles.cellCtaText2}>Learn more</span>
                  </span>
                  <span className="sr-only">Learn more about {b.label.toLowerCase()}</span>
                  <span aria-hidden="true" className={styles.cellArr}>
                    &rarr;
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
