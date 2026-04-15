'use client';

import { useEffect, useRef } from 'react';
import FloatingLinesScroll from './FloatingLinesScroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './SectionClosingGap.css';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   SectionClosingGap

   Pinned scroll section between the Hero/Statement and the
   3D Bridge experience. FloatingLines shader runs behind text.
   
   Scroll arc:
   - Lines diverged (two groups crossing) → problem stated
   - Lines converging → "We close that gap"
   - Lines merging → engineer/contractor/owner disconnect
   - Lines merged, blue → resolution
   - Lines fade → bridge takes over
   ═══════════════════════════════════════════════════════════════ */

export default function SectionClosingGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<any>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    // Wait for FloatingLines to mount and expose uniforms
    const checkUniforms = setInterval(() => {
      const uniforms = linesRef.current?.getUniforms?.();
      if (!uniforms) return;
      clearInterval(checkUniforms);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          pin: pin,
          scrub: 0.8,
          anticipatePin: 1,
        }
      });

      // ── BEAT 1: THE PROBLEM (0–20%) ──
      tl.fromTo('.gap-beat-1',
        { opacity: 0 }, { opacity: 1, duration: 3 }, 0)
        .fromTo('.gap-beat-1 .gap-stat',
          { y: 25 }, { y: 0, duration: 4, ease: 'power2.out' }, 0.5)
        .fromTo('.gap-beat-1 .gap-rest',
          { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 4, ease: 'power2.out' }, 1.5)
        .to('.gap-beat-1', { opacity: 0, duration: 3 }, 12);

      // ── BEAT 2: THE PIVOT (20–38%) ──
      tl.fromTo('.gap-beat-2',
        { opacity: 0 }, { opacity: 1, duration: 3 }, 14)
        .fromTo('.gap-beat-2 .gap-pivot-text',
          { y: 12 }, { y: 0, duration: 3, ease: 'power2.out' }, 14)
        .fromTo('.gap-beat-2 .gap-rule',
          { width: 0 }, { width: 80, duration: 5, ease: 'power2.inOut' }, 15)
        .to('.gap-beat-2', { opacity: 0, duration: 3 }, 25);

      // Lines converge 0→0.35, color 0→0.15
      tl.to(uniforms.uConverge, { value: 0.35, duration: 14, ease: 'none' }, 10);
      tl.to(uniforms.uColorMix, { value: 0.15, duration: 14, ease: 'none' }, 10);

      // ── BEAT 3: THE DISCONNECT (38–62%) ──
      tl.fromTo('.gap-beat-3',
        { opacity: 0 }, { opacity: 1, duration: 2 }, 27);

      document.querySelectorAll('.gap-role-line').forEach((el, i) => {
        tl.fromTo(el,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 3, ease: 'power2.out' },
          28 + i * 3
        );
      });
      document.querySelectorAll('.gap-cons-line').forEach((el, i) => {
        tl.fromTo(el,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 3, ease: 'power2.out' },
          38 + i * 3
        );
      });
      tl.to('.gap-beat-3', { opacity: 0, duration: 3 }, 47);

      // Lines converge 0.35→0.7, color 0.15→0.55
      tl.to(uniforms.uConverge, { value: 0.7, duration: 22, ease: 'power1.inOut' }, 24);
      tl.to(uniforms.uColorMix, { value: 0.55, duration: 22, ease: 'power1.inOut' }, 24);

      // ── BEAT 4: THE RESOLUTION (62–82%) ──
      tl.fromTo('.gap-beat-4',
        { opacity: 0 }, { opacity: 1, duration: 3 }, 49)
        .fromTo('.gap-beat-4 .gap-resolve-text',
          { y: 18 }, { y: 0, duration: 4, ease: 'power2.out' }, 49)
        .fromTo('.gap-beat-4 .gap-resolve-sub',
          { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 53)
        .to('.gap-beat-4', { opacity: 0, duration: 4 }, 63);

      // Lines fully converge, full blue
      tl.to(uniforms.uConverge, { value: 1.0, duration: 16, ease: 'power1.inOut' }, 46);
      tl.to(uniforms.uColorMix, { value: 1.0, duration: 16, ease: 'power1.inOut' }, 46);

      // ── EXIT (82–100%) ──
      tl.to(uniforms.uFade, { value: 1.0, duration: 12, ease: 'power2.in' }, 66);
      tl.to(pin, { backgroundColor: '#030305', duration: 14, ease: 'none' }, 64);

      return () => {
        tl.kill();
      };
    }, 100);

    return () => clearInterval(checkUniforms);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gap-section"
      style={{ position: 'relative', height: '500vh' }}
    >
      <div
        ref={pinRef}
        className="gap-pin"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--white, #f8f8f8)',
        }}
      >
        {/* FloatingLines shader background */}
        <FloatingLinesScroll
          ref={linesRef}
          enabledWaves={['top', 'bottom']}
          lineCount={[10, 10]}
          lineDistance={[6, 5]}
          linesGradient={['#5a5a60', '#3a3a42', '#4a4a52', '#2e2e36']}
          topWavePosition={{ x: 8.0, y: 0.55, rotate: -0.5 }}
          bottomWavePosition={{ x: 2.0, y: -0.65, rotate: 0.45 }}
          topConvergedPos={{ x: 5.0, y: 0.0, rotate: -0.06 }}
          bottomConvergedPos={{ x: 5.0, y: 0.0, rotate: 0.06 }}
          interactive={false}
          parallax={false}
          animationSpeed={0.8}
        />

        {/* BEAT 1 */}
        <div className="gap-beat gap-beat-1">
          <h2 className="gap-headline">
            <span className="gap-stat">$1.8 trillion</span>
            <span className="gap-rest"> lost to bad data in a single year.</span>
          </h2>
        </div>

        {/* BEAT 2 */}
        <div className="gap-beat gap-beat-2">
          <p className="gap-pivot-text">We close that gap.</p>
          <div className="gap-rule" />
        </div>

        {/* BEAT 3 */}
        <div className="gap-beat gap-beat-3">
          <div className="gap-beat-inner">
            <div className="gap-roles">
              <span className="gap-role-line">The engineer models.</span>
              <span className="gap-role-line">The contractor builds.</span>
              <span className="gap-role-line">The owner operates.</span>
            </div>
            <div className="gap-consequence">
              <span className="gap-cons-line">Three versions of the same project.</span>
              <span className="gap-cons-line">None of them aligned.</span>
            </div>
          </div>
        </div>

        {/* BEAT 4 */}
        <div className="gap-beat gap-beat-4">
          <div className="gap-beat-inner">
            <p className="gap-resolve-text">We structure the information between them.</p>
            <p className="gap-resolve-sub">
              So every discipline, every phase, every decision draws from
              one coordinated model of truth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
