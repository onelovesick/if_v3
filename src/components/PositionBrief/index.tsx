"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./PositionBrief.module.css";

const HEADLINE =
  "Independent information management for the projects the country can’t afford to fail.";
const SUBHEAD_1 = "Between every party.";
const SUBHEAD_2 = "Aligned with the asset.";

const cards = [
  {
    label: "Position",
    body: "An independent layer between owners, designers, contractors and operators. We govern project information so it serves the asset, not any one party on the delivery.",
    href: "#layers",
  },
  {
    label: "Practice",
    body: "We turn brief, design, construction and operations into one continuous record. Every decision is traceable, every handover is verifiable, every model outlasts the team that produced it.",
    href: "#howwework",
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
    const curtain = root.querySelector(`.${CSS.escape(styles.photoCurtain)}`);
    const coords = root.querySelectorAll(`.${CSS.escape(styles.coordItem)}`);
    const cells = root.querySelectorAll(`.${CSS.escape(styles.cell)}`);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(wordInners, { y: 0 });
        if (curtain) gsap.set(curtain, { yPercent: 100 });
        return;
      }

      const photoTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      const crossImg = root.querySelector(
        `.${CSS.escape(styles.photoClip)}`,
      ) as HTMLElement | null;
      if (crossImg) {
        // Clip-path reveal: top-left 10% visible, expands outward
        photoTl.fromTo(
          crossImg,
          { clipPath: "inset(0 90% 90% 0)" },
          {
            clipPath: "inset(0 0% 0% 0)",
            duration: 1.6,
            ease: "expo.inOut",
          },
          0,
        );
      }
      if (photo) {
        photoTl.fromTo(
          photo,
          { scale: 1.12 },
          { scale: 1.0, duration: 1.8, ease: "expo.out" },
          0,
        );
      }
      if (curtain) gsap.set(curtain, { display: "none" });

      if (coords.length) {
        gsap.from(coords, {
          opacity: 0,
          y: 4,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.1,
          delay: 1.1,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

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

      gsap.from(cells, {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.12,
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
      <div className={styles.shell}>
        <div className={styles.grid}>
          {/* LEFT — image with clip-path reveal and coordinate overlay */}
          <div className={styles.photoCol}>
            <figure className={styles.photoPane}>
              <div className={styles.photoClip}>
                <img
                  className={styles.photoImg}
                  src="https://images.pexels.com/photos/6032899/pexels-photo-6032899.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  alt="Bridge structure under construction"
                  loading="lazy"
                />
              </div>
              <span className={styles.photoCurtain} aria-hidden="true" />

              <div className={styles.crossOverlay} aria-hidden="true">
                <span className={`${styles.crossLine} ${styles.crossLineRight}`} />
                <span className={`${styles.crossLine} ${styles.crossLineBottom}`} />
                <span className={`${styles.coordItem} ${styles.coordY}`}>Y: 1285</span>
                <span className={`${styles.coordItem} ${styles.coordX}`}>X: 1250</span>
                <span className={styles.crossPoint} />
              </div>
            </figure>
          </div>

          {/* RIGHT — headline / subhead bracket + 2 cards */}
          <div className={styles.contentCol}>
            <div className={styles.statement}>
              <h2 id="position-brief-title" className={styles.title}>
                {splitWords(HEADLINE)}
              </h2>
              <p className={styles.subhead}>
                {splitWords(SUBHEAD_1)}
                <br />
                {splitWords(SUBHEAD_2)}
              </p>
            </div>

            <div className={styles.rule} aria-hidden="true" />

            <div className={styles.cards}>
              {cards.map((c) => (
                <article key={c.label} className={styles.cell}>
                  <div className={styles.cellHead}>
                    <span>{c.label}</span>
                    <span className={styles.cellMark} aria-hidden="true" />
                  </div>

                  <p className={styles.cellBody}>{c.body}</p>

                  <a className={styles.cellCta} href={c.href}>
                    <span>Learn more</span>
                    <span aria-hidden="true" className={styles.cellArr}>
                      &rarr;
                    </span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
