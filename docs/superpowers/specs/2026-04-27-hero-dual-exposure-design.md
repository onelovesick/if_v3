# Hero · Dual Exposure — Design

**Date:** 2026-04-27
**Scope:** `src/components/Hero/*` only. Promise is a follow-up brainstorm cycle.
**Goal:** Push the existing Hero to Awwwards-grade craft by treating the page composition itself as the brand argument: editorial dark on the left (the "digital"), construction footage on the right (the "physical"), with a multiply-mask exposure between them as the calibration metaphor.

---

## 1. Direction

### What we keep
- The existing 200vh pinned scroll scene.
- The video file at `/videos/hero.mp4` and its autoplay/muted/loop behavior.
- The verbatim hero copy (eyebrow, headline, sub, CTAs) — locked, no rewrites.
- Söhne Breit / Söhne / Söhne Mono and the existing color tokens.
- The Topbar component (existing scroll-detect/blur behavior is fine).
- `prefers-reduced-motion` handling.

### What we change
- Replace the symmetric "left vignette" treatment with a **dual-exposure mask**: video full-bleed, multiply-masked into ink toward the left. The transition zone (≈38–62% of viewport width) is the conversation between digital and construction.
- Replace the existing decorative `frameMeta` / `spineLabel` chrome with a tighter editorial chrome system (see §3).
- Add a **mask-retraction entrance** and a **polarity-flip release** at the end of the pin.
- Add subtle film grain across the whole stage so dark and footage read as one image.

### Why dual exposure (not crosshair / HUD / coordinate column)
- A crosshair, gauge, or coordinate sidebar reads as a viewfinder or instrument panel — videogame-adjacent, decorative.
- The dual-exposure mask makes the calibration metaphor *compositional*, not graphic. The page itself is the argument: the digital meets the physical, you can see the seam.
- Lives entirely in CSS + a single GSAP timeline. No SVG overlays, no DOM-heavy chrome.

---

## 2. Composition

