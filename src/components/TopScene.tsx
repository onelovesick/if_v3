import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import styles from "./TopScene.module.css";

export default function TopScene() {
  return (
    <div className={styles.scene}>
      <Hero />
      <Problem />
    </div>
  );
}
