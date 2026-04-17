# Infraforma Homepage Rebuild -- Implementation Plan

---

## 0. COLOR TOKEN UPDATE (globals.css)

Replace and extend the `:root` color block in `src/app/globals.css`. Every section references these tokens.

### Tokens to change

| Current token | Current value | New value | Rationale |
|---|---|---|---|
| `--navy` | `#081225` | `#0B3C5D` | Brand primary shifts to blue-deep |
| `--white` | `#f8f8f8` | `#F5F7FA` | Cooler, slightly blue-white light base |
| `--near-black` | `#1c1c1c` | `#1C1F23` | New dark neutral with slight warmth |
| `--text-faint` | `#8a8a86` | `#8A9199` | New support gray, cooler tone |

### Tokens to add (after existing block)

```css
/* Brand semantic aliases */
--primary: var(--navy);             /* #0B3C5D after update */
--primary-hover: #094A72;
--accent: var(--blue);              /* #47B5FF unchanged */
--accent-hover: var(--blue-bright); /* #6DC8FF unchanged */
--surface-light: var(--white);      /* #F5F7FA */
--surface-off: var(--off-white);    /* #f0f0ee unchanged */
--surface-dark: var(--navy);        /* #0B3C5D */
--surface-darker: #071E30;          /* Deeper dark for gradient bottoms */
--border-light: rgba(11, 60, 93, 0.08);
--border-dark: rgba(207, 217, 224, 0.12);
--text-accent: var(--blue);

/* Section spacing - vertical rhythm */
--section-pad-y: clamp(100px, 14vw, 160px);
--section-pad-y-lg: clamp(120px, 16vw, 200px);
```

### Tokens to update (typography)

```css
--text-hero: clamp(3.75rem, 8.5vw, 7rem);   /* Slightly larger hero */
```

### Button updates

Add to the existing `.btn-primary` rule:
```css
.btn-primary {
  background: var(--primary);   /* now maps to #0B3C5D */
  color: var(--white);
  border-radius: var(--radius-sm);
}
.btn-primary:hover { background: var(--primary-hover); }
```

Add new button variant for dark-on-light CTA:
```css
.btn-cta-large {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-body-md);
  border: none;
  cursor: pointer;
  letter-spacing: 0.005em;
  transition: all var(--dur-fast) var(--ease-out);
  text-decoration: none;
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-sm);
}
.btn-cta-large:hover { background: var(--primary-hover); }
```

---

## 1. FILE ARCHITECTURE

### Files to MODIFY

| File | Change scope |
|---|---|
| `src/app/globals.css` | Token updates above, new utility classes, section-dark update |
| `src/app/page.tsx` | Complete rewrite of homepage section composition |
| `src/components/Hero.tsx` | Refactor: add CTAs, update copy, refine structure |
| `src/components/Hero.module.css` | Refine overlays, add CTA area, update colors |
| `src/components/Reveal.tsx` | No changes needed, use as-is |
| `src/components/StaggerReveal.tsx` | No changes needed, use as-is |
| `src/components/sections/FloatingLinesScroll.tsx` | No changes needed, use as-is |
| `src/components/sections/FloatingLinesScroll.css` | No changes needed |

### Files to CREATE

| File | Purpose |
|---|---|
| `src/components/sections/SectionValueProp.tsx` | Section 2: What We Do |
| `src/components/sections/SectionValueProp.module.css` | Styles for section 2 |
| `src/components/sections/SectionCapabilities.tsx` | Section 3: Core Solutions |
| `src/components/sections/SectionCapabilities.module.css` | Styles for section 3 |
| `src/components/sections/SectionMethod.tsx` | Section 4: How We Work |
| `src/components/sections/SectionMethod.module.css` | Styles for section 4 |
| `src/components/sections/SectionWhyUs.tsx` | Section 5: Why Infraforma |
| `src/components/sections/SectionWhyUs.module.css` | Styles for section 5 |
| `src/components/sections/SectionIndustries.tsx` | Section 6: Industries |
| `src/components/sections/SectionIndustries.module.css` | Styles for section 6 |
| `src/components/sections/SectionSignature.tsx` | Section 7: Visual moment |
| `src/components/sections/SectionSignature.module.css` | Styles for section 7 |
| `src/components/sections/SectionFinalCTA.tsx` | Section 8: Closing CTA |
| `src/components/sections/SectionFinalCTA.module.css` | Styles for section 8 |

### Files to REMOVE from page.tsx imports (no longer used on homepage)

