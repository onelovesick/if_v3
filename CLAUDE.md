# INFRAFORMA — Project Handoff

Bootstrap document. Read in full at the start of every session before writing any code.

This file supersedes any prior CLAUDE.md content in this repo. The previous doc described an
ICOMAT-era / LayGrotesk direction that has been retired.

---

## 1. Project identity

**Infraforma** — an independent information management practice for major infrastructure programs. We work between owners, designers, contractors, and operators on the country's flagship programs. Quebec-based, Canada-wide reach.

- **Hero headline (locked):** *"The intelligence layer behind infrastructure delivery."*
- **Page closer:** *"Infrastructure, thought through."*
- **Practice statement (S2):** Three paragraphs — see the live `Position` component for current copy.

The page is awareness/recognition, not lead generation. It should be shareable in industry circles.

---

## 2. Current state

- **Production:** `https://ifv3.vercel.app` — autodeploys on push to `origin/main` via the Vercel-GitHub integration (dashboard-managed; no `vercel.json` in the repo).
- **Source:** `github.com/onelovesick/if_v3`, default branch `main`.
- **Reference anchors:** Matter Intelligence (`matter.com`) × Polestar × Kiewit (selectively).
- **Do not reference:** ICOMAT (retired), the corporate-engineering-firm template, SaaS dashboard clichés.

---

## 3. Tech stack

- **Next.js 16** (Turbopack, App Router, TypeScript)
- **Tailwind CSS v4** (used sparingly; design tokens live in CSS custom properties, not Tailwind config)
- **GSAP + ScrollTrigger** for choreography
- **Lenis** for smooth scroll — *intentionally delayed* until after the Loader exits, gated by `MotionProvider`'s `ready` flag
- **Three.js** is installed but not used on the homepage (kept for a future prototype)
- Local font files in `public/fonts/` (Söhne family — see §5.2)

---

## 4. Brand position

The firm sits between the parties on a project, not for any one of them. That neutrality is the point.

**Three layers of practice (and the matching dark cinematic section S3):**

1. **Information Management** — foundation, full lifecycle (ISO 19650, CDE, taxonomy, governance)
2. **Execution Intelligence** — build phase (scan-to-BIM, 4D, progress, field BIM)
3. **O&M Digital Twin** — asset life (AIM, COBie, twin foundations, dashboards)

**Customers served:** Owners and operators, architects, engineers, multidisciplinary design firms, general contractors, subcontractors.

**Industries:** Transportation, Energy, Civil infrastructure, Buildings, Industrial.

---

## 5. Visual system (locked)

### 5.1 Palette

All tokens live in `src/app/globals.css` under `:root`. Don't hardcode values; always reference tokens.

```
--bg         #e6e7e3      cool concrete (NOT cream)
--bg-soft    #dfe0dc
--bg-deep    #d4d5d1

--ink        #0a0e16
--ink-2      #1d2330
--ink-mute   #5e6473
--ink-faint  #8a8e96

--dark       #0a1019      brand-tinted near-black for dark sections
--dark-2     #131a26
--dark-text         #e6e4dd
--dark-text-mute    rgba(230, 228, 221, 0.55)
--dark-text-faint   rgba(230, 228, 221, 0.30)
--dark-rule         rgba(230, 228, 221, 0.10)
--dark-rule-strong  rgba(230, 228, 221, 0.20)

--rule         #c5c6c1
--rule-strong  #a0a19c

--blue        #0050ff     electric engineering blue
--blue-deep   #1538b3
--blue-glow   rgba(0, 80, 255, 0.4)
```

The **Position** section (S2) intentionally uses pure `#ffffff` to feel calmer than the cool-concrete `--bg` of the rest of the light sections.

### 5.2 Typography

**PP Neue Corp Compact** (Pangram Pangram, personal-use trial) for display + body, **PP Fraktion Mono** (Pangram Pangram, personal-use trial) for mono. Files in `public/fonts/`:

- `pp-neue-corp-compact-medium.woff2` (covers weight 400–500)
- `pp-neue-corp-compact-ultrabold.woff2` (covers 700–800, reserved for emphasis)
- `pp-fraktion-mono-regular.woff2` (weight 400)

