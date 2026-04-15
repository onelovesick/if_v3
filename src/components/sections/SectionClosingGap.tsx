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
          scrub: 0.3,
          anticipatePin: 1,
        }
      });

      /* ═══════════════════════════════════════════════
         CONTINUOUS SHADER MOTION
         Uniforms animate linearly across the full scroll
         range so the lines are always responding to the
         scroll — never idle between text beats.
         ═══════════════════════════════════════════════ */
      tl.to(uniforms.uConverge, { value: 1.0, duration: 72, ease: 'sine.inOut' }, 0);
      tl.to(uniforms.uColorMix, { value: 1.0, duration: 72, ease: 'power1.inOut' }, 0);

      /* ═══════════════════════════════════════════════
         TEXT BEATS — crossfade overlap
         Each beat begins fading in before the previous
         has finished fading out, so the viewer always
         sees motion.
         ═══════════════════════════════════════════════ */

      // ── BEAT 1: THE PROBLEM ──
      tl.fromTo('.gap-beat-1',
        { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power2.out' }, 0)
        .fromTo('.gap-beat-1 .gap-stat',
          { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 5.5, ease: 'power3.out' }, 0.8)
        .fromTo('.gap-beat-1 .gap-rest',
          { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 5.5, ease: 'power3.out' }, 2.4)
        .to('.gap-beat-1', { opacity: 0, duration: 5, ease: 'power2.in' }, 13);

      // ── BEAT 2: THE PIVOT (starts while beat 1 still dimming) ──
      tl.fromTo('.gap-beat-2',
        { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power2.out' }, 15)
        .fromTo('.gap-beat-2 .gap-pivot-text',
          { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 5, ease: 'power3.out' }, 15.5)
        .fromTo('.gap-beat-2 .gap-rule',
          { width: 0 }, { width: 80, duration: 7, ease: 'power2.inOut' }, 16)
        .to('.gap-beat-2', { opacity: 0, duration: 5, ease: 'power2.in' }, 27);

      // ── BEAT 3: THE DISCONNECT — staggered lines, crossfades with beat 2 ──
      tl.fromTo('.gap-beat-3',
        { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power2.out' }, 29);

      tl.fromTo('.gap-role-line',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 4, stagger: 1.8, ease: 'power3.out' },
        30
      );

      tl.fromTo('.gap-cons-line',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 4, stagger: 1.8, ease: 'power3.out' },
        41
      );

      tl.to('.gap-beat-3', { opacity: 0, duration: 5, ease: 'power2.in' }, 50);

      // ── BEAT 4: THE RESOLUTION — crossfades with beat 3 ──
      tl.fromTo('.gap-beat-4',
        { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power2.out' }, 52)
        .fromTo('.gap-beat-4 .gap-resolve-text',
          { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 6, ease: 'power3.out' }, 53)
        .fromTo('.gap-beat-4 .gap-resolve-sub',
          { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 6, ease: 'power3.out' }, 56.5)
        .to('.gap-beat-4', { opacity: 0, duration: 6, ease: 'power2.in' }, 66);

      // ── EXIT: lines fade only, background stays white for bridge handoff ──
      tl.to(uniforms.uFade, { value: 1.0, duration: 10, ease: 'power2.inOut' }, 66);

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
          topWavePosition={{ x: 8.0, y: 0.0, rotate: -0.55 }}
          bottomWavePosition={{ x: 2.0, y: -0.65, rotate: 0.45 }}
          topConvergedPos={{ x: 5.0, y: 0.0, rotate: 0.0 }}
          bottomConvergedPos={{ x: 5.0, y: 0.0, rotate: 0.05 }}
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
