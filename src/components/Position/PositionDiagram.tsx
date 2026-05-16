"use client";

import { forwardRef } from "react";
import styles from "./Position.module.css";

const VIEWBOX = 600;
const CENTER = VIEWBOX / 2;
const RADIUS = 238;
const LONG_TICK = 12;
const SHORT_TICK = 6;
const LABEL_OFFSET = 30;

const PARTIES = [
  { key: "owners", label: "owners", angle: -90 },
  { key: "contractors", label: "contractors", angle: 0 },
  { key: "operators", label: "operators", angle: 90 },
  { key: "designers", label: "designers", angle: 180 },
] as const;

const PACKET_LINE_INSET = LONG_TICK + 2; // rim-end of each converging line

type PartyKey = (typeof PARTIES)[number]["key"];

interface Props {
  active: PartyKey | null;
  onHoverParty: (key: PartyKey | null) => void;
}

const polar = (angleDeg: number, radius: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(rad) * radius,
    y: CENTER + Math.sin(rad) * radius,
  };
};

const svgNum = (value: number) => value.toFixed(3);

const anchorFor = (angle: number) => {
  if (angle === 0) return "start";
  if (angle === 180) return "end";
  return "middle";
};

const baselineFor = (angle: number) => {
  if (angle === 90) return "hanging";
  if (angle === -90) return "alphabetic";
  return "middle";
};

const PositionDiagram = forwardRef<SVGSVGElement, Props>(function PositionDiagram(
  { active, onHoverParty },
  ref,
) {
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15 - 90);
  const circumference = svgNum(2 * Math.PI * RADIUS);

  return (
    <svg
      ref={ref}
      className={styles.diagram}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      role="img"
      aria-label="Infraforma sits between owners, designers, contractors and operators"
    >
      <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
        <circle
          className={styles.dRim}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeDasharray={circumference}
        />
      </g>

      <g className={styles.dTicks}>
        {ticks.map((angle, i) => {
          const isCardinal = angle % 90 === 0;
          const length = isCardinal ? LONG_TICK : SHORT_TICK;
          const inner = polar(angle, RADIUS - length);
          const outer = polar(angle, RADIUS);

          return (
            <line
              key={angle}
              className={`${styles.dTick} ${
                isCardinal ? styles.dTickCardinal : ""
              }`}
              x1={svgNum(inner.x)}
              y1={svgNum(inner.y)}
              x2={svgNum(outer.x)}
              y2={svgNum(outer.y)}
              data-cardinal={isCardinal ? "1" : "0"}
              data-tick-index={i}
            />
          );
        })}
      </g>

      <g className={styles.dLines}>
        {PARTIES.map((party) => {
          const start = polar(party.angle, RADIUS - LONG_TICK - 2);

          return (
            <line
              key={party.key}
              className={`${styles.dLine} ${
                active === party.key ? styles.dLineActive : ""
              } ${active && active !== party.key ? styles.dLineDimmed : ""}`}
              x1={svgNum(start.x)}
              y1={svgNum(start.y)}
              x2={CENTER}
              y2={CENTER}
              pathLength={1}
              strokeDasharray="1 1"
            />
          );
        })}
      </g>

      {/* Data packets — one per converging line. Travel rim -> centre on a loop. */}
      <g className={styles.dPackets}>
        {PARTIES.map((party) => {
          const start = polar(party.angle, RADIUS - PACKET_LINE_INSET);
          return (
            <circle
              key={party.key}
              className={`${styles.dPacket} ${
                active === party.key ? styles.dPacketActive : ""
              } ${active && active !== party.key ? styles.dPacketDimmed : ""}`}
              cx={svgNum(start.x)}
              cy={svgNum(start.y)}
              r={3}
              data-party={party.key}
              data-start-x={svgNum(start.x)}
              data-start-y={svgNum(start.y)}
            />
          );
        })}
      </g>

      <g className={styles.dLabels}>
        {PARTIES.map((party) => {
          const point = polar(party.angle, RADIUS + LABEL_OFFSET);

          return (
            <g
              key={party.key}
              className={`${styles.dLabelGroup} ${
                active === party.key ? styles.dLabelActive : ""
              } ${active && active !== party.key ? styles.dLabelDimmed : ""}`}
              onMouseEnter={() => onHoverParty(party.key)}
              onMouseLeave={() => onHoverParty(null)}
              onFocus={() => onHoverParty(party.key)}
              onBlur={() => onHoverParty(null)}
              tabIndex={0}
            >
              <rect
                x={svgNum(point.x - 74)}
                y={svgNum(point.y - 17)}
                width={148}
                height={34}
                fill="transparent"
                pointerEvents="all"
              />
              <text
                className={styles.dLabel}
                x={svgNum(point.x)}
                y={svgNum(point.y)}
                textAnchor={anchorFor(party.angle)}
                dominantBaseline={baselineFor(party.angle)}
              >
                {party.label}
              </text>
            </g>
          );
        })}
      </g>

      <g className={styles.dCentre}>
        <circle
          className={styles.dCentreGlow}
          cx={CENTER}
          cy={CENTER}
          r={22}
          fill="none"
        />
        <circle
          className={styles.dCentreRing}
          cx={CENTER}
          cy={CENTER}
          r={10}
          fill="none"
        />
        <circle className={styles.dCentreDot} cx={CENTER} cy={CENTER} r={2.5} />
      </g>
    </svg>
  );
});

export default PositionDiagram;
export type { PartyKey };
export { PARTIES, CENTER, RADIUS, PACKET_LINE_INSET };