When a paid license lands, drop the licensed files in the same folder and swap filenames in the `@font-face` blocks of `globals.css`.

- `--display: 'PP Neue Corp Compact', system-ui, sans-serif` — headlines, statements, hero wordmark
- `--body: 'PP Neue Corp Compact', system-ui, sans-serif` — body copy
- `--mono: 'PP Fraktion Mono', ui-monospace, monospace` — eyebrows, captions, metadata, callouts

Headlines: weight 500 at clamp(32–124px) sizes, line-height 0.92–1.05, letter-spacing -0.02em to -0.04em (PP Neue Corp wants slightly less negative tracking than Söhne).
Body: weight 400 at 15–17px, line-height 1.5.
Mono: weight 400, 10–12px, letter-spacing 0.16em–0.22em, uppercase.

### 5.3 Type scale tokens

```
--t-eyebrow  11px
--t-body     clamp(15px, 1.05vw, 18px)
--t-lead     clamp(18px, 1.4vw, 24px)
--t-h3       clamp(22px, 2vw, 32px)
--t-h2       clamp(36px, 5.5vw, 96px)
--t-h1       clamp(56px, 9.5vw, 188px)
--t-stat     clamp(64px, 11vw, 200px)
```

### 5.4 Spacing & layout

- Base unit 4px.
- Section padding `clamp(96px, 14vh, 200px)` top/bottom (most sections).
- Page gutter `var(--gutter)` = `clamp(20px, 3vw, 44px)` left/right.
- Max content width tokens: `--max: 1400px`, `--max-wide: 1640px`. Position section uses 1400px directly for the photo collage breathing room.

### 5.5 Edges & shadows

- **Hard everywhere** except photos in the Position collage (6px radius) and CTAs that explicitly need a pill shape. No rounded corners on buttons, no soft shadows on cards.
- Photos in Position get `box-shadow: 0 24px 60px rgba(10,14,22,0.18)` for lift.
- Dark sections use no shadows; ruling is done with `--dark-rule`.

### 5.6 Motion

- Default ease: `--ease: cubic-bezier(0.16, 1, 0.3, 1)` (quart-out) — entrance and reveals.
- Snap ease: `--ease-snap: cubic-bezier(0.65, 0.05, 0.36, 1)` — state toggles.
- Hero entrance uses `expo.out` from GSAP for the word stagger.
- Scrubbed scroll: `scrub: 0.6` standard.
- No spring, no bounce, no elastic. Hard rule.
- Reveals respect `prefers-reduced-motion`.

### 5.7 Grain texture

Page-wide grain mounted once in `layout.tsx` via `<Grain />`. SVG turbulence as a data URI, opacity 0.07, mix-blend-mode overlay, animated with `steps(8)` for stuttered analog feel. Z-index 80.

The Hero has its own additional grain layer (`.heroGrain` in `Hero.module.css`) that's heavier (opacity 0.18, 6-step animation) so the hero photo/video reads as film-captured, not rendered.

---

## 6. Page structure

Six sections plus a Loader, with dark / light rhythm.

```
        Loader (intro)                        DARK
[#top]  Hero — S1                             DARK   video + filmic grain + centered headline
[#position] Position — S2                     LIGHT  photo collage right, text + scroll-fill left
[#layers] Layers — S3                         DARK   pinned cinematic, 3 layers, blue spine
[#howwework] HowWeWork — S4                   LIGHT  6-phase × 3-layer engagement matrix
[#practice] Practice — S5                     DARK   counter-diagonal wash, 0→55 counter
[#close] Close — S6 + Footer                  LIGHT  + DARK footer
```

The light/dark cadence is intentional. New sections should slot into the rhythm or carry a deliberate reason for breaking it.

---

## 7. Component reference

All under `src/components/{Name}/`. Each has `index.tsx` + `{Name}.module.css`. Most are `"use client"` because of GSAP / state.

### Foundation (mounted once in `src/app/layout.tsx` inside `MotionProvider`)