- `TopScene` (replaced by direct Hero usage)
- `SectionClosingGap` (replaced by new sections)
- `Pillars` (replaced by SectionCapabilities)

The components themselves stay in the repo for potential use on other pages. We just stop importing them in `page.tsx`.

---

## 2. PAGE COMPOSITION (page.tsx)

The new `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import SectionValueProp from "@/components/sections/SectionValueProp";
import SectionCapabilities from "@/components/sections/SectionCapabilities";
import SectionMethod from "@/components/sections/SectionMethod";
import SectionWhyUs from "@/components/sections/SectionWhyUs";
import SectionIndustries from "@/components/sections/SectionIndustries";
import SectionSignature from "@/components/sections/SectionSignature";
import SectionFinalCTA from "@/components/sections/SectionFinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />                    {/* 1. Dark cinematic hero */}
      <SectionValueProp />        {/* 2. Light - What we do */}
      <SectionCapabilities />     {/* 3. Off-white - 6 pillars */}
      <SectionMethod />           {/* 4. Dark - 4-step process */}
      <SectionSignature />        {/* 5. Visual WebGL moment */}
      <SectionWhyUs />            {/* 6. Light - differentiators */}
      <SectionIndustries />       {/* 7. Off-white - 6 sectors */}
      <SectionFinalCTA />         {/* 8. Dark - closing CTA */}
      {/* Footer remains in page.tsx inline, same as current */}
    </main>
  );
}
```

Section ordering rationale: The signature visual section is placed between Method and Why Us to create a dramatic breathing moment between the two most text-heavy sections. This pacing mirrors Awwwards-level site structures where a visual interlude prevents content fatigue.

---

## 3. SECTION-BY-SECTION SPECIFICATIONS

---

### SECTION 1: HERO

**File**: `src/components/Hero.tsx` + `Hero.module.css` (modify existing)

