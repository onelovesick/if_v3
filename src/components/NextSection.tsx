/**
 * Placeholder section directly under the hero. Pulled up under the dark hero's
 * bottom bleed via negative margin and a clipped diagonal top edge so the
 * dark scene flows into white instead of cutting.
 *
 * The body of this section is intentionally empty — real content for the next
 * section is out of scope for this build (per PROMPT.md).
 */
export default function NextSection() {
  return (
    <section
      aria-label="Below hero"
      style={{
        position: "relative",
        zIndex: 2,
        marginTop: "-120px",
        background: "var(--c-white)",
        clipPath: "polygon(0 60px, 100% 0, 100% 100%, 0 100%)",
        WebkitClipPath: "polygon(0 60px, 100% 0, 100% 100%, 0 100%)",
        minHeight: "60vh",
      }}
    >
      {/* Next section content goes here. */}
    </section>
  );
}
