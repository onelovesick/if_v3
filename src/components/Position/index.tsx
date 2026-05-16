"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import PositionDiagram, {
  type PartyKey,
  CENTER,
  RADIUS,
} from "./PositionDiagram";
import styles from "./Position.module.css";

export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();
  const [active, setActive] = useState<PartyKey | null>(null);
  const activeRef = useRef<PartyKey | null>(null);

  // Keep a live ref to active so the always-on packet loop can read it
  // without having to re-bind every time active changes.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const rim = root.querySelector(`.${CSS.escape(styles.dRim)}`);
    const ticks = root.querySelectorAll(`.${CSS.escape(styles.dTick)}`);
    const lines = root.querySelectorAll(`.${CSS.escape(styles.dLine)}`);
    const labels = root.querySelectorAll(`.${CSS.escape(styles.dLabelGroup)}`);
    const centre = root.querySelector(`.${CSS.escape(styles.dCentre)}`);
    const centreDot = root.querySelector(`.${CSS.escape(styles.dCentreDot)}`);
    const centreGlow = root.querySelector(`.${CSS.escape(styles.dCentreGlow)}`);
    const packets = Array.from(
      root.querySelectorAll<SVGCircleElement>(`.${CSS.escape(styles.dPacket)}`),
    );
    const ripples = Array.from(
      root.querySelectorAll<SVGCircleElement>(`.${CSS.escape(styles.dRipple)}`),
    );
    const satellite = root.querySelector<SVGCircleElement>(
      `.${CSS.escape(styles.dSatellite)}`,
    );
    const circumference = rim?.getAttribute("stroke-dasharray") ?? 0;

    const ctx = gsap.context(() => {
      if (reduce) {
        // No motion. Static state.
        return;
      }

      // ─── ENTRY TIMELINE ──────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "expo.out" },
      });

      tl.from(
        reveals,
        {
          opacity: 0,
          y: 18,
          duration: 1,
          stagger: 0.07,
          immediateRender: false,
        },
        0,
      );
      tl.fromTo(
        rim,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          immediateRender: false,
        },
        0.12,
      );
      tl.from(
        ticks,
        { opacity: 0, duration: 0.5, stagger: 0.01, immediateRender: false },
        0.44,
      );
      tl.fromTo(
        lines,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.82, stagger: 0.06 },
        0.62,
      );
      tl.from(
        labels,
        {
          opacity: 0,
          y: 6,
          duration: 0.65,
          stagger: 0.04,
          immediateRender: false,
        },
        0.72,
      );
      tl.from(
        centre,
        {
          opacity: 0,
          scale: 0.82,
          transformOrigin: "50% 50%",
          duration: 0.7,
          immediateRender: false,
        },
        0.98,
      );

      // ─── AMBIENT MOTION (always-on after entry) ──────────────────

      // 1. Data packets ride each converging line, rim → centre, on a
      //    perpetual loop. Speed reacts to the active party (the active
      //    line's packet speeds up + brightens; the rest dim/slow).
      packets.forEach((packet, i) => {
        const party = packet.getAttribute("data-party") as PartyKey;
        const sx = parseFloat(packet.getAttribute("data-start-x") ?? "0");
        const sy = parseFloat(packet.getAttribute("data-start-y") ?? "0");
        const state = { p: 0 };

        const tween = gsap.to(state, {
          p: 1,
          duration: 2.6,
          ease: "power2.in", // packet accelerates as it falls toward centre
          repeat: -1,
          repeatDelay: 0.7,
          delay: 1.6 + i * 0.4, // staggered start so packets don't sync
          onUpdate: () => {
            const a = activeRef.current;
            const isActive = a === party;
            const isDimmed = a !== null && a !== party;
            const t = state.p;
            const x = sx + (CENTER - sx) * t;
            const y = sy + (CENTER - sy) * t;
            packet.setAttribute("cx", x.toFixed(2));
            packet.setAttribute("cy", y.toFixed(2));
            const baseOp = 1 - t * 0.2;
            packet.setAttribute(
              "opacity",
              String(isDimmed ? baseOp * 0.32 : isActive ? 1 : baseOp),
            );
            packet.setAttribute("r", String(isActive ? 4.2 : 3));
          },
        });

        // Speed up the active packet, slow the rest. Re-applied whenever
        // active changes via the next effect.
        packet.dataset.tweenId = String(i);
        (packet as unknown as { __tween: gsap.core.Tween }).__tween = tween;
      });

      // 2. Centre ripples — pulse outward from centre, two of them
      //    offset so a fresh wave is always on the way.
      ripples.forEach((ripple, i) => {
        gsap.fromTo(
          ripple,
          { attr: { r: 12 }, opacity: 0.4 },
          {
            attr: { r: RADIUS - 6 },
            opacity: 0,
            duration: 4.4,
            ease: "power1.out",
            repeat: -1,
            delay: 2.2 + i * 2.2,
          },
        );
      });

      // 3. Centre dot — quiet breathing (vital sign).
      if (centreDot) {
        gsap.to(centreDot, {
          attr: { r: 3.4 },
          duration: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 4. Centre glow — slow opacity breath, offset from the dot.
      if (centreGlow) {
        gsap.fromTo(
          centreGlow,
          { opacity: 0.25 },
          {
            opacity: 0.55,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
        );
      }

      // 5. Satellite — small dot orbits the rim continuously.
      if (satellite) {
        const orbit = { angle: -90 };
        gsap.to(orbit, {
          angle: 270,
          duration: 16,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            const rad = (orbit.angle * Math.PI) / 180;
            satellite.setAttribute(
              "cx",
              (CENTER + Math.cos(rad) * RADIUS).toFixed(2),
            );
            satellite.setAttribute(
              "cy",
              (CENTER + Math.sin(rad) * RADIUS).toFixed(2),
            );
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // When active changes, accelerate the active packet's tween and slow
  // the others. Uses the tween reference cached on each packet element.
  useEffect(() => {
    if (!ready) return;
    const root = sectionRef.current;
    if (!root) return;
    const packets = root.querySelectorAll<SVGCircleElement>(
      `.${CSS.escape(styles.dPacket)}`,
    );
    packets.forEach((packet) => {
      const tween = (packet as unknown as { __tween?: gsap.core.Tween })
        .__tween;
      if (!tween) return;
      const party = packet.getAttribute("data-party");
      if (active === null) {
        tween.timeScale(1);
      } else if (active === party) {
        tween.timeScale(1.9);
      } else {
        tween.timeScale(0.55);
      }
    });
  }, [active, ready]);

  return (
    <section
      ref={sectionRef}
      id="position"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="position-title"
    >
      <div className={styles.plate}>
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
                can&rsquo;t afford to fail.
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
                  Explore <span aria-hidden="true">&rarr;</span>
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
                  How we work <span aria-hidden="true">&rarr;</span>
                </a>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