**Background treatment**: Keep `hero.mp4` video. Refine the gradient veil to use the updated `--navy` (#0B3C5D) tones. The existing imageVeil radial gradient approach stays but with adjusted opacity values for more cinematic depth.

**Layout (desktop, >=1080px)**:
- Full viewport height: `min-height: 100svh`
- Content positioned via absolute inside a relative flex container
- Headline area: bottom-left, anchored at `bottom: clamp(126px, 15vh, 186px); left: 0`
- CTA row: directly below headline, `margin-top: var(--space-32)`
- Right-side body card: REMOVE the `bodyWrap` element entirely. The hero becomes cleaner with just the headline + CTAs against the video. This is the editorial direction.

**Copy**:
- Eyebrow (AkkuratMono, 11px, `letter-spacing: 0.16em`, uppercase, `rgba(71, 181, 255, 0.85)`): `"Digital Delivery Partner"`
- Headline (LayGrotesk 700, `clamp(4.2rem, 6.3vw, 6.8rem)`, line-height 0.92, white):
  - Line 1 (weight 400, `rgba(248, 248, 248, 0.72)`): `"Structured Information."`
  - Line 2 (weight 700, `#f8f8f8`): `"Smarter Delivery."`
- CTA row: Two buttons side by side
  - Primary CTA: `btn btn-accent` -- text: `"Schedule a Discovery Call"`
  - Secondary CTA: `btn btn-outline` with dark-mode styling (white border, white text) -- text: `"View Our Solutions"`

**Changes to Hero.module.css**:
- Update `imageVeil` rgba values from `rgba(8, 18, 37, ...)` to `rgba(11, 60, 93, ...)` to match new primary
- Add `.ctaRow` class:
  ```css
  .ctaRow {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-16);
    margin-top: var(--space-32);
  }
  ```
- Add dark-mode button overrides within the hero scope:
  ```css
  .ctaRow .btn-outline {
    color: rgba(248, 248, 248, 0.85);
    border-color: rgba(248, 248, 248, 0.2);
  }
  .ctaRow .btn-outline:hover {
    border-color: rgba(248, 248, 248, 0.5);
    color: #f8f8f8;
  }
  ```

**Animation** (existing patterns, refined):
- Keep `useGSAP` with `scope: sectionRef`
- Entrance: `gsap.from("[data-copy-item]", { y: 34, opacity: 0, duration: 0.95, stagger: 0.14, ease: "power3.out", delay: 0.12 })` -- unchanged
- Add CTA row to `[data-copy-item]` attribute on the wrapper div
- Keep all scroll parallax triggers as-is (imageField, siteGrid, headlineWrap, scrollCue)

**Responsive (<=768px)**:
- Headline: `clamp(3rem, 10.4vw, 4.8rem)` -- unchanged
- CTA row: `flex-direction: column; width: 100%`; buttons become full-width
- headlineWrap: `bottom: 160px` to accommodate CTA buttons
- scrollCue: bottom: 20px, centered

---

### SECTION 2: VALUE PROPOSITION

**File**: `src/components/sections/SectionValueProp.tsx` + `.module.css`

**Background**: `section-light` (white `#F5F7FA`)

**Padding**: `padding: var(--section-pad-y) 0`

**Layout**: Two-column grid inside `page-container`:
```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: var(--space-80);
  align-items: start;
}
```

**Left column** -- headline area:
- Eyebrow: `text-mono-label`, color `var(--text-faint)`, text: `"What We Do"`
- Headline: LayGrotesk 900, `font-size: clamp(2.5rem, 5vw, 4.2rem)`, `line-height: 0.96`, `letter-spacing: -0.03em`, `color: var(--text-heading)`, `max-width: 14ch`
  - Text: `"We help infrastructure teams deliver with clarity."`
- Accent rule below headline: `width: 64px; height: 2px; background: var(--accent); margin-top: var(--space-32)`

**Right column** -- supporting copy:
- `padding-top: clamp(16px, 2vw, 32px)` to align baselines
- Paragraph 1: LayGrotesk 400, `font-size: clamp(17px, 1.4vw, 20px)`, `line-height: 1.65`, `color: var(--text-muted)`, `max-width: 42ch`
  - Text: `"Infrastructure projects fail not because of bad engineering, but because information is fragmented across teams, tools, and timelines. We structure that information so delivery teams can see, decide, and act together."`
- Paragraph 2 (emphasis): same font but `font-weight: 600`, `color: var(--text-heading)`, `margin-top: var(--space-24)`
  - Text: `"From requirements capture to lifecycle handover -- one connected information layer."`

**Three value cards below** (full-width row under the two-column header):
```css
.cardRow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-top: var(--space-80);
  background: var(--light-gray);
  border: 1px solid var(--light-gray);
}
```

Each card:
```css
.card {
  background: var(--white);
  padding: clamp(28px, 2.6vw, 44px);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
```

Card contents:
1. **Icon area**: A 40x40px div with `border: 1px solid var(--border-light); border-radius: var(--radius-md)` containing a simple SVG icon (line-art style, stroke-width 1.5, `color: var(--accent)`)
2. **Title**: `text-h3` -- LayGrotesk 600, `clamp(1.25rem, 2vw, 1.625rem)`
3. **Body**: `text-body` -- 1rem, `color: var(--text-muted)`, `line-height: 1.65`

Card data:
```
[
  { icon: "structure", title: "Structure Information", body: "Connect requirements, decisions, and deliverables across every discipline into one organised view." },
  { icon: "connect", title: "Connect Systems", body: "Bridge the gap between design tools, delivery platforms, and governance frameworks without replacing what works." },
  { icon: "visibility", title: "Improve Visibility", body: "Give leadership and delivery teams a shared, live picture of what is moving, what is blocked, and what needs attention." }
]
```

**Component reuse**: Wrap the left column content in `<Reveal>` and the card grid in `<StaggerReveal stagger={0.12}>`.

**Animation**:
- Left column: `<Reveal y={28}>` wrapping the entire left column
- Right column: `<Reveal y={28} delay={0.1}>` wrapping the right column
- Cards: `<StaggerReveal stagger={0.12} y={36}>` wrapping the card row (StaggerReveal targets direct children)

**Responsive (<=960px)**:
```css
.layout { grid-template-columns: 1fr; gap: var(--space-48); }
.cardRow { grid-template-columns: 1fr; margin-top: var(--space-48); }
```

---

### SECTION 3: CORE SOLUTIONS / CAPABILITIES

**File**: `src/components/sections/SectionCapabilities.tsx` + `.module.css`

**Background**: `section-off-white` (`#f0f0ee`)

**Padding**: `padding: var(--section-pad-y) 0`

**Header**: Centered, narrow
```css
.header {
  text-align: center;
  max-width: var(--narrow-width);  /* 720px */
  margin: 0 auto var(--space-80);
}
```
- Eyebrow: `text-mono-label`, `"Core Solutions"`
- Headline: `text-h1`, `max-width: 16ch`, `margin: 0 auto`
  - Text: `"Six pillars of infrastructure intelligence."`
- Subhead: `text-body-lg`, `max-width: 38ch`, `margin: var(--space-24) auto 0`
  - Text: `"Each capability is designed to work independently or as a connected system."`

**Grid**: 3-column, 2-row grid of 6 cards
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--light-gray);
  border: 1px solid var(--light-gray);
}
```

**Card design** -- interactive elevated cards:
```css
.card {
  position: relative;
  background: var(--off-white);
  padding: clamp(32px, 3vw, 48px) clamp(28px, 2.6vw, 40px);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  transition: background var(--dur-normal) var(--ease-smooth);
  cursor: default;
  overflow: hidden;
}
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-normal) var(--ease-out);
}
.card:hover {
  background: var(--white);
}
.card:hover::before {
  transform: scaleX(1);
}
```

Card contents:
1. **Number**: AkkuratMono 400, `11px`, `letter-spacing: 0.08em`, `color: var(--accent)` -- `"01"` through `"06"`
2. **Title**: LayGrotesk 700, `clamp(22px, 2vw, 28px)`, `line-height: 1.12`, `letter-spacing: -0.02em`, `color: var(--text-heading)`, `margin: var(--space-32) 0 var(--space-16)`, `max-width: 14ch`
3. **Body**: LayGrotesk 400, `1rem`, `line-height: 1.65`, `color: var(--text-muted)`, `flex: 1`
4. **Arrow indicator**: bottom-right, `opacity: 0` normally, `opacity: 1` on card hover. A small 14x14 SVG arrow (same as gap-footer-link arrow), `color: var(--accent)`. Positioned via `margin-top: auto; align-self: flex-end`.

**Card data**:
```
[
  { num: "01", title: "Digital Delivery Strategy", body: "Define how information flows from project inception through construction to handover. We design the strategy before selecting the tools." },
  { num: "02", title: "Information Management", body: "Structure project data, documents, and models so every team accesses one source of truth. ISO 19650 aligned, practically implemented." },
  { num: "03", title: "CDE & Connected Workflows", body: "Design and deploy common data environments that connect disciplines, not just store files. Real collaboration, not shared drives." },
  { num: "04", title: "Delivery Controls & Dashboards", body: "Build live visibility into programme health. Progress, risk, quality, and commercial performance in one decision-ready view." },
  { num: "05", title: "Data Structuring & Taxonomy", body: "Create the classification systems and data standards that make information findable, comparable, and machine-readable across projects." },
  { num: "06", title: "Lifecycle Continuity", body: "Ensure information created during delivery survives into operations. As-built verification, digital twin readiness, and asset data integrity." }
]
```

**Animation**: The section is a `"use client"` component using `useGSAP`:
- Header elements: `gsap.from` with `y: 24, opacity: 0, stagger: 0.08, ease: "power3.out"`, `scrollTrigger: { trigger: section, start: "top 78%", once: true }`
- Card grid: `gsap.from(".capability-card", { y: 36, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: gridRef, start: "top 82%", once: true } })`

**Responsive (<=960px)**:
```css
.grid { grid-template-columns: repeat(2, 1fr); }
```
**Responsive (<=600px)**:
```css
.grid { grid-template-columns: 1fr; }
.card { min-height: 0; }
```

---

### SECTION 4: HOW WE WORK (METHOD)

**File**: `src/components/sections/SectionMethod.tsx` + `.module.css`

**Background**: `section-dark` -- background `var(--navy)` (#0B3C5D)

**Padding**: `padding: var(--section-pad-y-lg) 0`

**Header**: Left-aligned within `page-container`
- Eyebrow: `text-mono-label`, `color: var(--accent)`, text: `"How We Work"`
- Headline: `text-h1`, `color: var(--text-dark-heading)`, `max-width: 14ch`
  - Text: `"Four steps from fragmented to controlled."`
- Supporting paragraph: `text-body-lg`, `color: var(--text-dark-body)`, `max-width: 38ch`, `margin-top: var(--space-24)`
  - Text: `"Every engagement follows this proven path. We adapt the depth and pace to fit your programme, but the structure stays the same."`

**Four-step layout**: Horizontal timeline-style on desktop
```css
.timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: var(--space-80);
  position: relative;
}
```

**Connecting line**: A horizontal rule spanning the full width, positioned behind the step circles:
```css
.timelineLine {
  position: absolute;
  top: 28px;   /* center of step circle */
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--accent), rgba(71, 181, 255, 0.2));
}
```

**Each step**:
```css
.step {
  position: relative;
  padding-right: clamp(20px, 2vw, 40px);
}
```

Step contents:
1. **Step circle**: `width: 56px; height: 56px; border-radius: 50%; border: 1px solid rgba(71, 181, 255, 0.2); background: var(--navy);` containing the step number in AkkuratMono 400, 11px, `color: var(--accent)`
2. **Step label**: LayGrotesk 700, `clamp(1.25rem, 2vw, 1.625rem)`, `color: var(--text-dark-heading)`, `margin-top: var(--space-24)`
3. **Step description**: LayGrotesk 400, `1rem`, `line-height: 1.65`, `color: var(--text-dark-muted)`, `margin-top: var(--space-12)`, `max-width: 28ch`

**Step data**:
```
[
  { num: "01", label: "Assess", desc: "Map your current information landscape. Understand what exists, what is missing, and where delivery friction lives." },
  { num: "02", label: "Define", desc: "Design the information structure, workflows, and standards that will connect your teams and tools." },
  { num: "03", label: "Implement", desc: "Deploy the systems, train the people, and embed the processes. We stay until it works in the field, not just on paper." },
  { num: "04", label: "Control", desc: "Establish the dashboards, quality gates, and feedback loops that keep information flowing as the programme evolves." }
]
```

**Animation**: `"use client"` with `useGSAP`:
- Step circles: `gsap.from` each circle with `scale: 0, opacity: 0, stagger: 0.2, duration: 0.6, ease: "back.out(1.4)"`, `scrollTrigger: { trigger: timelineRef, start: "top 72%", once: true }`
- Timeline line: `gsap.from` with `scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "power2.out"`, triggered slightly before circles
- Step text: `gsap.from` with `y: 24, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"`, triggered with circles

