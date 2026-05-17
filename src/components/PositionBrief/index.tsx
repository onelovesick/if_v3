"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./PositionBrief.module.css";

// useLayoutEffect emits a warning during SSR; fall back to useEffect
// on the server so the warning is silenced. On the client this still
// runs synchronously before paint.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HEADLINE_LINES = [
  "We connect the people, data, and",
  "the decisions behind critical",
  "infrastructure projects.",
];
const SUBHEAD = "A governed information structure from design to handover.";

const cards = [
  {
    label: "Process",
    body: [
      "We map how the project runs: teams, systems, and where decisions are made.",
      "Then we define the digital delivery structure: governance, workflows, platforms, data. A clearer operating system from design to operations.",
    ],
    href: "#layers",
  },
  {
    label: "Company",
    body: [
      "A digital delivery partner for complex infrastructure programs.",
      "We sit between owners, designers, contractors, and operators, pairing infrastructure experience with BIM and information strategy across the full lifecycle.",
    ],
    href: "#howwework",
  },
];

function splitWords(text: string) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className={styles.wordMask}>
        <span className={styles.wordInner}>{word}</span>
      </span>
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}

// Hacker-style scramble effect for short text strings.
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomScramble(text: string) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " " || ch === "\n") {
      out += ch;
    } else {
      out +=
        SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
  }
  return out;
}

function scrambleResolve(
  el: HTMLElement,
  finalText: string,
  duration: number,
) {
  const start = performance.now();
  const len = finalText.length;

  function step(now: number) {
    const t = Math.min((now - start) / duration, 1);
    // Characters resolve from left to right, slightly faster than
    // linear so the tail of the string settles quickly.
    const resolved = Math.floor(t * (len + 4));
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = finalText[i];
      if (i < resolved || ch === " " || ch === "\n") {
        out += ch;
      } else {
        out +=
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = finalText;
    }
  }

  requestAnimationFrame(step);
}

