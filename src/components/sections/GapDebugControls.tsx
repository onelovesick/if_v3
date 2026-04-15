'use client';

import { useEffect, useState, type RefObject } from 'react';
import type gsap from 'gsap';
import type { FloatingLinesScrollHandle } from './FloatingLinesScroll';

/* ═══════════════════════════════════════════════════════════════
   GapDebugControls
   Dev-only UI for tuning the shader wave positions in real time.
   - Pauses the GSAP timeline when open so sliders have authority
   - Writes directly into the shader uniforms
   - Provides a "Copy JSX" button so you can paste values back into
     SectionClosingGap.tsx
   ═══════════════════════════════════════════════════════════════ */

interface Props {
  linesRef: RefObject<FloatingLinesScrollHandle | null>;
  tlRef: RefObject<gsap.core.Timeline | null>;
  initial: {
    topStart: Vec3;
    topEnd: Vec3;
    bottomStart: Vec3;
    bottomEnd: Vec3;
  };
}

interface Vec3 {
  x: number;
  y: number;
  rotate: number;
}

const ranges = {
  x: { min: -15, max: 15, step: 0.05 },
  y: { min: -2, max: 2, step: 0.01 },
  rotate: { min: -1.5, max: 1.5, step: 0.01 },
  converge: { min: 0, max: 1, step: 0.01 },
  colorMix: { min: 0, max: 1, step: 0.01 },
  fade: { min: 0, max: 1, step: 0.01 },
} as const;

