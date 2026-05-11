"use client";

import { useState } from "react";
import styles from "./HowWeWork.module.css";

const PHASES = ["01 / Brief", "02 / Concept", "03 / Design", "04 / Build", "05 / Commission", "06 / Operate"] as const;

type LayerKey = "info" | "exec" | "twin";

const LAYERS: Array<{
  key: LayerKey;
  name: string;
  start: number;
  end: number;
  ink?: boolean;
}> = [
  { key: "info", name: "Information mgmt.", start: 0, end: 6, ink: true },
  { key: "exec", name: "Execution intel.", start: 2, end: 5 },
  { key: "twin", name: "O&M Digital Twin", start: 4, end: 6 },
];

export default function HowWeWork() {
  const [hoverPhase, setHoverPhase] = useState<number | null>(null);
  const [hoverLayer, setHoverLayer] = useState<LayerKey | null>(null);

  const isLayerEngaged = (l: typeof LAYERS[number]) => {
    if (hoverPhase === null) return true;
    return hoverPhase >= l.start && hoverPhase < l.end;
  };

  const readout =
    hoverLayer
      ? LAYERS.find((l) => l.key === hoverLayer)?.name + " — engaged across " +
        (LAYERS.find((l) => l.key === hoverLayer)!.end -
          LAYERS.find((l) => l.key === hoverLayer)!.start) +
        " phases"
      : hoverPhase !== null
      ? PHASES[hoverPhase].split(" / ")[1] +
        " — " +
        LAYERS.filter((l) => hoverPhase >= l.start && hoverPhase < l.end).length +
        " layers engaged"
      : "Hover the phases or layers";

  return (
    <section id="howwework" data-section data-tone="light" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>
              <strong>S4</strong> · How we work
            </span>
            <h2>One thread, three layers, six phases.</h2>
          </div>
          <p>
            The practice doesn&rsquo;t engage at one phase and walk away.
            Information management runs end to end. Execution intelligence
            covers build. Digital twin starts before commissioning and
            stays for the asset&rsquo;s life.
          </p>
        </div>

        <div className={styles.lifecycle}>
          <div className={styles.lcHeader}>
            <span className={styles.lcTitle}>Lifecycle engagement</span>
            <span className={styles.lcMeta}>{readout}</span>
          </div>

          <div className={styles.phases}>
            {PHASES.map((p, i) => (
              <button
                type="button"
                key={p}
                className={`${styles.phase} ${hoverPhase === i ? styles.phaseActive : ""}`}
                onMouseEnter={() => setHoverPhase(i)}
                onMouseLeave={() => setHoverPhase((cur) => (cur === i ? null : cur))}
                onFocus={() => setHoverPhase(i)}
                onBlur={() => setHoverPhase((cur) => (cur === i ? null : cur))}
              >
                <span className={styles.phaseNum}>{p.split(" / ")[0]}</span>
                <span className={styles.phaseName}>{p.split(" / ")[1]}</span>
              </button>
            ))}
          </div>

          <div className={styles.layers}>
            {LAYERS.map((l) => {
              const engaged = isLayerEngaged(l);
              const dimmed = hoverLayer !== null && hoverLayer !== l.key;
              return (
                <div
                  key={l.key}
                  className={`${styles.lcLayer} ${
                    !engaged || dimmed ? styles.lcDimmed : ""
                  }`}
                  onMouseEnter={() => setHoverLayer(l.key)}
                  onMouseLeave={() => setHoverLayer(null)}
                >
                  <span className={styles.lcName}>{l.name}</span>
                  <div className={styles.bar}>
                    <span
                      className={`${styles.fill} ${l.ink ? styles.fillInk : ""}`}
                      style={{
                        left: `${(l.start / 6) * 100}%`,
                        width: `${((l.end - l.start) / 6) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