export default function PositionBrief() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();

  // Pre-scramble the cell labels synchronously on mount, before the
  // first paint, so they are already random characters by the time
  // the cells fade in. This guarantees the user sees the scramble
  // effect resolve, not the final word.
  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const labels = root.querySelectorAll<HTMLElement>(
      `.${CSS.escape(styles.cellLabel)}`,
    );
    labels.forEach((el) => {
      if (!el.hasAttribute("data-final")) {
        el.setAttribute("data-final", el.textContent ?? "");
      }
      el.textContent = randomScramble(el.getAttribute("data-final") ?? "");
    });
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wordInners = root.querySelectorAll(
      `.${CSS.escape(styles.wordInner)}`,
    );
    const photo = root.querySelector(`.${CSS.escape(styles.photoImg)}`);
    const curtain = root.querySelector(`.${CSS.escape(styles.photoCurtain)}`);
    const coords = root.querySelectorAll(`.${CSS.escape(styles.coordItem)}`);
    const cells = root.querySelectorAll(`.${CSS.escape(styles.cell)}`);
    const titleLineSweeps = root.querySelectorAll<HTMLElement>(
      `.${CSS.escape(styles.titleLineSweep)}`,
    );
    const cellLabels = Array.from(
      root.querySelectorAll<HTMLElement>(`.${CSS.escape(styles.cellLabel)}`),
    );
    const cardsEl = root.querySelector<HTMLElement>(
      `.${CSS.escape(styles.cards)}`,
    );

    // Remember the final label text so we can resolve back to it once
    // the scramble starts. Don't mutate the label text yet — that
    // happens at the moment the cards enter the viewport.
    cellLabels.forEach((el) => {
      if (!el.hasAttribute("data-final")) {
        el.setAttribute("data-final", el.textContent ?? "");
      }
    });

    // Labels are pre-scrambled by useIsoLayoutEffect, so by the time
    // the cells fade in the user already sees random chars. This
    // observer just triggers the resolution back to the real word.
    // Threshold is low so the resolve kicks off as soon as the cards
    // peek into view; the cells' opacity fade lines up with the
    // first half of the scramble so the user clearly sees both.
    let scrambleFired = false;
    const observer =
      cardsEl && !reduce && cellLabels.length
        ? new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting || scrambleFired) return;
              scrambleFired = true;
              cellLabels.forEach((el, i) => {
                const final = el.getAttribute("data-final") ?? "";
                el.textContent = randomScramble(final);
                window.setTimeout(
                  () => scrambleResolve(el, final, 1800),
                  i * 280,
                );
              });
              observer?.disconnect();
            },
            { threshold: 0.05 },
          )
        : null;
    if (observer && cardsEl) observer.observe(cardsEl);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(wordInners, { y: 0 });
        if (curtain) gsap.set(curtain, { yPercent: 100 });
        return;
      }

      // Scroll-driven cube reveal: image clip-path expands from
      // top-left to bottom-right while the crosshair and coordinate
      // readouts follow the bottom-right edge of the visible cube
      // and the coord numbers count up.
      const crossImg = root.querySelector(
        `.${CSS.escape(styles.photoClip)}`,
      ) as HTMLElement | null;
      const crossOverlay = root.querySelector(
        `.${CSS.escape(styles.crossOverlay)}`,
      ) as HTMLElement | null;
      const coordXEl = root.querySelector(
        `.${CSS.escape(styles.coordX)}`,
      ) as HTMLElement | null;
      const coordYEl = root.querySelector(
        `.${CSS.escape(styles.coordY)}`,
      ) as HTMLElement | null;

      const pad4 = (n: number) => String(Math.round(n)).padStart(4, "0");

      const photoPaneEl = root.querySelector(
        `.${CSS.escape(styles.photoPane)}`,
      ) as HTMLElement | null;

      // PHASE_SPLIT controls how much of the scroll is spent on the
      // approach (cross travels from section top-left to image
      // top-left) vs the reveal (cross travels across the image while
      // it unwinds). 0.18 = first 18% is approach, remainder is reveal.
      const PHASE_SPLIT = 0.18;

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "top top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;

          // Measure section + photo positions each frame so resizes
          // stay accurate without an explicit refresh listener.
          if (!photoPaneEl) return;
          const sectionRect = root.getBoundingClientRect();
          const photoRect = photoPaneEl.getBoundingClientRect();
          const imageX = photoRect.left - sectionRect.left;
          const imageY = photoRect.top - sectionRect.top;
          const imageW = photoRect.width;
          const imageH = photoRect.height;

          let cx: number;
          let cy: number;
          let inset: number;
          let revealP: number; // reveal progress for clip-path

          if (p < PHASE_SPLIT) {
            // Phase 1: cross approaches image's top-left corner. The
            // image stays fully clipped.
            const ph = p / PHASE_SPLIT;
            cx = imageX * ph;
            cy = imageY * ph;
            inset = 100;
            revealP = 0;
          } else {
            // Phase 2: cross traverses the image's diagonal while the
            // image unwinds from top-left to bottom-right.
            const ph = (p - PHASE_SPLIT) / (1 - PHASE_SPLIT);
            cx = imageX + imageW * ph;
            cy = imageY + imageH * ph;
            inset = 100 * (1 - ph);
            revealP = ph;
          }

          if (crossImg) {
            crossImg.style.clipPath = `inset(0 ${inset}% ${inset}% 0)`;
          }
          if (photo) {
            const scale = 1.12 - 0.12 * revealP;
            (photo as HTMLImageElement).style.transform = `scale(${scale.toFixed(4)})`;
          }
          if (crossOverlay) {
            crossOverlay.style.setProperty("--cx", `${cx.toFixed(2)}px`);
            crossOverlay.style.setProperty("--cy", `${cy.toFixed(2)}px`);
          }
          if (coordXEl) {
            coordXEl.textContent = `X: ${pad4(1250 * p)}`;
          }
          if (coordYEl) {
            coordYEl.textContent = `Y: ${pad4(1285 * p)}`;
          }
        },
      });
      if (curtain) gsap.set(curtain, { display: "none" });

      if (coords.length) {
        gsap.from(coords, {
          opacity: 0,
          y: 4,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.1,
          delay: 1.1,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      gsap.to(wordInners, {
        y: 0,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // Cards fade up. Label scramble is handled separately via the
      // IntersectionObserver above so it fires regardless of whether
      // GSAP's scrollTrigger onEnter would have fired.
      gsap.from(cells, {
        opacity: 0,
        y: 28,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root,
          start: "top 55%",
          toggleActions: "play none none none",
        },
      });

      // Title: per-line black sweep. Each line's panel slides off to
      // the right, staggered top-to-bottom.
      if (titleLineSweeps.length) {
        gsap.fromTo(
          titleLineSweeps,
          { xPercent: 0 },
          {
            xPercent: 101,
            duration: 1.1,
            ease: "power3.inOut",
            stagger: 0.18,
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="position"
      data-section
      data-tone="light"
      className={styles.section}
      aria-labelledby="position-brief-title"
    >
      {/* Cross overlay spans the entire section so the crosshair can
          start from the section's top-left corner, travel diagonally
          to the photo's top-left, and continue across the photo. */}
      <div className={styles.crossOverlay} aria-hidden="true">
        <span className={`${styles.crossLine} ${styles.crossLineV}`} />
        <span className={`${styles.crossLine} ${styles.crossLineH}`} />
        <span className={styles.crossPoint} />
        <span className={`${styles.coordItem} ${styles.coordY}`}>Y: 0000</span>
        <span className={`${styles.coordItem} ${styles.coordX}`}>X: 0000</span>
      </div>

      <div className={styles.shell}>
        <div className={styles.grid}>
          {/* LEFT — image with clip-path reveal */}
          <div className={styles.photoCol}>
            <figure className={styles.photoPane}>
              <div className={styles.photoClip}>
                <img
                  className={styles.photoImg}
                  src="/section2.jpg"
                  alt="Infrastructure project context"
                  loading="lazy"
                />
              </div>
              <span className={styles.photoCurtain} aria-hidden="true" />
            </figure>
          </div>

          {/* RIGHT — headline / subhead bracket + 2 cards */}
          <div className={styles.contentCol}>
            <div className={styles.statement}>
              <h2 id="position-brief-title" className={styles.title}>
                {HEADLINE_LINES.map((line, i) => (
                  <span key={i} className={styles.titleLine}>
                    <span className={styles.titleLineText}>{line}</span>
                    <span
                      className={styles.titleLineSweep}
                      aria-hidden="true"
                    />
                  </span>
                ))}
              </h2>
              <p className={styles.subhead}>{splitWords(SUBHEAD)}</p>
            </div>

            <div className={styles.rule} aria-hidden="true" />

            <div className={styles.cards}>
              {cards.map((c) => (
                <article key={c.label} className={styles.cell}>
                  <div className={styles.cellHead}>
                    <span className={styles.cellLabel}>{c.label}</span>
                    <span className={styles.cellMark} aria-hidden="true" />
                  </div>

                  <div className={styles.cellBodyStack}>
                    {c.body.map((para, i) => (
                      <p key={i} className={styles.cellBody}>{para}</p>
                    ))}
                  </div>

                  <a className={styles.cellCta} href={c.href}>
                    <span>Learn more</span>
                    <span aria-hidden="true" className={styles.cellArr}>
                      &rarr;
                    </span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
