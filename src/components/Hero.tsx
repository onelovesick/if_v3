"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import styles from "./Hero.module.css";

const DETAIL_RAIL = [
  { label: "Asset Class", value: "Major infrastructure" },
  { label: "Standard", value: "ISO 19650 aligned" },
  { label: "Mode", value: "Live coordination" },
];

const SIGNAL_ROWS = [
  {
    label: "Design geometry",
    text: "Align model, issue sets, and approval states around a single controlled geometry thread.",
  },
  {
    label: "Package interfaces",
    text: "Expose where structural, civil, commercial, and delivery packages actually collide.",
  },
  {
    label: "Field delivery",
    text: "Translate live information into actions site teams can trust when the work is moving fast.",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const introItems = section.querySelectorAll("[data-reveal]");

      gsap.from(introItems, {
        y: 36,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.14,
      });

      gsap.from(`.${styles.signalCard}`, {
        y: 54,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        delay: 0.28,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.74,
      });

      gsap.to(`.${styles.content}`, {
        y: -54,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.78,
        },
      });

      gsap.to(`.${styles.signalColumn}`, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={`${styles.inner} page-container`}>
        <div className={styles.content}>
          <p className={styles.eyebrow} data-reveal>
            Cable-Stayed Bridge / Structured Delivery Environment
          </p>

          <h1 className={styles.headline} data-reveal>
            From fragmented flow to controlled delivery.
          </h1>

          <p className={styles.body} data-reveal>
            Complex programmes generate information from every direction.
            Infraforma shapes that flow into a delivery environment teams can
            manage, trust, and execute against.
          </p>

          <div className={styles.actions} data-reveal>
            <a className="btn btn-primary" href="#delivery-environment">
              Explore the framework
            </a>
            <a className="btn btn-outline" href="#proof">
              See why it works
            </a>
          </div>

          <div className={styles.detailRail} data-reveal>
            {DETAIL_RAIL.map((item) => (
              <div key={item.label} className={styles.detailItem}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.signalColumn}>
          <aside className={styles.signalCard} aria-label="Delivery signal overview">
            <div className={styles.cardHeader}>
              <span className={styles.cardKicker}>Bridge Delivery Signal</span>
              <span className={styles.cardStatus}>
                <span className={styles.cardStatusDot} />
                Live
              </span>
            </div>

            <div className={styles.cardTrack}>
              {SIGNAL_ROWS.map((item, index) => (
                <div key={item.label} className={styles.cardRow}>
                  <span className={styles.cardNumber}>0{index + 1}</span>
                  <div>
                    <p className={styles.cardLabel}>{item.label}</p>
                    <p className={styles.cardText}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.cardFootnote}>
              Built for bridge systems, industrial packages, and major
              infrastructure teams working across design, field, and governance.
            </p>
          </aside>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll to see the flow</span>
      </div>
    </section>
  );
}
