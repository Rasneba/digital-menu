/**
 * Subtle haptic feedback for page turns and control presses.
 * No-ops silently on devices without the Vibration API (e.g. iOS Safari,
 * desktops).
 */
export function haptic(pattern: number | number[] = 10): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* haptics are best-effort */
  }
}
