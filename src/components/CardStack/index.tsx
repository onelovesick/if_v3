"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import styles from "./CardStack.module.css";

type Card = {
  eyebrow: string;
  title: string;
  body: string;
  link: { label: string; href: string };
  image: { src: string; alt: string; caption: string };
  flip?: boolean;
};

const CARDS: Card[] = [
  {
    eyebrow: "Capabilities",
    title: "Engineering through operations, on one platform.",
    body: "Models, drawings, schedules, progress, and quality data, coordinated across every discipline and every stage. From concept through asset handover.",
    link: { label: "Explore the platform", href: "#capabilities-detail" },
    image: {
      src: "https://images.pexels.com/photos/6032899/pexels-photo-6032899.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Bridge structure under construction",
      caption: "Cable-stay erection · BIM model linked to 4D schedule",
    },
  },
  {
    eyebrow: "Sectors",
    title: "Built for the programmes that move continents.",
    body: "Bridges, transit, highways, tunnels, water, energy. The infrastructure that has to be right the first time.",
    link: { label: "See sectors", href: "#sectors" },
    image: {
      src: "https://images.pexels.com/photos/15450239/pexels-photo-15450239.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Aerial view of an elevated highway interchange",
      caption: "Multi-level interchange · ISO 19650 compliant CDE",
    },
    flip: true,
  },
  {
    eyebrow: "Programme",
    title: "One source of truth. Every stakeholder.",
    body: "Owners, contractors, designers, and operators working from the same data, with role-based access, full audit trail, and ISO 19650 by default.",
    link: { label: "How it works", href: "#programme" },
    image: {
      src: "https://images.pexels.com/photos/35259449/pexels-photo-35259449.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Industrial energy infrastructure",
      caption: "Multi-asset energy programme · 2,400 active models",
    },
  },
];

export default function CardStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const t = gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 1.0,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} id="capabilities" className={styles.section}>
      <div className={styles.inner}>
        {CARDS.map((card, i) => (
          <article
            key={i}
            data-reveal
            className={`${styles.card} ${card.flip ? styles.flip : ""}`}
          >
            <div className={styles.text}>
              <span className={styles.eyebrow}>{card.eyebrow}</span>
              <h2 className={styles.title}>{card.title}</h2>
              <p className={styles.body}>{card.body}</p>
              <a href={card.link.href} className={styles.link}>
                {card.link.label} <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className={styles.photo}>
              <img src={card.image.src} alt={card.image.alt} loading="lazy" />
              <span className={styles.photoCaption}>{card.image.caption}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
