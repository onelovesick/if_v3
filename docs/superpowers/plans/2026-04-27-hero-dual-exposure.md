# Hero · Dual Exposure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the dual-exposure Hero per [docs/superpowers/specs/2026-04-27-hero-dual-exposure-design.md](../specs/2026-04-27-hero-dual-exposure-design.md). The Hero becomes a left-dark / right-video composition with a multiply-mask exposure between, a choreographed mask-retraction entrance, scroll parallax during the pin, and a polarity-flip release into the (TBD) light Promise section.

**Architecture:** Single section component pinned for 200vh. CSS mask layer + film grain layer between video and content. GSAP timeline drives the entrance (translate an ink overlay off-screen rather than tweening gradient stops). Two scroll-driven tweens drive parallax (Phase B) and the polarity flip (Phase C). Reduced-motion path snaps to settled state with no animation.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS Modules, GSAP 3.14 + ScrollTrigger.

**Verification model:** No test framework is installed. Verification is visual — `npm run dev`, open `http://localhost:3000`, observe the documented behavior. Logic with no visual signal (cleanup paths, reduced-motion branches) is verified via DevTools (Rendering panel → emulate `prefers-reduced-motion: reduce`; Performance panel → confirm no scroll jank).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Hero/index.tsx` | Compose pinned scene: DepthLayers (video) → mask → grain → ink overlay → editorial chrome → HeroContent |
| `src/components/Hero/Hero.module.css` | Pin layout + mask + grain + ink overlay + editorial chrome styles |
| `src/components/Hero/DepthLayers.tsx` | Video only. Legibility wash removed (replaced by mask). |
| `src/components/Hero/DepthLayers.module.css` | Video styles. `.layer1` removed. |
| `src/components/Hero/HeroContent.tsx` | Eyebrow + headline + sub + CTAs (no markup change beyond existing) |
| `src/components/Hero/HeroContent.module.css` | Pulse animation moves from `frameDot` to `eyebrowDot` here |
| `src/components/Hero/useHeroMotion.ts` | Phase A entrance timeline + Phase B/C scroll-driven tweens + reduced-motion + cleanup |

No new files. No new dependencies.

---

## Baseline check (do this once before Task 1)

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Expected: Next.js starts on `http://localhost:3000`. Open it in a browser. Hero loads with the current pre-redesign state (video on right with horizontal vignette, frame metadata top-right with pulse dot, edge label vertical right, spine bottom).

- [ ] **Step 2: Note current behavior on entrance**

Hard reload (`Ctrl+Shift+R`). Observe: text fades + lifts in word-by-word, sub paragraph and CTAs follow. This is the existing entrance — note it for comparison after Task 5.

- [ ] **Step 3: Note current behavior on scroll**

Scroll down through the Hero. Observe: video and content drift slightly (parallax). Beyond ~100vh of scroll, page leaves the pin and Promise appears. Note it for comparison after Tasks 6–7.

---

## Task 1: Replace legibility wash with mask + grain (static settled state)

**Goal:** Remove the existing `.layer1` legibility gradient. Replace with a dedicated mask layer holding the spec's settled gradient curve, plus a static film-grain layer. Hero should look like the settled state in the design (left-dark / right-video / blended center) with no motion changes yet.

**Files:**
- Modify: `src/components/Hero/DepthLayers.tsx`
- Modify: `src/components/Hero/DepthLayers.module.css`
- Modify: `src/components/Hero/Hero.module.css`
- Modify: `src/components/Hero/index.tsx`

- [ ] **Step 1: Remove `.layer1` JSX from DepthLayers**

Replace the entire return block in `src/components/Hero/DepthLayers.tsx` with:

```tsx
return (
  <div data-depth="0" className={styles.layer0} aria-hidden="true">
    <video
      ref={videoRef}
      className={styles.video}
      src="/videos/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
    />
  </div>
);
```

Remove the surrounding `<>...</>` fragment since there's now only one element. Keep the `useEffect` and the video play-on-interaction fallback exactly as-is.

- [ ] **Step 2: Remove `.layer1` styles from DepthLayers.module.css**

Replace the entire contents of `src/components/Hero/DepthLayers.module.css` with:

```css
/* Depth layer 0 — video. The legibility wash has moved to Hero's .mask layer. */
.layer0 {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 3: Add `.mask` and `.grain` styles to Hero.module.css**

Append the following to `src/components/Hero/Hero.module.css`:

```css
/* ─── DUAL EXPOSURE MASK ─── */
.mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(10, 11, 13, 0.97) 0%,
    rgba(10, 11, 13, 0.92) 18%,
    rgba(10, 11, 13, 0.78) 30%,
    rgba(10, 11, 13, 0.45) 46%,
    rgba(10, 11, 13, 0.18) 64%,
    rgba(10, 11, 13, 0.04) 82%,
    rgba(10, 11, 13, 0) 100%
  );
  will-change: transform;
}

