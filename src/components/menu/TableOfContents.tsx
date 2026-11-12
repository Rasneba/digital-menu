import { useEffect, useRef } from "react";
import { brand, categories, TOTAL_PAGES } from "@/data/menu";
import { cn } from "@/utils/cn";
import { haptic } from "@/utils/haptics";

interface TableOfContentsProps {
  /** Current (first) page index of the visible spread — for highlight */
  currentIndex: number;
  /** Active chapter (0-based) or -1 when on cover/colophon */
  activeCategory: number;
  onGoTo: (index: number) => void;
  onClose: () => void;
}

/**
 * Bottom-sheet table of contents. Rows are the printed chapters of the
 * book; tapping one flips the book straight to that chapter's plate page.
 */
export function TableOfContents({
  currentIndex,
  activeCategory,
  onGoTo,
  onClose,
}: TableOfContentsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  /* Scroll the active entry into view when the sheet opens */
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    try {
      active?.scrollIntoView({ block: "center", behavior: "auto" });
    } catch {
      /* older engines */
    }
  }, []);

  /* Escape closes */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (index: number) => {
    haptic(8);
    onGoTo(index);
    onClose();
  };

  const rows = [
    {
      key: "cover",
      index: 0,
      numeral: "✦",
      title: "Cover",
      sub: `${brand.volume} · ${brand.season}`,
      page: "1",
      active: currentIndex === 0,
    },
    ...categories.map((category, i) => ({
      key: category.id,
      index: 1 + i * 2,
      numeral: category.numeral,
      title: category.title,
      sub: category.tagline,
      page: `${2 + i * 2}–${3 + i * 2}`,
      active: activeCategory === i,
    })),
    {
      key: "colophon",
      index: TOTAL_PAGES - 1,
      numeral: "—",
      title: "Colophon",
      sub: "Thank you & house notes",
      page: String(TOTAL_PAGES),
      active: currentIndex >= TOTAL_PAGES - 1,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label="Table of contents"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close table of contents"
        onClick={onClose}
        className="sheet-fade absolute inset-0 cursor-default bg-ink/70 backdrop-blur-[3px]"
      />

      {/* sheet */}
      <div className="sheet-up absolute inset-x-0 bottom-0 flex max-h-[78dvh] flex-col overflow-hidden rounded-t-2xl border border-gold/20 border-b-0 bg-[#14100c] shadow-[0_-18px_60px_-20px_rgba(0,0,0,0.8)] sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:w-[30rem] sm:-translate-x-1/2 sm:rounded-2xl sm:border-b">
        {/* grab handle (mobile) */}
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gold/25 sm:hidden" />

        <header className="flex shrink-0 items-center justify-between gap-4 px-5 pb-2 pt-3 sm:px-6 sm:pt-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.5em] text-gold/55">
              {brand.name} · {brand.city}
            </p>
            <h2 className="mt-0.5 font-display text-xl text-paper/95">
              Table of Contents
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-paper/70 transition hover:border-gold/50 hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

        <div ref={listRef} className="quiet-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {rows.map((row) => (
            <button
              key={row.key}
              type="button"
              data-active={row.active}
              onClick={() => go(row.index)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200",
                row.active ? "bg-gold/[0.09]" : "hover:bg-gold/[0.05]",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-sm transition-colors",
                  row.active
                    ? "border-gold/60 text-gold"
                    : "border-gold/15 text-gold/55 group-hover:border-gold/35 group-hover:text-gold/80",
                )}
              >
                {row.numeral}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-[13px] font-medium tracking-wide transition-colors",
                    row.active ? "text-gold" : "text-paper/88 group-hover:text-paper",
                  )}
                >
                  {row.title}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-paper/40">
                  {row.sub}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 text-[9px] uppercase tracking-[0.28em] tabular-nums",
                  row.active ? "text-gold/80" : "text-paper/35",
                )}
              >
                {row.page}
              </span>
            </button>
          ))}
        </div>

        <p className="shrink-0 border-t border-gold/10 px-5 py-2.5 text-center text-[8px] uppercase tracking-[0.3em] text-paper/30">
          All prices inclusive of 5% SC &amp; 15% VAT
        </p>
      </div>
    </div>
  );
}
