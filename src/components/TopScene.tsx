import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import FlowCompare from "@/components/FlowCompare";
import styles from "./TopScene.module.css";

export default function TopScene() {
  return (
    <div className={styles.scene}>
      <Hero />
      <Statement />
      <FlowCompare />
    </div>
  );
}