/* ─── FILM GRAIN ─── */
.grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.18;
  background-image: repeating-linear-gradient(
    0deg,
    transparent 0 2px,
    rgba(255, 255, 255, 0.05) 2px 3px
  );
}
```

- [ ] **Step 4: Insert mask + grain JSX in Hero/index.tsx**

In `src/components/Hero/index.tsx`, inside the `<div data-pin>` block, immediately after `<DepthLayers />`, insert the two new layers:

```tsx
<DepthLayers />

{/* Dual-exposure mask: ink-left to clear-right */}
<div data-mask className={styles.mask} aria-hidden="true" />

{/* Film grain: unifies dark + footage as one image */}
<div className={styles.grain} aria-hidden="true" />
```

Keep all existing chrome (frameMeta, spine, contentWrap, edgeLabel) below in the same order.

- [ ] **Step 5: Visual verification**

Hard reload `http://localhost:3000`. Confirm:
- Bridge in the video is fully visible on the right side of the viewport.
- Left ~38% of the viewport is dark with text legible.
- Between ~46% and ~82% of the viewport width there is a visible blended exposure zone (the gradient).
- A subtle horizontal-line grain texture is visible everywhere (zoom in if needed). It should NOT animate.
- The existing entrance animation still plays (words fade in word-by-word). We have not changed motion yet.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/DepthLayers.tsx src/components/Hero/DepthLayers.module.css src/components/Hero/Hero.module.css src/components/Hero/index.tsx
git commit -m "feat(hero): replace legibility wash with dual-exposure mask + grain"
```

---

## Task 2: Restyle existing chrome (frame meta + edge label + spine)

**Goal:** Update the editorial chrome already present (frame meta, edge label, spine) to match the spec's restraint. Frame meta becomes two right-aligned mono lines (no leading dot). Edge label gets tighter letter-spacing. Spine gradient ends earlier (50%) so it reads more architectural.

**Files:**
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Update frame meta JSX**

In `src/components/Hero/index.tsx`, locate the existing `<div className={styles.frameMeta}>` block:

```tsx
<div className={styles.frameMeta} aria-hidden="true">
  <span className={styles.frameDot} />
  In session · 27.04.2026 · 16:42 UTC
</div>
```

Replace with:

```tsx
<div className={styles.frameMeta} aria-hidden="true">
  <span className={styles.frameMetaPrimary}>27.04.2026 · 16:42 UTC</span>
  <span className={styles.frameMetaSecondary}>In session</span>
</div>
```

- [ ] **Step 2: Update `.frameMeta` styles in Hero.module.css**

In `src/components/Hero/Hero.module.css`, replace the entire `.frameMeta { ... }` block (and remove `.frameDot` and `@keyframes framePulse` and the `prefers-reduced-motion` override on `.frameDot`) with:

```css
.frameMeta {
  position: absolute;
  top: clamp(80px, 9vh, 110px);
  right: clamp(24px, 4vw, 56px);
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: right;
  pointer-events: none;
  will-change: transform, opacity;
}

.frameMetaPrimary {
  color: rgba(255, 255, 255, 0.55);
}

.frameMetaSecondary {
  color: #fff;
}
```

(The `.frameDot`, `@keyframes framePulse`, and reduced-motion override for `.frameDot` are removed — the pulse moves to the eyebrow in Task 4.)

- [ ] **Step 3: Update `.spineLine` gradient**

In `src/components/Hero/Hero.module.css`, locate `.spineLine` and replace its `background` declaration with:

```css
.spineLine {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(46, 124, 230, 0.85) 0%,
    rgba(46, 124, 230, 0.3) 50%,
    rgba(46, 124, 230, 0) 100%
  );
}
```

(The gradient now fully fades by 100% instead of carrying a faint white tail to the edge.)

- [ ] **Step 4: Tighten `.edgeLabel`**

In `src/components/Hero/Hero.module.css`, locate `.edgeLabel` and update `letter-spacing`:

```css
.edgeLabel {
  position: absolute;
  top: 50%;
  right: clamp(20px, 2.4vw, 32px);
  z-index: 11;
  transform: rotate(-90deg) translateX(50%);
  transform-origin: right center;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.32);
  white-space: nowrap;
  pointer-events: none;
  will-change: transform, opacity;
}
```

(Letter-spacing changed from `0.32em` to `0.34em`. `will-change` added because Task 5 will animate it on entrance.)

- [ ] **Step 5: Visual verification**

Hard reload `http://localhost:3000`. Confirm:
- Top-right shows two stacked mono lines: `27.04.2026 · 16:42 UTC` (faint) above `In session` (white). No leading dot, no pulse.
- Edge label `INFRAFORMA · 2026` reads slightly more spaced.
- Spine gradient at the bottom now fully fades to transparent at the right edge of its line.
- Everything still positioned correctly; no overlap with content.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/index.tsx src/components/Hero/Hero.module.css
git commit -m "feat(hero): restyle frame meta, edge label, and spine to spec"
```

---

## Task 3: Add the Crossfade editorial mark

**Goal:** Add the conceptual anchor of the design — a two-line mono label on the left edge at vertical center: `Crossfade` (faint) over `digital ↔ construction` (blue). Suppressed below 800px viewport height to avoid colliding with the content block, and below 980px viewport width (mobile breakpoint).

**Files:**
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Add Crossfade mark JSX**

In `src/components/Hero/index.tsx`, inside the `<div data-pin>` block, after `<div className={styles.spine}>...</div>` and before the `<div className={styles.contentWrap}>` block, add:

```tsx
{/* Crossfade mark — conceptual anchor at vertical center, left edge */}
<div data-anim="crossfade" className={styles.crossfade} aria-hidden="true">
  <span className={styles.crossfadeLabel}>Crossfade</span>
  <span className={styles.crossfadeBlue}>digital ↔ construction</span>
