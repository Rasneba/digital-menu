/**
 * Session-scoped storage helpers. All access is guarded — private browsing
 * modes and locked-down WebViews can throw on read/write.
 */
export function readSessionNumber(key: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeSessionNumber(key: string, value: number): void {
  try {
    window.sessionStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable */
  }
}

export function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* storage unavailable */
  }
}
