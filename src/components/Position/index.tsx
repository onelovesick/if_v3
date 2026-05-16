"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import PositionDiagram, {
  type PartyKey,
  CENTER,
} from "./PositionDiagram";
import styles from "./Position.module.css";

export default function Position() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();
  const [active, setActive] = useState<PartyKey | null>(null);

  // Entry timeline only. The diagram draws itself on first scroll-into-view
  // and then sits still. Hover behaviour is handled in a separate effect.
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
    const circumference = rim?.getAttribute("stroke-dasharray") ?? 0;

    const ctx = gsap.context(() => {
      if (reduce) return;

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

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  // Hover behaviour. When a party is hovered:
  //   1. That line + label brighten (handled by CSS class swap).
  //   2. A single packet pulses from rim → centre on that line.
  //   3. The centre ring gives a small acknowledgement scale-up.
  // When the hover ends, the packet fades and the centre resets.
  useEffect(() => {
    if (!ready) return;
    const root = sectionRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const packets = Array.from(
      root.querySelectorAll<SVGCircleElement>(`.${CSS.escape(styles.dPacket)}`),
    );
    const centreRing = root.querySelector<SVGCircleElement>(
      `.${CSS.escape(styles.dCentreRing)}`,
    );

    // Reset all packets to invisible / at-rim each time hover changes.
    packets.forEach((packet) => {
      gsap.killTweensOf(packet);
      const sx = parseFloat(packet.getAttribute("data-start-x") ?? "0");
      const sy = parseFloat(packet.getAttribute("data-start-y") ?? "0");
      gsap.set(packet, {
        attr: { cx: sx, cy: sy },
        opacity: 0,
      });
    });

    if (!active) {
      // Calm centre back to baseline.
      if (centreRing) gsap.to(centreRing, { attr: { r: 10 }, duration: 0.4, ease: "power2.out" });
      return;
    }

    const target = packets.find(
      (p) => p.getAttribute("data-party") === active,
    );
    if (!target) return;

    const sx = parseFloat(target.getAttribute("data-start-x") ?? "0");
    const sy = parseFloat(target.getAttribute("data-start-y") ?? "0");

    // One bright packet glides rim → centre, brightening as it arrives,
    // then fades. Then a second packet follows so the line keeps a quiet
    // pulse going while the hover is held.
    const tl = gsap.timeline({ repeat: -1 });
    const state = { p: 0 };
    tl.to(state, {
      p: 1,
      duration: 1.1,
      ease: "power2.in",
      onStart: () => {
        gsap.set(target, { opacity: 0, attr: { cx: sx, cy: sy, r: 3 } });
      },
      onUpdate: () => {
        const t = state.p;
        target.setAttribute("cx", (sx + (CENTER - sx) * t).toFixed(2));
        target.setAttribute("cy", (sy + (CENTER - sy) * t).toFixed(2));
        // Fade in over the first 30%, hold, fade out near centre.
        const op = t < 0.3 ? t / 0.3 : t < 0.8 ? 1 : Math.max(0, 1 - (t - 0.8) / 0.2);
        target.setAttribute("opacity", op.toFixed(3));
      },
      onComplete: () => {
        state.p = 0;
      },
    });
    tl.to({}, { duration: 0.55 }); // brief gap before the next packet

    // Centre acknowledges the hover with a small ring scale-up.
    if (centreRing) {
      gsap.to(centreRing, {
        attr: { r: 13 },
        duration: 0.5,
        ease: "expo.out",
      });
    }

    return () => {
      tl.kill();
    };
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