### Layout grid
- Stage: `200vh` tall, content pinned to `100vh` viewport (existing behavior — keep `useHeroMotion`'s pin trigger unchanged).
- Type column: left 44% of the viewport, padded `clamp(24px, 5vw, 72px)`.
- Video: full-bleed (`inset: 0`, `object-fit: cover`).
- Mask layer: full-bleed, sits between video and content, `z-index: 2`.
- Content: `z-index: 6`. Editorial chrome: `z-index: 6`. Topbar remains `position: fixed`.

### Mask gradient (settled state)
Single linear gradient, 90deg, multiply-mode-equivalent via opaque ink stops:

```
linear-gradient(90deg,
  rgba(10,11,13,0.97) 0%,
  rgba(10,11,13,0.92) 18%,
  rgba(10,11,13,0.78) 30%,
  rgba(10,11,13,0.45) 46%,
  rgba(10,11,13,0.18) 64%,
  rgba(10,11,13,0.04) 82%,
  rgba(10,11,13,0)    100%
);
```

This curve places the bridge fully in the right ~30% and gives type a clean dark canvas in the left ~38%, with a 30%-wide blended exposure zone between them. The curve is intentional: it's not a linear fade, it stays high for ~30% then drops fast — that creates a visible *transition* rather than a gentle wash.

### Film grain
Layer at `z-index: 3`, `opacity: 0.18`, `pointer-events: none`:

```
background-image: repeating-linear-gradient(
  0deg, transparent 0 2px, rgba(255,255,255,0.05) 2px 3px
);
```

Static (no animation). Unifies dark and video tonally so they read as one exposure, not two layers.

---

## 3. Editorial chrome

All chrome uses `var(--font-mono)` (Söhne Mono), `font-size: 11px`, `letter-spacing: 0.16em`, `text-transform: uppercase`, color `rgba(255,255,255,0.55–0.78)` unless noted. Hidden on `≤980px` viewports (matches existing breakpoint).

| Element | Position | Content | Notes |
|---|---|---|---|
| **Top brand line** | top-left of pin (under Topbar) | Already handled by `Topbar.tsx` | No changes |
| **Frame meta** | top-right, `top: clamp(80px, 9vh, 110px)` | Two lines: `27.04.2026 · 16:42 UTC` then `In session` (white) | Restyle existing `frameMeta`. Right-aligned, no leading pulse-dot (the dot moves to the eyebrow). Strings copied verbatim from current `index.tsx` — only the dot position changes. |
| **Crossfade mark** | left edge of viewport, `top: 42%` (above content block, below frame meta) | Two stacked mono lines: `Crossfade` (label, 60% opacity) and `digital ↔ construction` (blue, 95%) | New element. `border-left: 1px rgba(46,124,230,0.5)`, `padding-left: 10px`, `left: clamp(24px, 5vw, 72px)`. Suppressed below 800px viewport height to avoid colliding with content. Conceptual anchor of the design. |
| **Edge label** | far right, vertical, rotated -90deg | `INFRAFORMA · 2026` (existing string) | Existing `edgeLabel` — keep verbatim, restyle letter-spacing/opacity to match new chrome. |
| **Spine** | bottom, full width minus padding | 1px gradient line, blue node on left, label `Project 04 · Cable-stayed · In progress` (existing string) | Existing `spine` — keep mechanic and string, lengthen the gradient end (to 50% then transparent). |
| **Eyebrow dot** | inside `HeroContent` eyebrow | Already exists; pulse animation added | Pulse: opacity 0.55 ↔ 1.0, 2.4s ease-in-out, infinite. Suspended under reduced-motion. |

The **crossfade mark** is the new editorial detail that sells the dual-exposure thesis. If anything is cut for screen-size or scope, this stays.

---

## 4. Motion choreography

One GSAP timeline (entrance) + scroll-driven tweens (settled + release). Driven from `useHeroMotion.ts`. Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (existing `--ease-cinematic`).

### Phase A · Entrance (mount, total ~2.5s)

The headline has 6 words ("A specialised construction · digital delivery partner."). Each word starts 0.12s after the previous. With a 0.85s per-word duration, the last word ends at `0.5 + 5*0.12 + 0.85 ≈ 1.95s`. Total entrance lands around 2.5s after mount. Times below are start → end:

1. **t=0**: page renders. Mask layer is at 100% opacity ink (single solid `#0A0B0D` cover, no gradient yet) — viewport reads as a near-black page. Video starts playing under it.
2. **t=0.2 → 0.7s**: Topbar fades in (existing behavior — unchanged).
3. **t=0.3 → 1.3s**: Mask transitions from solid ink to its settled gradient curve over 1.0s. Visually: dark "retracts" right→left, revealing the bridge progressively. Implementation: see §4a below — animate a transform on a stacked second mask layer, do not interpolate gradient stops directly.
4. **t=0.4 → 1.1s**: Eyebrow fades+lifts in (`y: 14 → 0`, opacity 0 → 1), duration 0.7s.
5. **t=0.5 → 1.95s**: Headline words stagger in (`y: 28 → 0`, opacity 0 → 1), 0.85s per word, 0.12s stagger between siblings. First word "A" ends at 1.35s, last word "partner." starts at 1.10s and ends at 1.95s.
6. **t=1.05 → 1.9s**: Sub paragraph fades+lifts in (0.85s).
7. **t=1.2 → 2.05s**: CTA row fades+lifts in (0.85s).
8. **t=1.4 → ~2.5s**: Editorial chrome fades in (frame meta, crossfade mark, edge label, spine) — 0.4s each, 0.08s stagger. Last item lands ~2.5s.

### §4a · Mask retraction technique
Do not animate gradient stop percentages — that triggers full-layer repaints every frame. Instead:
- Stack two masks: a **base mask** with the settled gradient (always present, opacity 1), and an **ink overlay** (solid `#0A0B0D`, full-bleed) on top.
- Tween the ink overlay's `transform: translateX(0%) → translateX(100%)` from t=0.3s to t=1.3s with ease `--ease-cinematic`. The overlay slides off to the right, revealing the settled gradient underneath.
- Add `will-change: transform` to the ink overlay only.
- After completion, the overlay can be `display: none`'d to free the layer.

### Phase B · Settled (idle on Hero)
- **Eyebrow pulse**: opacity 0.55 ↔ 1.0, 2.4s, ease-in-out, infinite. CSS animation, no JS.
- **Spine node breath**: opacity 0.7 ↔ 1.0, 3s, ease-in-out, infinite. CSS animation.
- **Video parallax** (existing): `yPercent: -1.5` on `[data-depth='0']` scrubbed across the pin. Keep.
- **Mask parallax** (new, replaces atmospheric layer): `yPercent: -3.0` on the mask layer scrubbed across the pin. Subtle.
- **Content drift** (existing): `yPercent: -20`, `opacity: 0.2` scrubbed. Keep.

### Phase C · Release (last 25% of the pin scroll)
- Triggered when scroll reaches 75% of the pin (`start: "75% top"`, `scrub: 0.6`).
- **Mask polarity flip**: the gradient transitions from horizontal-ink (settled) to a vertical gradient ink-top → light-bottom (`#FAF9F5`). Implemented as two stacked masks with cross-faded opacity, scrubbed.
- **Content fade-out**: hero content opacity 0.2 → 0 across the same scrub window.
- **Spine node**: stays blue, persists across the seam (this is the visual through-line into the Promise).
- The actual stitching to the Promise component is **deferred to the Promise design cycle** — Hero only commits to ending in a "light-bottom, type-faded, blue-node-persisting" state at the end of the pin.

### Reduced motion
- Mask renders directly at settled gradient (no retraction).
- Content renders at final opacity/position (no stagger).
- Pulse animations disabled (already covered by `@media (prefers-reduced-motion: reduce)` at globals).
- Scroll parallax: skipped — content is static within the pin.
- Pin and `pinSpacing` still apply (so Promise still appears 100vh below as expected).

---

## 5. Component / file changes

```
src/components/Hero/
├── index.tsx                — minor: remove unused frameMeta/spineLabel JSX, add Mask + Grain + Crossfade mark
├── Hero.module.css          — add .mask, .grain, .crossfade, restyle .edgeLabel, .spine, .frameMeta
├── DepthLayers.tsx          — REMOVE the legibility wash (.layer1) — mask replaces it
├── DepthLayers.module.css   — drop .layer1 styles
├── HeroContent.tsx          — no markup change; add aria-live="polite" on eyebrow during entrance
├── HeroContent.module.css   — no change to layout; restyle eyebrow dot for pulse animation
└── useHeroMotion.ts         — rebuild Phase A timeline; add Phase C release tween; add chrome stagger
```

New files: none. We do not introduce new abstractions or shared CSS until the Promise cycle reveals shared needs.

---

## 6. Constraints / non-negotiables (from CLAUDE.md)

- Hero copy is locked — no rewriting eyebrow / headline / sub / CTA labels.
- Two fonts only: Söhne Breit / Söhne / Söhne Mono. No new font weights beyond what's loaded.
- Color palette is locked — no new accent. Blue is signal only.
- Light surfaces dominate the site at the page level; Hero is one of three intentional dark moments. The release into light at the end of the pin is consistent with that brief.
- Editorial restraint: every chrome element earns its place. If it doesn't survive a "what does this say?" test, cut it.

---

## 7. Out of scope (explicitly)

- The Promise component (separate brainstorm cycle).
- Any new Three.js / 3D work — the bridge stays a video.
- The S3 cinematic 3D bridge from the homepage map (different section).
- Mobile (≤980px). Chrome elements (frame meta, crossfade mark, edge label, spine) hidden (existing breakpoint matches). Mask becomes a static vertical gradient: `linear-gradient(180deg, rgba(10,11,13,0.9) 0%, rgba(10,11,13,0.55) 45%, rgba(10,11,13,0.2) 75%, rgba(10,11,13,0) 100%)`. No retraction animation — page renders with mask in final state. No mask parallax. Eyebrow pulse stays. Headline retains existing mobile clamp (`clamp(40px, 9vw, 60px)`). Type column becomes full width.
- Performance budget audit. The plan must hit ≥55fps during entrance and ≥58fps idle on a mid-tier laptop. Implementer must (a) keep `will-change` on transformed/opacity-tweened elements only; (b) animate the ink overlay's transform, never the underlying mask's gradient stops; (c) ensure the grain layer is a static repeating gradient with no animation. Specifics belong in the plan.

---

## 8. Acceptance criteria

The Hero is acceptably "Awwwards-grade" when:

1. **Visual.** First frame on load shows ink → footage transition with a clear blended zone. Type sits cleanly in dark, no legibility issues. Bridge is unmistakably visible on the right.
2. **Motion.** Entrance feels choreographed (mask retracts, words land in sequence, chrome arrives last). No motion looks like a default GSAP fade.
3. **Hold.** When idle on the Hero, the page breathes — pulse + parallax + grain — without churning attention.
4. **Release.** Scrolling past the pin, the dark Hero releases into a light state with the blue node persisting. Promise (when designed) can pick up from that state without a hard cut.
5. **Reduced motion.** With `prefers-reduced-motion`, the Hero is fully readable as a static composition; no flash of unmasked video.
6. **Accessibility.** Headline is one `<h1>`. CTAs have visible focus rings. Decorative chrome carries `aria-hidden="true"`.

---

## 9. Open questions deferred to Promise cycle

- Exact mechanic of the Hero ↔ Promise stitch (does the polarity-flipped mask pass under the Promise top edge, or do we use a sticky shared element?). The Hero ends in a defined state; the Promise integration is its problem.
- Whether "Crossfade · digital ↔ construction" persists into the Promise as a header marker, or stays Hero-only.
- Whether the Promise gets its own dual-exposure logic (e.g., light → ink later in the section) or stays purely light editorial.