**Responsive (<=768px)**:
```css
.timeline {
  grid-template-columns: 1fr;
  gap: var(--space-48);
}
.timelineLine {
  /* Becomes vertical */
  top: 0;
  bottom: 0;
  left: 27px;  /* center of circle */
  right: auto;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, var(--accent), rgba(71, 181, 255, 0.2));
}
.step {
  padding-left: 80px;   /* clear circle + gap */
  padding-right: 0;
}
.step .stepCircle {
  position: absolute;
  left: 0;
  top: 0;
}
```

---

### SECTION 5: SIGNATURE VISUAL (WebGL Moment)

**File**: `src/components/sections/SectionSignature.tsx` + `.module.css`

**Purpose**: The Awwwards standout moment. Uses the existing `FloatingLinesScroll` component with GSAP ScrollTrigger driving its shader uniforms.

**Concept**: "Data Becomes Structure" -- as user scrolls, chaotic floating lines (representing fragmented data) converge into a unified central band (representing structured delivery). A text layer appears over the converged state.

**Background**: Light base `var(--white)` -- the FloatingLinesScroll renders on transparent canvas so lines composite over white.

**Layout**:
```css
.section {
  position: relative;
  height: 300vh;       /* tall scroll container for scrub animation */
  overflow: clip;
}
.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.canvasWrap {
  position: absolute;
  inset: 0;
}
.textOverlay {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: var(--narrow-width);
  padding: 0 var(--gutter);
  pointer-events: none;
}
```