| Component | Purpose |
|---|---|
| `MotionProvider` | Context with a `ready` flag. Loader flips it true after exit. Gates Lenis initialization so the loader's body lock stays clean. Other components also gate their entry timelines on `ready`. |
| `Loader` | Matter-style intro: brand top-left, "Est. Quebec · 2026" top-right, centered tagline, 0%→100% counter bottom-center over 2.6s, slide-up + scale(1.05) exit. Adds `body.is-loading` class to lock scroll. |
| `Grain` | Page-wide grain overlay (see §5.7). |
| `Nav` | Three states: `transparent` (over hero, no background), `is-light` (paper glass over light sections), `is-dark` (near-black glass over dark sections). Switches based on `data-section` + `data-tone` attributes on sections. Stacked brand: open-circle mark above the "Infraforma" wordmark in mono. |

### Sections (children of `<main>` in `src/app/page.tsx`)

| Component | Section | Notes |
|---|---|---|
| `Hero` | S1 | Full-bleed `<video src="/hero-loop.mp4">` with filmic CSS grade (saturate 0.78, contrast 1.06, brightness 0.92), tone overlay, dedicated hero grain layer, center bloom. Single centered headline (`The intelligence layer behind infrastructure delivery.`) with per-word "bump + zoom" reveal: scale 1.04→1, y 60%→0, plus a whole-headline scale 1.06→1 zoom over 1.6s. Video plays at `playbackRate = 0.85` for cinematic feel. |
| `Position` | S2 | Light ground (pure `#ffffff`). Two-column grid: left = blue hairline + display H2 + body paragraphs with inline scroll-fill keyphrases + "Explore the practice" CTA; right = 3 overlapping Pexels photos (top-right small, middle-left wide aerial, bottom-right small) with 6px radius, soft shadow, scale-on-hover. Photos reveal staggered. |
| `Layers` | S3 | Pinned cinematic. Three layer panels (I / II / III) cross-fade by scroll progress. Diagonal black wash sweeps in on entry via animated `clip-path: polygon(...)`. Vertical blue spine fills from top as you scroll. Vertical-rl progress ticks on the left rail. Massive Roman numerals at 14% opacity behind each panel. Pin trigger pins for `LAYERS.length * 100%` of scroll distance. |
| `HowWeWork` | S4 | Interactive lifecycle matrix. 6 phases (Brief → Concept → Design → Build → Commission → Operate) × 3 layers (Information Mgmt / Execution Intel / O&M Twin). Engagement bars per layer span specific phase ranges. Hover a phase to highlight engaged layers; hover a layer to dim the others. Live readout text reflects state. State managed with React `useState`, no GSAP. |
| `Practice` | S5 | Counter-diagonal black wash (mirror of S3). 0→55 counter on enter (the 55 years of senior practice). 3-column matrix: Who we work with / Industries / How we practice. Practice statement quote at the bottom with hairline above. |
| `Close` | S6 + Footer | Massive "Infrastructure, *thought through.*" with `thought through.` in blue italic. Primary CTA + secondary "Read the practice" link. Dark `<footer>` follows: stacked brand on the left, three link columns (Practice / Locations / Standards), bottom strip with copyright + Privacy/Terms. |

### Retired (deleted but kept in git history if needed)

- `Cursor` — custom 6/60/80px cursor; removed from `layout.tsx` because of stacking-context fragility. File still exists at `src/components/Cursor/` for revival if desired.
- `Promise`, `Work`, `SolutionLayers`, `CardStack`, `Mission`, `Stats`, `Feature`, `CapsTabs`, `Sectors`, `Partners`, `Footer` (the older one) — earlier iterations. Gone.
- `SmoothScroll` — replaced by `MotionProvider`'s gated Lenis.

---

## 8. Motion patterns to reuse

### 8.1 Gated entry on `ready`

Most section entry timelines wait for the Loader to finish:

```tsx
const { ready } = useMotionReady();
useEffect(() => {
  if (!ready) return;
  const ctx = gsap.context(() => { /* ... */ }, sectionRef);
  return () => ctx.revert();
}, [ready]);
```

### 8.2 Scroll-triggered fill phrases

Used in `Position` for the blue-fill keyphrases. CSS has a base class plus a `.filled` modifier with a `color` + `text-shadow` transition. ScrollTrigger toggles `.filled` on `start: top 70%` with `onLeaveBack` reversing.