</div>
```

- [ ] **Step 2: Add `.crossfade` styles to Hero.module.css**

Append to `src/components/Hero/Hero.module.css`:

```css
/* ─── CROSSFADE MARK — conceptual anchor ─── */
.crossfade {
  position: absolute;
  top: 42%;
  left: clamp(24px, 5vw, 72px);
  z-index: 12;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-left: 1px solid rgba(46, 124, 230, 0.5);
  padding-left: 10px;
  line-height: 1.7;
  pointer-events: none;
  will-change: transform, opacity;
}

.crossfadeLabel {
  display: block;
  color: rgba(255, 255, 255, 0.6);
}

.crossfadeBlue {
  display: block;
  color: rgba(46, 124, 230, 0.95);
}

/* Suppress on short viewports to avoid colliding with content */
@media (max-height: 800px) {
  .crossfade {
    display: none;
  }
}
```

- [ ] **Step 3: Hide on mobile**

In `src/components/Hero/Hero.module.css`, locate the existing `@media (max-width: 980px)` block (with `.frameMeta, .spine, .edgeLabel { display: none; }`) and add `.crossfade` to that selector list:

```css
@media (max-width: 980px) {
  .frameMeta,
  .spine,
  .edgeLabel,
  .crossfade {
    display: none;
  }
}
```

- [ ] **Step 4: Visual verification**

Hard reload `http://localhost:3000`. Confirm:
- A two-line mono mark appears on the left edge (~5vw from edge), at vertical center (`top: 42%`).
- Line 1: `Crossfade` in faint white. Line 2: `digital ↔ construction` in blue.
- A 1px blue vertical rule sits to the left of both lines (the `border-left`).
- Resize the window to height < 800px (DevTools device toolbar): the mark disappears.
- Resize the window to width < 980px: the mark disappears alongside the rest of the chrome.
- The mark does not overlap with the content block at any standard desktop viewport.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/index.tsx src/components/Hero/Hero.module.css
git commit -m "feat(hero): add crossfade editorial mark"
```

---

## Task 4: Move pulse animation from frame meta dot to eyebrow dot

**Goal:** The frame meta no longer has a leading pulsing dot (cleaner editorial). Instead, the existing eyebrow dot inside `HeroContent` now pulses, putting the "live" signal next to the main copy.

**Files:**
- Modify: `src/components/Hero/HeroContent.module.css`

- [ ] **Step 1: Add pulse animation to `.eyebrowDot`**

In `src/components/Hero/HeroContent.module.css`, locate the existing `.eyebrowDot` block:

```css
.eyebrowDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-blue-bright);
  box-shadow: 0 0 10px var(--c-blue-glow);
}
```

Replace with:

```css
.eyebrowDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-blue-bright);
  box-shadow: 0 0 10px var(--c-blue-glow);
  animation: eyebrowPulse 2.4s ease-in-out infinite;
}

@keyframes eyebrowPulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1.0; }
}

