import Image from "next/image";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import styles from "./TopScene.module.css";

const CALLOUTS = [
  {
    className: styles.calloutUpper,
    label: "Axis C-17",
    text: "Cable array",
  },
  {
    className: styles.calloutCenter,
    label: "Package 04",
    text: "Bridge systems",
  },
  {
    className: styles.calloutLower,
    label: "Survey control",
    text: "Live coordination",
  },
];

export default function TopScene() {
  return (
    <div className={styles.scene}>
      <div className={styles.media} aria-hidden="true">
        <Image
          src="/images/bridge-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.imageTint} />
        <div className={styles.skyVeil} />
        <div className={styles.signalSweep} />
        <div className={styles.mesh} />
        <div className={styles.verticalDatum} />
        <div className={styles.bottomFade} />

        {CALLOUTS.map((callout) => (
          <div key={callout.label} className={`${styles.callout} ${callout.className}`}>
            <span>{callout.label}</span>
            <strong>{callout.text}</strong>
          </div>
        ))}
      </div>

      <Hero />
      <Statement />
    </div>
  );
}
