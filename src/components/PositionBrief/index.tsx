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
    body: "We define how information is organized, exchanged, reviewed, approved, and delivered. From CDE workflows to model data, document control, requirements, and asset information, we build the framework that keeps project information usable.",
    href: "#layers",
  },
  {
    label: "Outcome",
    body: "Infraforma gives project teams the structure needed to manage complexity, track obligations, support decisions, and carry clean information from execution into operations.",
    href: "#close",
  },
];

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
    const overlay = root.querySelector(`.${CSS.escape(styles.photoCurtain)}`);
    const coords = root.querySelectorAll(`.${CSS.escape(styles.coordItem)}`);
    const cornerMark = root.querySelector(`.${CSS.escape(styles.cornerMark)}`);
    const cells = root.querySelectorAll(`.${CSS.escape(styles.cell)}`);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(wordInners, { y: 0 });
        if (overlay) gsap.set(overlay, { yPercent: 100 });
        return;
      }

      // Curtain reveal: white overlay slides down to reveal the photo
      // beneath. Simultaneously the photo scales from 1.12 to 1.0.
      const photoTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      if (overlay) {
        photoTl.fromTo(
          overlay,
          { yPercent: 0 },
          { yPercent: 100, duration: 1.4, ease: "expo.inOut" },
          0,
        );
      }
      if (photo) {
        photoTl.fromTo(
          photo,
          { scale: 1.12 },
          { scale: 1.0, duration: 1.6, ease: "expo.out" },
          0,
        );
      }

      // Coords + corner mark fade in after the photo curtain has cleared.
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
          delay: 1.05,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Headline + subhead word-mask reveal.
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

      // Cards rise in stagger after the headline lands.
      gsap.from(cells, {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.1,
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
          <span className={styles.photoCurtain} aria-hidden="true" />
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
                <p>{b.body}</p>
                <a className={styles.cellCta} href={b.href}>
                  <span className={styles.cellCtaText} aria-hidden="true">
                    <span className={styles.cellCtaText1}>Learn more</span>
                    <span className={styles.cellCtaText2}>Learn more</span>
                  </span>
                  <span className="sr-only">
                    Learn more about {b.label.toLowerCase()}
                  </span>
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
