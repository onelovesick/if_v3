import styles from "./Grain.module.css";

/**
 * Page-wide grain. Mount once at the root.
 */
export default function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