@media (prefers-reduced-motion: reduce) {
  .eyebrowDot {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 2: Visual verification**

Hard reload `http://localhost:3000`. Confirm:
- The eyebrow line above the headline now has a pulsing blue dot (opacity oscillates between 55% and 100% over 2.4 seconds).
- The frame meta in the top-right has no pulsing dot (Task 2 already removed the `.frameDot` styles and the JSX).
- Open DevTools → Rendering → enable "Emulate CSS media feature `prefers-reduced-motion: reduce`". Reload. Confirm the eyebrow dot is static at full opacity, no pulsing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero/HeroContent.module.css
git commit -m "feat(hero): move pulse animation from frame meta to eyebrow dot"
```

---

## Task 5: Phase A — entrance retraction + chrome stagger

**Goal:** On mount, the Hero should play the documented entrance: solid ink covers the viewport, then translates off-screen to the right over 1s revealing the settled mask underneath. Words stagger in. Editorial chrome (frame meta, crossfade mark, edge label, spine) arrives last. Replace the existing `useHeroMotion` Phase A logic with the spec's full timeline.

**Files:**
- Modify: `src/components/Hero/Hero.module.css`
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/useHeroMotion.ts`

- [ ] **Step 1: Add `.inkOverlay` styles**

Append to `src/components/Hero/Hero.module.css`:

```css
/* ─── INK OVERLAY — entrance retraction layer ─── */
.inkOverlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: var(--c-ink);
  pointer-events: none;
  will-change: transform;
  transform-origin: right center;
}
```

- [ ] **Step 2: Add ink overlay JSX**

In `src/components/Hero/index.tsx`, inside the `<div data-pin>` block, after the `<div className={styles.grain}>` line (Task 1) and before the editorial chrome, add:

```tsx
{/* Ink overlay: covers viewport on mount, translates right to reveal mask */}
<div data-ink-overlay className={styles.inkOverlay} aria-hidden="true" />
```

It must appear above mask + grain (z-index 4 vs 2/3) but below content (z-index 10) and chrome (z-index 11–12).

- [ ] **Step 3: Replace Phase A logic in useHeroMotion.ts**

In `src/components/Hero/useHeroMotion.ts`, replace the entire `/* ── A. ENTRANCE ── */` block (lines beginning with `if (reduced) {` through the end of the entrance `tl` chain) with this:

```ts
    /* ── A. ENTRANCE ── */
    const inkOverlay = scene.querySelector("[data-ink-overlay]") as HTMLElement | null;

    if (reduced) {
      // Snap content to settled state immediately, no animation.
      // Editorial chrome (frame meta / edge label / spine / crossfade) was
      // never animated away from its natural state in this branch (the
      // timeline below never runs), so it's already correct — no manual set
      // needed for those targets.
      gsap.set(scene.querySelectorAll("[data-anim]"), {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });
      if (inkOverlay) {
        // Hide ink overlay so the settled mask is visible
        inkOverlay.style.display = "none";
      }
    } else {
      const tl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      });

      // 1. Ink overlay retracts right over 1.0s starting at 0.3s
      if (inkOverlay) {
        tl.fromTo(
          inkOverlay,
          { xPercent: 0 },
          {
            xPercent: 100,
            duration: 1.0,
            onComplete: () => {
              inkOverlay.style.display = "none";
            },
          },
          0.3
        );
      }

      // 2. Eyebrow at 0.4s
      tl.from(
        scene.querySelector("[data-anim='eyebrow']"),
        { opacity: 0, y: 14, duration: 0.7 },
        0.4
      );

      // 3. Headline words stagger from 0.5s, 0.12s between siblings
      tl.from(
        scene.querySelectorAll("[data-anim='word']"),
        { opacity: 0, y: 28, duration: 0.85, stagger: 0.12 },
        0.5
      );

      // 4. Sub paragraph at 1.05s
      tl.from(
        scene.querySelector("[data-anim='sub']"),
        { opacity: 0, y: 18, duration: 0.85 },
        1.05
      );

      // 5. CTA row at 1.2s
      tl.from(
        scene.querySelector("[data-anim='cta']"),
        { opacity: 0, y: 18, duration: 0.85 },
        1.2
      );

      // 6. Editorial chrome (frame meta, crossfade mark, edge label, spine)
      // staggered from 1.4s
      const chromeTargets = [
        scene.querySelector("[data-frame-meta]"),
        scene.querySelector("[data-anim='crossfade']"),
        scene.querySelector("[data-edge-label]"),
        scene.querySelector("[data-spine]"),
      ].filter(Boolean) as Element[];

      tl.from(
        chromeTargets,
        { opacity: 0, y: 8, duration: 0.4, stagger: 0.08 },
        1.4
      );
    }
```

- [ ] **Step 4: Add the chrome data attributes**

In `src/components/Hero/index.tsx`, add `data-frame-meta`, `data-edge-label`, and `data-spine` attributes so the timeline can target them:

```tsx
<div data-frame-meta className={styles.frameMeta} aria-hidden="true">
  <span className={styles.frameMetaPrimary}>27.04.2026 · 16:42 UTC</span>
  <span className={styles.frameMetaSecondary}>In session</span>
</div>
```

```tsx
<div data-spine className={styles.spine} aria-hidden="true">
  <span className={styles.spineNode} />
  <span className={styles.spineLine} />
  <span className={styles.spineLabel}>Project 04 · Cable-stayed · In progress</span>
</div>
```

```tsx
<div data-edge-label className={styles.edgeLabel} aria-hidden="true">
  INFRAFORMA · 2026
</div>
```

(The crossfade mark already has `data-anim="crossfade"` from Task 3.)

- [ ] **Step 5: Visual verification**

Hard reload `http://localhost:3000`. Confirm:
- On load, the entire viewport is solid ink for ~0.3s.
- Then the ink slides off to the right over ~1.0s, revealing the bridge progressively from right to left.
- Words "A specialised construction" land first, then "digital delivery partner." with the staggered cadence — the last word "partner." lands around 1.95s.
- Sub paragraph fades+lifts in around 1.05s after mount.
- CTA row appears around 1.2s.
- Editorial chrome (frame meta top-right, crossfade mark, edge label, spine) all fade in last, staggered, finishing around 2.5s.
- Total entrance feels choreographed, not "everything fades in at once."
- After the entrance, the ink overlay is gone (DevTools: confirm `display: none` on `[data-ink-overlay]`).

- [ ] **Step 6: Reduced-motion check**

In DevTools → Rendering → enable `prefers-reduced-motion: reduce`. Hard reload. Confirm:
- No ink overlay visible — page renders in settled state immediately.
- All content visible at final position; no stagger animation.
- Eyebrow dot static (Task 4 already verified).

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero/Hero.module.css src/components/Hero/index.tsx src/components/Hero/useHeroMotion.ts
git commit -m "feat(hero): phase A entrance — ink retraction + chrome stagger"
```

---

## Task 6: Phase B — replace layer 1 parallax with mask parallax + spine breath

**Goal:** During the 200vh pin, the page should feel alive. Subtle scroll-driven parallax on the mask matches the existing video parallax. The spine's blue node breathes (CSS animation, no JS).

**Files:**
- Modify: `src/components/Hero/Hero.module.css`
- Modify: `src/components/Hero/useHeroMotion.ts`

- [ ] **Step 1: Add spine node breath animation**

In `src/components/Hero/Hero.module.css`, locate the `.spineNode` block:

```css
.spineNode {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-blue-bright);
  box-shadow: 0 0 14px var(--c-blue-glow);
  flex-shrink: 0;
}
```

Replace with:

```css
.spineNode {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-blue-bright);
  box-shadow: 0 0 14px var(--c-blue-glow);
  flex-shrink: 0;
  animation: spineBreath 3s ease-in-out infinite;
}

