"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionReady } from "@/components/MotionProvider";
import styles from "./Practice.module.css";

export default function Practice() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ready } = useMotionReady();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !ready) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const wash = root.querySelector(`.${CSS.escape(styles.wash)}`) as HTMLElement | null;

      if (reduce) {
        if (wash) wash.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
        setCount(55);
        return;
      }

      if (wash) {
        gsap.to(wash, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "top 5%",
            scrub: 0.6,
          },
        });
      }

      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: 55,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => setCount(Math.floor(obj.val)),
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="practice"
      data-section
      data-tone="dark"
      data-dark
      className={styles.section}
    >
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.inner}>
        <span className={`${styles.eyebrow} ${styles.eyebrowDark}`}>
          <strong>S5</strong> · The Practice
        </span>

        <div className={styles.head}>
          <h2>
            Built on <em>{count}</em> years of senior practice across the
            programs the country can&rsquo;t afford to fail.
          </h2>
          <p>
            A small team with deep tenure. Worked across every major
            Canadian designer and constructor, on flagship programs in
            transit, energy, civil, and buildings.
          </p>
        </div>

        <div className={styles.matrix}>
          <div className={styles.col}>
            <span className={styles.colHead}>Who we work with</span>
            <ul>
              <li>Owners &amp; operators</li>
              <li>Engineering &amp; design firms</li>
              <li>Architects</li>
              <li>General contractors</li>
              <li>Subcontractors &amp; trades</li>
              <li>Multidisciplinary teams</li>
            </ul>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>Industries</span>
            <ul>
              <li>Transportation</li>
              <li>Energy</li>
              <li>Civil infrastructure</li>
              <li>Buildings</li>
              <li>Industrial</li>
            </ul>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>How we practice</span>
            <ul>
              <li>Neutral between parties</li>
              <li>ISO 19650 aligned</li>
              <li>Senior-led delivery</li>
              <li>Embedded in the program</li>
              <li>From brief through operations</li>
              <li>Quebec City · Montreal · Ottawa</li>
            </ul>
          </div>
        </div>

        <p className={styles.quote}>
          We take real data, structure it, and turn it into access, insight,
          and decision support.
        </p>
      </div>
    </section>
  );
}