### 8.3 Pinned cinematic

`Layers` uses `ScrollTrigger.create({ trigger, start: "top top", end: "+=" + N*100 + "%", pin: true, scrub: 0.5, onUpdate })` to pin the stage while the user "scrolls through" the three panels. Each panel toggles `is-visible` based on progress.

### 8.4 Stagger reveals

Default pattern: `gsap.from(elements, { opacity: 0, y: 24, duration: 1.0, ease: "expo.out", stagger: 0.06-0.14, scrollTrigger: { trigger: el, start: "top 82%" } })`. Apply via `[data-reveal]` attribute.

---

## 9. Files to keep OUT of the repo

`.gitignore` already covers these:

- `/.agents/`, `/.claude/skills/`, `/.claude/settings.json` — per-developer agent/skill installs.
- `/skills-lock.json`
- `/PRODUCT.md` — strategic positioning with named competitors. Local-only.
- `/cleaning company/` — unrelated project residue.

If you add any local notes / drafts / scratch directories, gitignore them.

---

## 10. Voice rules (HARD)

- **No em dashes (—). No en dashes (–).** Use commas, colons, periods, or parentheses. The Söhne hyphen-minus is fine when actually hyphenating compound words.
- No AI-tells: no "leverage", "seamless", "robust", "passionate", "elevate", "delve", "world-class", "cutting-edge", "tailored solutions", "trusted partner", "attention to detail".
- No SaaS clichés: no live badges, fake telemetry, "trusted by" carousels, exit-intent modals.
- No invented claims. Insurance, certifications, years in business, project counts — confirmed true only.
- No invented testimonials.
- Active voice, present tense, short sentences, short paragraphs.

---

## 11. Open items

1. **Real video** — `/public/hero-loop.mp4` currently shows whichever cut the user has uploaded. Final version still being produced.
2. **Real project photography** — Position collage uses Pexels placeholders. Swap the three image URLs in `Position/index.tsx` (the `image.src` strings) when real shots land. Aspect ratios are constrained by CSS so any photo will fit.
3. **CTA destinations** — `Begin a brief`, `Read the practice`, `Explore the practice`, footer links all point at `#` placeholders. Wire to real pages or email/Calendly when ready.
4. **French locale** — not scaffolded. Plan separately.
5. **Inner pages** — `/capabilities`, `/work`, `/writing`, `/contact` not built. Out of scope for this homepage.
6. **3D bridge prototype** — Three.js is installed and there's an earlier prototype that's not on the homepage. Re-integration is a future decision.

---

## 12. Working with the user

The user is the founder and the brand decision-maker. They iterate fast and prefer **execution over questions**. When in doubt:

- Make the most defensible choice and ship it; let them redirect.
- One concrete option beats four to choose from.
- Don't over-explain reasoning before code lands.
- They'll send reference screenshots when they want a direction change. Read the reference for what's distinctive and translate it into our brand system — don't clone it.

If they share a reference site, the question is "what specifically did they like about it" not "should we copy it wholesale."

---

## 13. File map

```
src/app/
  globals.css           single source of truth for tokens (§5)
  layout.tsx            mounts MotionProvider, Loader, Grain, Nav
  page.tsx              ordered sections (§6)

src/components/
  MotionProvider/       ready state, Lenis-after-loader
  Loader/               intro counter + slide-up exit
  Grain/                page-wide noise
  Nav/                  3-state fixed nav
  Hero/                 S1
  Position/             S2 (light + photo collage)
  Layers/               S3 (dark + pinned)
  HowWeWork/            S4 (interactive)
  Practice/             S5 (dark + counter)
  Close/                S6 + footer
  Cursor/               retired, kept

src/lib/
  gsap.ts               registers ScrollTrigger
  reducedMotion.ts      prefers-reduced-motion helper

public/
  fonts/                Söhne woff2 files
  hero-loop.mp4         hero background video (38MB current)
```

---

## 14. What this doc explicitly does NOT cover

- Analytics, SEO meta, Open Graph imagery
- Full accessibility audit (basics are in place; full audit pending)
- A CMS
- Inner-page templates
- French localization
- Real-data integrations (project counts, etc.)

Those are separate work items.