export default function GapDebugControls({ linesRef, tlRef, initial }: Props) {
  const [open, setOpen] = useState(false);
  const [topStart, setTopStart] = useState<Vec3>(initial.topStart);
  const [topEnd, setTopEnd] = useState<Vec3>(initial.topEnd);
  const [bottomStart, setBottomStart] = useState<Vec3>(initial.bottomStart);
  const [bottomEnd, setBottomEnd] = useState<Vec3>(initial.bottomEnd);
  const [converge, setConverge] = useState(0);
  const [colorMix, setColorMix] = useState(0);
  const [fade, setFade] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      tl.pause();
    } else {
      tl.resume();
    }
  }, [open, tlRef]);

  useEffect(() => {
    if (!open) return;
    // Uniforms are Three.js Uniform refs — .value for scalars, .value.set() for Vector3
    const uniforms = linesRef.current?.getUniforms() as
      | Record<
          string,
          { value: number | { set: (x: number, y: number, z: number) => void } }
        >
      | null;
    if (!uniforms) return;

    const writeVec = (key: string, v: Vec3) => {
      const u = uniforms[key]?.value;
      if (u && typeof u === 'object' && 'set' in u) {
        u.set(v.x, v.y, v.rotate);
      }
    };

    writeVec('topWavePosition', topStart);
    writeVec('topConvergedPos', topEnd);
    writeVec('bottomWavePosition', bottomStart);
    writeVec('bottomConvergedPos', bottomEnd);

    uniforms.uConverge.value = converge;
    uniforms.uColorMix.value = colorMix;
    uniforms.uFade.value = fade;
  }, [open, topStart, topEnd, bottomStart, bottomEnd, converge, colorMix, fade, linesRef]);

  const copyJSX = async () => {
    const fmt = (v: Vec3) =>
      `{ x: ${v.x.toFixed(2)}, y: ${v.y.toFixed(2)}, rotate: ${v.rotate.toFixed(2)} }`;
    const jsx =
      `topWavePosition={${fmt(topStart)}}\n` +
      `bottomWavePosition={${fmt(bottomStart)}}\n` +
      `topConvergedPos={${fmt(topEnd)}}\n` +
      `bottomConvergedPos={${fmt(bottomEnd)}}`;
    try {
      await navigator.clipboard.writeText(jsx);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  return (
    <div style={panelStyle(open)}>
      <button onClick={() => setOpen(!open)} style={toggleStyle}>
        {open ? '× close debug' : '⚙ debug lines'}
      </button>

      {open && (
        <div style={contentStyle}>
          <div style={hintStyle}>
            GSAP paused. Drag <b>converge</b> to preview end state. Copy values
            when happy.
          </div>

          <Section title="● Top / Line 1 — START" v={topStart} onChange={setTopStart} />
          <Section title="○ Top / Line 1 — CONVERGED" v={topEnd} onChange={setTopEnd} />
          <Section
            title="● Bottom / Line 2 — START"
            v={bottomStart}
            onChange={setBottomStart}
          />
          <Section
            title="○ Bottom / Line 2 — CONVERGED"
            v={bottomEnd}
            onChange={setBottomEnd}
          />

          <div style={dividerStyle} />

          <Slider
            label="converge"
            value={converge}
            onChange={setConverge}
            range={ranges.converge}
          />
          <Slider
            label="colorMix"
            value={colorMix}
            onChange={setColorMix}
            range={ranges.colorMix}
          />
          <Slider label="fade" value={fade} onChange={setFade} range={ranges.fade} />

          <button onClick={copyJSX} style={copyStyle}>
            {copied ? '✓ copied JSX to clipboard' : 'copy JSX props'}
          </button>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  v,
  onChange,
}: {
  title: string;
  v: Vec3;
  onChange: (next: Vec3) => void;
}) {
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>{title}</div>
      <Slider
        label="x"
        value={v.x}
        onChange={(x) => onChange({ ...v, x })}
        range={ranges.x}
      />
      <Slider
        label="y"
        value={v.y}
        onChange={(y) => onChange({ ...v, y })}
        range={ranges.y}
      />
      <Slider
        label="rotate"
        value={v.rotate}
        onChange={(rotate) => onChange({ ...v, rotate })}
        range={ranges.rotate}
      />
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  range,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  range: { min: number; max: number; step: number };
}) {
  return (
    <label style={sliderRowStyle}>
      <span style={sliderLabelStyle}>{label}</span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={sliderInputStyle}
      />
      <span style={sliderValueStyle}>{value.toFixed(2)}</span>
    </label>
  );
}

/* ─── inline styles so this is self-contained and easy to rip out ─── */

const panelStyle = (open: boolean): React.CSSProperties => ({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 9999,
  fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
  fontSize: 11,
  color: '#e8e8e8',
  background: 'rgba(8, 18, 37, 0.92)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  backdropFilter: 'blur(12px)',
  maxHeight: open ? 'calc(100vh - 32px)' : 'auto',
  overflowY: 'auto',
  width: open ? 320 : 'auto',
  boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
});

const toggleStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'transparent',
  border: 'none',
  color: '#e8e8e8',
  fontFamily: 'inherit',
  fontSize: 11,
  textAlign: 'left',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
};

const contentStyle: React.CSSProperties = {
  padding: '0 14px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const hintStyle: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.65,
  lineHeight: 1.5,
  padding: '0 0 8px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  paddingTop: 8,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 9,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: '#47B5FF',
  marginBottom: 2,
};

const sliderRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '52px 1fr 48px',
  alignItems: 'center',
  gap: 8,
};

const sliderLabelStyle: React.CSSProperties = {
  opacity: 0.72,
};

const sliderInputStyle: React.CSSProperties = {
  width: '100%',
  accentColor: '#47B5FF',
};

const sliderValueStyle: React.CSSProperties = {
  textAlign: 'right',
  opacity: 0.9,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.08)',
  marginTop: 4,
};

const copyStyle: React.CSSProperties = {
  marginTop: 6,
  padding: '10px',
  background: 'rgba(71, 181, 255, 0.14)',
  border: '1px solid rgba(71, 181, 255, 0.35)',
  color: '#47B5FF',
  fontFamily: 'inherit',
  fontSize: 11,
  cursor: 'pointer',
  borderRadius: 4,
  letterSpacing: '0.06em',
};
