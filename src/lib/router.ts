import { useEffect, useState } from "react";

const listeners = new Set<() => void>();

/** Client side navigation — no page reload, works on any static host. */
export function navigate(to: string) {
  if (window.location.pathname !== to) {
    window.history.pushState({}, "", to);
  }
  listeners.forEach((listener) => listener());
}

export function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  );

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", update);
    listeners.add(update);
    return () => {
      window.removeEventListener("popstate", update);
      listeners.delete(update);
    };
  }, []);

  return pathname;
}
