# INFRAFORMA — Website Redesign

## What Is Infraforma
A digital delivery partner for infrastructure and BIM. We don't sell software — we structure the information management layer that makes complex construction projects work. ISO 19650 aligned. Based in Quebec City, delivering across North America.

## Slogan
"Human-Led, Digitally Enabled."

## Brand Tagline (footer, nav sign-off)
"Infrastructure, Thought Through."

## Design Direction
Light editorial, inspired by ICOMAT (icomat.co.uk). Near-white (#f8f8f8) dominant canvas. Dark navy (#081225) used as contrast punctuation for select sections only. Blue (#47B5FF) as signal accent — never as background fill. Typography does the heavy lifting. Generous whitespace. Confident, restrained, editorial.

## Fonts
- **LayGrotesk** — all display and body text. Files in `public/fonts/`
  - Black (900): hero headlines, section titles, stat values, brand name
  - Bold (700): H2 headings, card titles, emphasized text
  - Semibold (600): body text, H3, buttons, nav links — this is the DEFAULT body weight
  - Regular (400): long-form descriptions, secondary text
- **Akkurat Mono** — all technical labels, data, metadata. Files in `public/fonts/`
  - Regular (400): labels, section numbers, coordinates, captions
  - Bold (700): emphasized data

## Design Tokens
All tokens defined in `src/app/globals.css` as CSS custom properties. **This is the single source of truth.** Never hardcode colors, spacing, or font sizes. Always reference tokens.

### Color Rules
- Light surfaces: `--white: #f8f8f8` (primary), `--off-white: #f0f0ee` (cards), `--light-gray: #dcdcdc` (borders)
- Dark surfaces: `--navy: #081225` (dark sections), `--blue-deep: #0b3c5d` (alt dark)
- Accent: `--blue: #47b5ff` (CTAs, links, highlights), `--blue-bright: #6dc8ff` (hover)
- Text on light: `--text-heading: #080808`, `--text-body: #282728`, `--text-muted: #5e5d69`, `--text-faint: #8a8a86`
- Text on dark: `--text-dark-heading: #cfd9e0`, `--text-dark-body: rgba(207,217,224,0.85)`, `--text-dark-muted: rgba(207,217,224,0.5)`

### Spacing
Base-4/base-8 scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 120, 160px. Use `--space-{n}` tokens.

### Layout
- `--max-width: 1440px` — page container
- `--content-width: 1200px` — content area
- `--narrow-width: 720px` — body text max
- `--gutter: 40px` (24px on mobile)
- Section padding: 120px top, 80px bottom

### Border Radius
- `--radius-sm: 0px` — buttons, grid cards (sharp)
- `--radius-md: 4px` — standalone cards
- `--radius-lg: 8px` — containers, images
- `--radius-pill: 100px` — pill buttons, tags

### Motion
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — reveals, entrances
- `--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)` — hover, nav transitions
- Durations: fast 200ms, normal 400ms, slow 800ms
- GSAP ScrollTrigger scrub: 0.6
- Stagger between siblings: 80ms
- NO spring physics, NO elastic, NO bounce

## CSS Utility Classes
Pre-built in globals.css:
- Typography: `.text-hero`, `.text-h1`, `.text-h2`, `.text-h3`, `.text-body-lg`, `.text-body`, `.text-mono-label`, `.text-mono-data`
- Sections: `.section-light`, `.section-off-white`, `.section-dark`
- Layout: `.page-container`, `.content-container`, `.narrow-container`
- Buttons: `.btn` + `.btn-primary`, `.btn-accent`, `.btn-pill`, `.btn-outline`, `.btn-ghost`
- Dark context overrides are automatic when inside `.section-dark`

## Homepage Sections (in order)

```
S1  Hero + Video ........... LIGHT   "Human-Led, Digitally Enabled."
S2  Problem Statement ...... LIGHT   "Projects don't fail from lack of tools..."
S3  3D Bridge Experience ... ██ DARK  Full-viewport cinematic scroll experience
S4  Three Solution Layers .. LIGHT   Information Strategy / Digital Delivery / Asset Intelligence
S5  Process Framework ...... LIGHT   Assess → Define → Implement → Control (off-white bg)
S6  Credentials ............ ██ DARK  $50B+ / 55+ Years / 3 Countries / ISO 19650
S7  Industries ............. LIGHT   6 sectors with infrastructure photography
S8  Technology Ecosystem ... LIGHT   Logo grid — "Your Tools, Our Structure"
S9  CTA .................... LIGHT   "Ready to Bring Structure to Your Next Programme?"
S10 Footer ................. ██ DARK  Links, coordinates, "Infrastructure, Thought Through."
```

Three dark moments total: 3D bridge, credentials, footer. Everything else breathes in light.

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- GSAP + ScrollTrigger (for scroll animations)
- Three.js (for 3D bridge section)
- Framer Motion (optional, for page transitions)

## Key Principles
1. **Typography carries the design** — not color, not decoration, not texture
2. **Whitespace is intentional** — generous spacing IS the aesthetic
3. **Dark is punctuation, not default** — navy sections are events, not the canvas
4. **Blue is a signal, not a surface** — accent only, never background
5. **Two fonts, clear roles** — LayGrotesk for everything human-readable, Akkurat Mono for everything technical
6. **Motion is precise** — like machinery, not like UI bounce
7. **Content makes it infrastructure** — photography, language, data presentation do the identity work, not visual decoration

## Reference Site
ICOMAT (icomat.co.uk) — Awwwards recognized. Same fonts (LayGrotesk + Akkurat Mono). Editorial restraint. Light dominant. Typography-led. This is the benchmark for quality and tone.

## Services (for content reference)
- **Information Strategy & Governance** — BIM strategy, EIR/BEP, CDE setup, naming conventions, LOD frameworks
- **Digital Delivery & Construction Control** — BIM modelling, clash detection, scan-to-BIM, 4D scheduling, field BIM
- **Asset Intelligence & Digital Twin** — as-built verification, COBie handover, dashboards, digital twin foundations

## File Structure
```
src/app/globals.css     — Design tokens (source of truth)
src/app/layout.tsx      — Root layout
src/app/page.tsx        — Homepage
public/fonts/           — LayGrotesk (.ttf) + Akkurat Mono (.woff2)
```