@keyframes spineBreath {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 1.0; }
}

@media (prefers-reduced-motion: reduce) {
  .spineNode {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 2: Replace parallax layers in useHeroMotion.ts**

In `src/components/Hero/useHeroMotion.ts`, locate the existing `layers` array in the `/* ── B. SCROLL CHOREOGRAPHY ── */` block:

```ts
    const layers: { sel: string; speed: number; scale?: number }[] = [
      { sel: "[data-depth='0']", speed: 0.15 },
      { sel: "[data-depth='1']", speed: 0.30 },
    ];
```

Replace with:

```ts
    // Layer 1 was removed in Task 1; mask now carries the parallax.
    const layers: { sel: string; speed: number; scale?: number }[] = [
      { sel: "[data-depth='0']", speed: 0.15 },
      { sel: "[data-mask]", speed: 0.30 },
    ];
```

(Same scrubbed `gsap.to` loop processes both — no other change in this section.)

- [ ] **Step 3: Visual verification**

Hard reload `http://localhost:3000`. Wait for entrance to settle. Then:
- Look at the spine's blue node (bottom-left). Confirm it gently breathes — opacity oscillates between 70% and 100% over 3s.
- Slowly scroll down a few hundred pixels. Confirm the video drifts up subtly. The mask drifts up slightly faster (you'll see the dark region slide up against the video's slower motion). This is the "passing the bridge" depth feel.
- Stop scrolling. Confirm the page is still pinned (Hero fills viewport, doesn't scroll past until the pin ends).

- [ ] **Step 4: Reduced-motion check**

In DevTools → Rendering → enable `prefers-reduced-motion: reduce`. Hard reload. Confirm:
- Spine node static (no breath).
- Scrolling: the entire content drifts (existing reduced-motion behavior is `return` early — no scroll triggers created — so the page just scrolls normally).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/Hero.module.css src/components/Hero/useHeroMotion.ts
git commit -m "feat(hero): phase B settled — mask parallax + spine breath"
```

---

## Task 7: Phase C — polarity flip release into light

**Goal:** When the user scrolls past 75% of the pin, the dark Hero "burns out" into a light state. Implementation: stack a second mask (`.maskLight`) with a vertical ink-top → light-bottom gradient. Cross-fade from the horizontal-ink mask to the vertical-light mask via opacity, scrubbed. Hero content fades to 0. The spine's blue node persists across the seam.

**Files:**
- Modify: `src/components/Hero/Hero.module.css`
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/useHeroMotion.ts`

- [ ] **Step 1: Add `.maskLight` styles**

Append to `src/components/Hero/Hero.module.css`:

```css
/* ─── MASK LIGHT — phase C release gradient ─── */
.maskLight {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 11, 13, 0.97) 0%,
    rgba(10, 11, 13, 0.6) 30%,
    rgba(250, 249, 245, 0.4) 60%,
    rgba(250, 249, 245, 1) 100%
  );
  will-change: opacity;
}
```

- [ ] **Step 2: Add `.maskLight` JSX**

In `src/components/Hero/index.tsx`, immediately after the `<div data-mask>` line, add:

```tsx
{/* Phase C: vertical light gradient that cross-fades in at end of pin */}
<div data-mask-light className={styles.maskLight} aria-hidden="true" />
```

- [ ] **Step 3: Add Phase C tweens in useHeroMotion.ts**

In `src/components/Hero/useHeroMotion.ts`, immediately before the `/* Pin the scene for 200vh */` comment block, add:

```ts
    /* ── C. RELEASE — polarity flip last 25% of pin ── */
    const maskLight = scene.querySelector("[data-mask-light]");
    const mask = scene.querySelector("[data-mask]");
    if (maskLight && mask) {
      // Fade horizontal mask out, vertical light mask in
      const flipTween = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "75% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      flipTween.to(mask, { opacity: 0, ease: "none" }, 0);
      flipTween.to(maskLight, { opacity: 1, ease: "none" }, 0);
      if (flipTween.scrollTrigger) triggers.push(flipTween.scrollTrigger);
    }
```

Note: this block must come AFTER the `const triggers: ScrollTrigger[] = [];` declaration and AFTER the existing parallax loop, but BEFORE the pin trigger.

- [ ] **Step 4: Ensure content fade-out works in the same window**

The existing content drift tween fades content to `opacity: 0.2` across the full pin. Locate it in `useHeroMotion.ts`:

```ts
    /* Content drifts up + fades as user scrolls past */
    const content = scene.querySelector("[data-anim='content']");
    if (content) {
      const tween = gsap.to(content, {
        yPercent: -20,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
      const st = tween.scrollTrigger;
      if (st) triggers.push(st);
    }
```

Replace with two staged tweens — drift across the full pin, but final opacity-to-zero only during the release window:

```ts
    /* Content drifts up across the pin, then fades fully out during release */
    const content = scene.querySelector("[data-anim='content']");
    if (content) {
      const driftTween = gsap.to(content, {
        yPercent: -20,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "75% top",
          scrub: 0.4,
        },
      });
      if (driftTween.scrollTrigger) triggers.push(driftTween.scrollTrigger);

      const releaseTween = gsap.to(content, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "75% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      if (releaseTween.scrollTrigger) triggers.push(releaseTween.scrollTrigger);
    }
```

(`opacity: 0.4` at 75% so the release tween has visible distance to travel to `0`.)

- [ ] **Step 5: Ensure the spine node is NOT inside any element that fades during release**

Open `src/components/Hero/index.tsx`. Verify:
- `<div data-spine className={styles.spine}>` is a direct child of the `<div data-pin>` block (not inside `[data-anim='content']`).
- The `[data-anim='content']` selector targets only the content wrap (HeroContent's outer div).

This is already true given the existing structure — just confirm no accidental nesting was introduced. The blue node stays visible across the release because the spine container does not inherit the content's opacity tween.

- [ ] **Step 6: Visual verification**

Hard reload `http://localhost:3000`. Wait for entrance. Then:
- Slowly scroll down. Up to ~75% of the pin (about 75% of one viewport height of scroll), the page parallaxes per Task 6 — content drifts up, fades to 40%, mask drifts.
- Past 75% scroll position, observe the polarity flip:
  - The horizontal-ink mask fades out.
  - The vertical-light mask fades in. Bottom of the viewport becomes near-white, top stays dark.
  - Content (eyebrow, headline, sub, CTAs) fades all the way to 0.
  - The spine's blue node remains visible at full opacity through the entire transition.
  - At 100% pin (just before the page leaves the pin), the bottom ~40% of the viewport is light (`#FAF9F5`).
- The Promise section then appears below and the page leaves the pin.

- [ ] **Step 7: Reduced-motion check**

DevTools → Rendering → enable `prefers-reduced-motion: reduce`. Hard reload. Confirm:
- No scroll triggers fire (the `if (reduced) return;` in useHeroMotion guards Phase B and C).
- Hero is statically rendered in its settled state. Promise appears below as a normal scroll.

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero/Hero.module.css src/components/Hero/index.tsx src/components/Hero/useHeroMotion.ts
git commit -m "feat(hero): phase C release — polarity flip into light"
```

---

## Task 8: Mobile (≤980px) — static vertical mask, no animation

**Goal:** On mobile viewports, simplify. Existing `@media (max-width: 980px)` already hides chrome. Now also: replace the horizontal mask with a static vertical gradient (dark top → clearer bottom), skip the ink-retraction entrance, and skip Phase B/C scroll tweens. Page should render legibly with content over a vertical-faded video.

**Files:**
- Modify: `src/components/Hero/Hero.module.css`
- Modify: `src/components/Hero/useHeroMotion.ts`

- [ ] **Step 1: Override mask gradient on mobile**

In `src/components/Hero/Hero.module.css`, locate the existing `@media (max-width: 980px)` block (Task 3 added `.crossfade` to its hide list). Append within the same media query block:

```css
@media (max-width: 980px) {
  .frameMeta,
  .spine,
  .edgeLabel,
  .crossfade {
    display: none;
  }

  /* Vertical-mask variant for mobile */
  .mask {
    background: linear-gradient(
      180deg,
      rgba(10, 11, 13, 0.9) 0%,
      rgba(10, 11, 13, 0.55) 45%,
      rgba(10, 11, 13, 0.2) 75%,
      rgba(10, 11, 13, 0) 100%
    );
  }

  /* Hide ink overlay — page renders in settled state on mobile */
  .inkOverlay {
    display: none;
  }

  /* Hide phase C light mask — no release flip on mobile */
  .maskLight {
    display: none;
  }
}
```

- [ ] **Step 2: Add a mobile guard in useHeroMotion.ts**

In `src/components/Hero/useHeroMotion.ts`, near the top of the `useEffect`, after the `if (!scene) return;` line and before the `const reduced = prefersReducedMotion();` line, add:

```ts
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 980px)").matches;
```

Then update the early-snap branch and the scroll-trigger gate. Locate this section (currently at the top of Phase A logic from Task 5):

```ts
    if (reduced) {
      // Snap to settled state immediately, no animation
      ...
    }
```

Change the condition to:

```ts
    if (reduced || isMobile) {
      // Snap to settled state immediately, no animation
      ...
    }
```

Locate the Phase B gate (existing line):

```ts
    /* ── B. SCROLL CHOREOGRAPHY ── */
    if (reduced) return;
```

Change to:

```ts
    /* ── B. SCROLL CHOREOGRAPHY ── */
    if (reduced || isMobile) return;
```

(Mobile gets no parallax, no flip — but the pin still applies because it's set up after this `return`. Wait — the existing structure has the pin trigger AFTER the parallax block. Confirm the pin should ALSO be skipped on mobile.)

- [ ] **Step 3: Skip pin on mobile**

Pinning the Hero for 200vh on mobile is hostile (no fancy choreography to justify it). Locate the pin block:

```ts
    /* Pin the scene for 200vh */
    const pinTrigger = ScrollTrigger.create({
      trigger: scene,
      start: "top top",
      end: "+=100%",
      pin: scene.querySelector("[data-pin]") as Element,
      pinSpacing: true,
      anticipatePin: 1,
    });
    triggers.push(pinTrigger);
```

Since the `if (reduced || isMobile) return;` from Step 2 already short-circuits before reaching this block, the pin is skipped automatically. **However**, the Hero scene is `200vh` tall by CSS — on mobile we don't want a 200vh scene with no pin (it'd just be 200vh of dead scroll). Update `.scene` height on mobile.

Append to the existing `@media (max-width: 980px)` block in `Hero.module.css`:

```css
  /* Single-viewport scene on mobile (no pin) */
  .scene {
    height: 100vh;
  }
  .pin {
    height: 100vh;
  }
```

- [ ] **Step 4: Visual verification**

In a desktop browser, open DevTools → device toolbar → set viewport to 375×812 (iPhone 13). Hard reload `http://localhost:3000`. Confirm:
- Hero is one viewport tall (not 200vh).
- Mask is a vertical gradient: dark at the top, clearer toward the bottom.
- Video is visible in the lower portion.
- All editorial chrome (frame meta, edge label, spine, crossfade) is hidden.
- Content (eyebrow, headline, sub, CTAs) renders at the bottom in its mobile clamp.
- No entrance animation — page is static at settled state immediately.
- Scrolling: Hero scrolls past normally (no pin), Promise appears below.

- [ ] **Step 5: Visual verification — desktop unchanged**

Restore desktop viewport. Hard reload. Confirm everything from Tasks 1–7 still works (entrance, parallax, release).

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/Hero.module.css src/components/Hero/useHeroMotion.ts
git commit -m "feat(hero): mobile simplification — vertical mask, no pin, no animation"
```

---

## Task 9: Final QA + accessibility + build verification

**Goal:** Confirm the implementation hits the design's acceptance criteria. Run the production build, check accessibility, and walk through every acceptance criterion from the spec.

**Files:** none modified — this is verification only.

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: build completes without TypeScript errors or warnings. If errors appear, return to the relevant task and fix.

- [ ] **Step 2: Run production server**

```bash
npm start
```

Open `http://localhost:3000` in a fresh browser tab.

- [ ] **Step 3: Walk acceptance criteria from the spec**

For each acceptance criterion in [docs/superpowers/specs/2026-04-27-hero-dual-exposure-design.md §8](../specs/2026-04-27-hero-dual-exposure-design.md), confirm the behavior:

1. **Visual** — first frame shows ink → footage transition with a clear blended zone. Type sits cleanly in dark. Bridge unmistakably visible on the right. ✓ / ✗
2. **Motion** — entrance feels choreographed (mask retracts, words land in sequence, chrome arrives last). No motion looks like a default GSAP fade. ✓ / ✗
3. **Hold** — when idle, page breathes (eyebrow pulse + spine breath + parallax + grain) without churning attention. ✓ / ✗
4. **Release** — scrolling past the pin, dark Hero releases into a light state with the blue spine node persisting. ✓ / ✗
5. **Reduced motion** — with `prefers-reduced-motion`, Hero is fully readable as static composition; no flash of unmasked video on load. ✓ / ✗
6. **Accessibility** — headline is one `<h1>`, CTAs have visible focus rings, decorative chrome carries `aria-hidden="true"`. ✓ / ✗

If any criterion fails, return to the corresponding task and fix.

- [ ] **Step 4: Tab-key audit**

On the desktop production page, press Tab repeatedly from the address bar. Confirm focus rings appear on:
- Topbar brand link
- Each nav link
- Topbar "Get in touch" CTA
- Hero "Read the practice" CTA
- Hero "View work" CTA

Focus ring should be the existing global focus ring (`outline: 2px solid var(--c-blue-bright)`). No focus on decorative chrome (frame meta, crossfade mark, edge label, spine).

- [ ] **Step 5: Performance spot-check**

Open DevTools → Performance → Record. Hard reload, let entrance complete, scroll through pin. Stop recording. In the flame chart:
- Confirm no long tasks > 50ms during entrance.
- Confirm scroll FPS stays ≥55 during the pin scrub.
- Confirm no layout thrash on the mask (look for many "Layout" yellow bars stacked).

If FPS dips below 55 during scroll, the `gradient-stops being interpolated` regression is the most likely culprit — re-confirm Task 5/Task 7 used the documented technique (translate ink overlay; cross-fade two stacked masks via opacity).

- [ ] **Step 6: Commit (if any fixes were made above)**

If steps 3–5 surfaced issues that required code changes, commit each fix individually (one commit per fixed criterion). If everything passes cleanly, no commit is needed for this task.

- [ ] **Step 7: Final state check**

```bash
git log --oneline
```

Expected: one commit per task (Task 1–8) plus any from Step 6 of this task. Working tree should be clean.

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

---

## Out of scope

- The Promise component redesign — separate brainstorm cycle planned (`promise-light-handoff` next).
- The Hero ↔ Promise stitching mechanics (sticky shared element, persistent header, etc.). Hero only commits to ending in `light-bottom + content-faded + spine-node-persisting` per spec §4 Phase C.
- Performance optimization beyond hitting 55fps. If the live build is borderline, a separate performance task is appropriate.
- Mobile design beyond the simplified mask described in Task 8. Anything more ambitious for mobile is a separate cycle.

## Spec coverage check

| Spec section | Implementing task |
|---|---|
| §2 Composition · mask gradient | Task 1 |
| §2 Composition · film grain | Task 1 |
| §3 Editorial chrome · Frame meta restyle | Task 2 |
| §3 Editorial chrome · Edge label restyle | Task 2 |
| §3 Editorial chrome · Spine restyle | Task 2 |
| §3 Editorial chrome · Crossfade mark | Task 3 |
| §3 Editorial chrome · Eyebrow pulse | Task 4 |
| §4 Phase A entrance | Task 5 |
| §4a Mask retraction technique | Task 5 |
| §4 Phase B settled — parallax | Task 6 |
| §4 Phase B settled — spine breath | Task 6 |
| §4 Phase C release | Task 7 |
| §4 Reduced motion | Task 5 (entrance), Task 6 (scroll), Task 8 (mobile) |
| §7 Mobile simplification | Task 8 |
| §7 Performance budget | Task 9 (Step 5) |
| §8 Acceptance criteria | Task 9 (Step 3) |
