/**
 * Returns true if the user has requested reduced motion.
 * Safe on the server (returns false during SSR).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
