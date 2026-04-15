import Hero from "@/components/Hero";
import styles from "./TopScene.module.css";

export default function TopScene() {
  return (
    <div className={styles.scene}>
      <Hero />
    </div>
  );
}