**FloatingLinesScroll props**:
```tsx
<FloatingLinesScroll
  ref={shaderRef}
  linesGradient={["#8A9199", "#47B5FF", "#0B3C5D", "#6DC8FF"]}
  enabledWaves={["top", "bottom"]}
  lineCount={[10, 10]}
  lineDistance={[5, 5]}
  topWavePosition={{ x: 8.0, y: 0.5, rotate: -0.5 }}
  bottomWavePosition={{ x: 2.0, y: -0.65, rotate: 0.45 }}
  topConvergedPos={{ x: 5.0, y: 0.0, rotate: -0.06 }}
  bottomConvergedPos={{ x: 5.0, y: 0.0, rotate: 0.06 }}
  animationSpeed={0.6}
  interactive={true}
  bendRadius={6.0}
  bendStrength={-1.5}
  mouseDamping={0.06}
/>
```

**Scroll-driven animation** (three phases across the 300vh):
```tsx
useGSAP(() => {
  const uniforms = shaderRef.current?.getUniforms();
  if (!uniforms) return;

  // Phase 1 (0-50%): Lines converge
  gsap.to(uniforms.uConverge, {
    value: 1,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "50% top",
      scrub: 0.8,
    },
  });

  // Phase 2 (30-70%): Color shifts to brand blue
  gsap.to(uniforms.uColorMix, {
    value: 1,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "30% top",
      end: "70% top",
      scrub: 0.8,
    },
  });

  // Phase 3 (60-100%): Text fades in, lines partially fade
  gsap.to(uniforms.uFade, {
    value: 0.3,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "60% top",
      end: "100% top",
      scrub: 0.8,
    },
  });

  // Text overlay fade in
  gsap.fromTo(textRef.current, 
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "55% top",
        end: "75% top",
        scrub: 0.6,
      },
    }
  );
}, { scope: sectionRef });
```

