"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import PositionDiagram, { type PartyKey } from "./PositionDiagram";
import styles from "./Position.module.css";

export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();
  const [active, setActive] = useState<PartyKey | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const svg = root.querySelector("svg");
    const rim = root.querySelector(`.${CSS.escape(styles.dRim)}`);
    const ticks = root.querySelectorAll(`.${CSS.escape(styles.dTick)}`);
    const lines = root.querySelectorAll(`.${CSS.escape(styles.dLine)}`);
    const labels = root.querySelectorAll(`.${CSS.escape(styles.dLabelGroup)}`);
    const centre = root.querySelector(`.${CSS.escape(styles.dCentre)}`);
    const drawTargets = [rim, ...Array.from(lines)].filter(Boolean);
    const visibleTargets = [
      ...Array.from(ticks),
      ...Array.from(labels),
      centre,
      svg,
    ].filter(Boolean);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(drawTargets, { strokeDashoffset: 0 });
        gsap.set(visibleTargets, { opacity: 1 });
        return;
      }

      gsap.set(reveals, { opacity: 0, y: 18 });
      gsap.set(ticks, { opacity: 0 });
      gsap.set(labels, { opacity: 0, y: 6 });
      gsap.set(centre, {
        opacity: 0,
        scale: 0.82,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "expo.out" },
      });

      tl.to(reveals, { opacity: 1, y: 0, duration: 1, stagger: 0.07 }, 0);
      tl.to(
        rim,
        { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
        0.12,
      );
      tl.to(ticks, { opacity: 1, duration: 0.5, stagger: 0.01 }, 0.44);
      tl.to(lines, { strokeDashoffset: 0, duration: 0.82, stagger: 0.06 }, 0.62);
      tl.to(labels, { opacity: 1, y: 0, duration: 0.65, stagger: 0.04 }, 0.72);
      tl.to(centre, { opacity: 1, scale: 1, duration: 0.7 }, 0.98);

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
      aria-labelledby="position-title"
    >
      <div className={styles.plate} data-reveal>
        <div className={styles.topbar}>
          <p className={styles.eyebrow}>
            <span>S2</span>
            <span>Position</span>
          </p>
          <p className={styles.geo}>45.5017 N / 73.5673 W</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.diagramPane}>
            <div className={styles.diagramWrap} data-reveal>
              <PositionDiagram active={active} onHoverParty={setActive} />
            </div>

            <p className={styles.xy} aria-label="Diagram coordinates">
              <span>X: 0512</span>
              <span>Y: 0760</span>
            </p>
          </div>

          <div className={styles.copyPane}>
            <div className={styles.statement} data-reveal>
              <h2 id="position-title" className={styles.title}>
                Independent information management for the projects the country
                can't afford to fail.
              </h2>
              <p className={styles.subhead}>
                Between every party.
                <br />
                Aligned with the asset.
              </p>
            </div>

            <div className={styles.cells}>
              <article className={styles.cell} data-reveal>
                <div className={styles.cellLabel}>
                  <span>Position</span>
                  <span className={styles.dot} aria-hidden="true" />
                </div>
                <p>
                  We sit between the parties on a delivery, not for any one of
                  them.
                </p>
                <a href="#layers" className={styles.link}>
                  Explore <span aria-hidden="true">-&gt;</span>
                </a>
              </article>

              <article className={styles.cell} data-reveal>
                <div className={styles.cellLabel}>
                  <span>Practice</span>
                  <span className={styles.dot} aria-hidden="true" />
                </div>
                <p>
                  We turn project data into usable intelligence from brief
                  through operations.
                </p>
                <a href="#howwework" className={styles.link}>
                  How we work <span aria-hidden="true">-&gt;</span>
                </a>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