**Text overlay content** (appears after convergence):
- Eyebrow: `text-mono-label`, `color: var(--accent)`, text: `"The Infraforma Effect"`
- Headline: `text-h1`, `color: var(--text-heading)`, `max-width: 14ch`, `margin: 0 auto`
  - Text: `"From fragmented data to structured delivery."`
- Body: `text-body-lg`, `color: var(--text-muted)`, `max-width: 34ch`, `margin: var(--space-24) auto 0`
  - Text: `"This is what it looks like when information stops being a liability and starts being an asset."`

**Responsive**: The WebGL canvas scales naturally. On mobile (<=768px):
- Reduce `height` to `200vh` (less scroll distance for smaller screens)
- `lineCount={[6, 6]}` could be passed conditionally, but shader handles it fine at 10

---

### SECTION 6: WHY INFRAFORMA

**File**: `src/components/sections/SectionWhyUs.tsx` + `.module.css`

**Background**: `section-light` (white)

**Padding**: `padding: var(--section-pad-y) 0`

**Layout**: Header + 4-item grid

**Header**: Two-column like SectionValueProp
```css
.header {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--space-80);
  align-items: start;
  margin-bottom: var(--space-80);
}
```
- Left: Eyebrow `"Why Infraforma"` + Headline: `"Built differently for delivery."`
- Right: Supporting text: `"We are not a software vendor. We are not a management consultancy. We are infrastructure professionals who understand how information should work across the delivery lifecycle."`

**Four differentiators**: 2x2 grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-48);
}
```

Each differentiator:
```css
.item {
  padding: clamp(32px, 3vw, 48px);
  border-top: 1px solid var(--light-gray);
}
```

Contents:
1. **Number + label row**: `display: flex; align-items: baseline; gap: var(--space-16)`
   - Number: AkkuratMono 400, 11px, `color: var(--accent)` -- `"01"` etc.
   - Label: LayGrotesk 700, `clamp(1.25rem, 2vw, 1.625rem)`, `color: var(--text-heading)`
2. **Description**: `text-body`, `margin-top: var(--space-16)`, `max-width: 38ch`

**Differentiator data**:
```
[
  { num: "01", label: "Human-Led, Digitally Enabled", desc: "Technology supports the process, not the other way around. We start with how teams actually work and build systems that serve them." },
  { num: "02", label: "Clarity Over Complexity", desc: "We do not add layers. We remove confusion. Every structure we design makes the next decision easier to make." },
  { num: "03", label: "Structured Systems That Scale", desc: "Our information frameworks are built to grow with the programme. What works for ten documents works for ten thousand." },
  { num: "04", label: "Delivery Outcomes, Not Deliverables", desc: "We measure success by what gets built, not what gets filed. Every engagement is accountable to programme performance." }
]
```

**Animation**: Wrap header in `<Reveal>`, wrap grid in `<StaggerReveal stagger={0.1} y={30}>`.

**Responsive (<=768px)**:
```css
.header { grid-template-columns: 1fr; gap: var(--space-48); }
.grid { grid-template-columns: 1fr; }
```

---

### SECTION 7: INDUSTRIES

**File**: `src/components/sections/SectionIndustries.tsx` + `.module.css`

**Background**: `section-off-white` (`#f0f0ee`)

**Padding**: `padding: var(--section-pad-y) 0`

**Header**: Left-aligned
- Eyebrow: `text-mono-label`, `"Where We Work"`
- Headline: `text-h1`, `max-width: 16ch`
  - Text: `"Proven across the sectors that shape the built environment."`

**Layout**: 3x2 grid of industry cards
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-24);
  margin-top: var(--space-64);
}
```

**Card design** -- minimal editorial cards with top border:
```css
.card {
  padding: var(--space-32) 0;
  border-top: 1px solid rgba(8, 18, 37, 0.14);
}
```

Card contents:
1. **Number**: AkkuratMono 400, 11px, `color: var(--text-faint)`, `letter-spacing: 0.08em`
2. **Title**: `text-h3`, `margin: var(--space-16) 0 var(--space-12)`
3. **Description**: `text-body`, `max-width: 30ch`

**Industry data**:
```
[
  { num: "01", title: "Transportation", desc: "Highways, rail, transit, and multimodal networks where delivery complexity demands structured coordination." },
  { num: "02", title: "Heavy Civil", desc: "Bridges, tunnels, dams, and earthworks where engineering precision meets construction reality." },
  { num: "03", title: "Utilities", desc: "Water, wastewater, and utility networks where asset lifecycle data is as critical as the infrastructure itself." },
  { num: "04", title: "Energy", desc: "Generation, transmission, and renewable projects where programme scale requires disciplined information management." },
  { num: "05", title: "Public Infrastructure", desc: "Government buildings, civic facilities, and institutional projects where accountability and transparency are non-negotiable." },
  { num: "06", title: "Complex Capital Programmes", desc: "Multi-billion-dollar programmes where dozens of stakeholders, contractors, and systems must deliver as one." }
]
```

**Animation**: `"use client"` with `useGSAP`:
- Header elements via `<Reveal>`
- Cards: `gsap.from` with `y: 30, opacity: 0, stagger: 0.08, duration: 0.85, ease: "power3.out"`, scrollTrigger on grid, `start: "top 82%"`, `once: true`

**Responsive (<=960px)**: `grid-template-columns: repeat(2, 1fr);`
**Responsive (<=600px)**: `grid-template-columns: 1fr;`

---

### SECTION 8: FINAL CTA

**File**: `src/components/sections/SectionFinalCTA.tsx` + `.module.css`

**Background**: `section-dark` with enhanced gradient:
```css
.section {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(71, 181, 255, 0.06), transparent 50%),
    var(--navy);
  padding: var(--section-pad-y-lg) 0;
}
```

**Layout**: Centered, narrow container
```css
.inner {
  text-align: center;
  max-width: var(--narrow-width);
  margin: 0 auto;
}
```

**Content**:
- Eyebrow: `text-mono-label`, `color: var(--accent)`, `"Next Step"`
- Headline: LayGrotesk 900, `font-size: var(--text-h1)`, `color: var(--text-dark-heading)`, `max-width: 14ch`, centered
  - Text: `"Ready to bring structure to your delivery?"`
- Body: `text-body-lg`, `color: var(--text-dark-body)`, `max-width: 36ch`, `margin: var(--space-24) auto 0`
  - Text: `"We work with organisations that need cleaner coordination, clearer accountability, and a more reliable operating picture across the entire delivery chain."`
- CTA row: centered `flex` with `gap: var(--space-16)`, `margin-top: var(--space-48)`
  - Primary: `.section-dark .btn-primary` (blue bg, navy text) -- `"Schedule a Discovery Call"`
  - Secondary: `.section-dark .btn-outline` (white border) -- `"View Solutions"`

**Animation**: Wrap entire content in `<Reveal y={32}>`.

**Responsive**: Content stacks naturally due to `text-align: center` + `max-width`. CTA buttons:
```css
@media (max-width: 480px) {
  .ctaRow {
    flex-direction: column;
    align-items: center;
  }
  .ctaRow .btn {
    width: 100%;
    justify-content: center;
  }
}
```

---

## 4. MOTION STRATEGY SUMMARY

| Section | Technique | GSAP Pattern | Trigger |
|---|---|---|---|
| Hero | Entrance + parallax | `gsap.from` stagger + `ScrollTrigger scrub:0.7` | Load + scroll |
| Value Prop | Reveal wrappers | `<Reveal>` + `<StaggerReveal>` components | `start: "top 90%"` |
| Capabilities | Staggered card entrance | `gsap.from` with `stagger: 0.1, once: true` | `start: "top 82%"` |
| Method | Timeline build | `gsap.from` with `stagger: 0.2, ease: "back.out"` + line `scaleX` | `start: "top 72%"` |
| Signature | Scroll-driven shader | `ScrollTrigger scrub:0.8` driving `uConverge`, `uColorMix`, `uFade` | Full section scrub |
| Why Us | Reveal wrappers | `<Reveal>` + `<StaggerReveal>` | `start: "top 90%"` |
| Industries | Staggered cards | `gsap.from` with `stagger: 0.08, once: true` | `start: "top 82%"` |
| Final CTA | Single reveal | `<Reveal y={32}>` | `start: "top 90%"` |

All animations respect `prefers-reduced-motion` via `gsap.matchMedia()` wrapping. For reduced motion, skip all transforms and opacity animations.

---

## 5. RESPONSIVE STRATEGY

Three breakpoint tiers:

| Breakpoint | Behavior |
|---|---|
| **>=1080px** (desktop) | Full multi-column layouts, 3-col grids, horizontal timeline, full signature section height |
| **769px-1079px** (tablet) | 2-col grids collapse to 2 or 1, timeline stays horizontal but tighter, signature height reduced |
| **<=768px** (mobile) | All grids 1-col, vertical timeline, CTAs stack, reduced section padding, `--gutter: 24px` |

Global responsive already in globals.css:
```css
@media (max-width: 768px) {
  :root { --gutter: 24px; }
}
```

Each section module handles its own responsive within the media queries noted in each section spec above.

---

## 6. COMPONENT REUSE MATRIX

| Existing component | Where used in new build |
|---|---|
| `Reveal.tsx` | Sections 2, 6, 8 -- wrapping header groups, CTA blocks |
| `StaggerReveal.tsx` | Sections 2, 6 -- wrapping card/item grids |
| `FloatingLinesScroll.tsx` | Section 5 (Signature) -- the core visual, driven by GSAP |
| `Hero.tsx` | Section 1 -- modified in place |
| `Hero.module.css` | Section 1 -- modified in place |
| `SmoothScroll.tsx` | Stays in layout.tsx, no changes |
| `Header.tsx` | Stays in layout.tsx, no changes |

Components NOT used in new build but preserved in codebase:
- `FlowCompare.tsx` -- could be repurposed for a solutions page later
- `TopScene.tsx` -- wrapper no longer needed, Hero used directly
- `Pillars.tsx` -- replaced by SectionCapabilities
- `SectionClosingGap.tsx` -- replaced by SectionValueProp

---

## 7. SECTION RHYTHM AND COLOR FLOW

The page alternates backgrounds for visual rhythm:

```
Hero          -- DARK  (video + navy overlay)
Value Prop    -- LIGHT (#F5F7FA)
Capabilities  -- OFF   (#f0f0ee)
Method        -- DARK  (#0B3C5D)
Signature     -- LIGHT (#F5F7FA, canvas over white)
Why Us        -- LIGHT (#F5F7FA)
Industries    -- OFF   (#f0f0ee)
Final CTA     -- DARK  (#0B3C5D)
Footer        -- DARK  (#0B3C5D, same as current)
```

This creates the pattern: Dark > Light > Off > Dark > Light > Light > Off > Dark > Dark. The two consecutive light sections (Signature + Why Us) work because the signature section is predominantly visual/WebGL with minimal text, creating a natural visual break even without a background change. The consecutive dark sections (CTA + Footer) provide a unified closing experience.

---

## 8. IMPLEMENTATION ORDER

Recommended build sequence:

1. **globals.css token update** -- must happen first as all sections reference tokens
2. **Hero.tsx + Hero.module.css** -- modify existing, add CTAs, update copy
3. **page.tsx** -- rewrite composition (will break until sections are built)
4. **SectionValueProp** -- simplest new section, validates token system
5. **SectionCapabilities** -- 6-card grid, validates StaggerReveal usage
6. **SectionMethod** -- dark section with timeline, validates dark mode tokens
7. **SectionSignature** -- WebGL integration, most technically complex
8. **SectionWhyUs** -- straightforward Reveal-based section
9. **SectionIndustries** -- similar pattern to Capabilities
10. **SectionFinalCTA** -- simple closing section
11. **Final pass** -- responsive testing, animation timing refinement, performance check

---

## 9. PERFORMANCE NOTES

- FloatingLinesScroll creates a WebGL context. Limit to one instance per page. The signature section is the only place it appears.
- All GSAP ScrollTriggers use `once: true` for entrance animations (not scrub) to avoid continuous recalculation.
- The signature section uses `scrub` but only on three uniform values -- minimal overhead.
- Card hover animations use CSS transitions (not GSAP) for 60fps without JS overhead.
- All `will-change` hints are applied sparingly and only on elements that actually animate.
- Images: only `hero.mp4` and potentially `bridge-hero.jpg` are loaded. No new image assets required for this build.
