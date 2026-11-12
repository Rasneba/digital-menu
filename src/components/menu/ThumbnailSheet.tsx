import { useEffect } from "react";
import {
  brand,
  categories,
  formatPrice,
  TOTAL_PAGES,
  type Currency,
} from "@/data/menu";
import { Monogram } from "@/components/Brand";
import { cn } from "@/utils/cn";
import { haptic } from "@/utils/haptics";

interface ThumbnailSheetProps {
  /** Current (first) page index of the visible spread */
  currentIndex: number;
  orientation: "portrait" | "landscape";
  currency: Currency;
  onGoTo: (index: number) => void;
  onClose: () => void;
}

/**
 * Lightweight, fully designed miniature previews of the printed pages.
 * They render typographically (no extra image requests) so the grid
 * opens instantly even on low-end phones.
 */
export function ThumbnailSheet({
  currentIndex,
  orientation,
  currency,
  onGoTo,
  onClose,
}: ThumbnailSheetProps) {
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

  const isActive = (index: number) =>
    currentIndex === index || (orientation === "landscape" && currentIndex + 1 === index);

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label="Page thumbnails"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close page thumbnails"
        onClick={onClose}
        className="sheet-fade absolute inset-0 cursor-default bg-ink/70 backdrop-blur-[3px]"
      />

      {/* sheet */}
      <div className="sheet-up absolute inset-x-0 bottom-0 flex max-h-[74dvh] flex-col overflow-hidden rounded-t-2xl border border-gold/20 border-b-0 bg-[#14100c] shadow-[0_-18px_60px_-20px_rgba(0,0,0,0.8)] sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:w-[38rem] sm:-translate-x-1/2 sm:rounded-2xl sm:border-b">
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-gold/25 sm:hidden" />

        <header className="flex shrink-0 items-center justify-between gap-4 px-5 pb-2 pt-3 sm:px-6 sm:pt-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.5em] text-gold/55">
              Flip to a page
            </p>
            <h2 className="mt-0.5 font-display text-xl text-paper/95">All Pages</h2>
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

        <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

        <div className="quiet-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 sm:gap-3">
            {Array.from({ length: TOTAL_PAGES }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => go(index)}
                aria-label={`Go to page ${index + 1}`}
                aria-current={isActive(index) ? "page" : undefined}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "relative block aspect-[11/16] w-full overflow-hidden rounded-[4px] border transition-all duration-200",
                    isActive(index)
                      ? "border-gold/70 shadow-[0_0_0_2px_rgba(200,164,78,0.55),0_10px_28px_-10px_rgba(200,164,78,0.35)]"
                      : "border-gold/20 group-hover:border-gold/45",
                  )}
                >
                  <PageThumb index={index} currency={currency} />
                </span>
                <span
                  className={cn(
                    "text-[9px] leading-none tracking-[0.24em] tabular-nums transition-colors",
                    isActive(index) ? "text-gold" : "text-paper/40 group-hover:text-paper/70",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Miniature printed-page previews                                     */
/* ------------------------------------------------------------------ */

function PageThumb({ index, currency }: { index: number; currency: Currency }) {
  if (index === 0) return <CoverThumb />;
  if (index === TOTAL_PAGES - 1) return <BackThumb />;

  const isChapter = index % 2 === 1;
  const category = categories[Math.floor((index - 1) / 2)];
  if (!category) return null;

  return isChapter ? (
    <ChapterThumb category={category} />
  ) : (
    <DishesThumb category={category} currency={currency} />
  );
}

function PaperShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute inset-0 bg-paper">
      {/* gold hairline frame, echoing the printed page */}
      <span className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-gold/45" />
      <span className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-gold/20" />
      <span className="absolute inset-0 flex flex-col items-center overflow-hidden px-[14%] pb-[10%] pt-[12%]">
        {children}
      </span>
    </span>
  );
}

function CoverThumb() {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#16241c]">
      <span className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-gold/40" />
      <Monogram className="h-[26%] w-auto text-gold" />
      <span className="font-display text-[10px] font-medium uppercase leading-none tracking-[0.28em] text-gold">
        Yegesha
      </span>
      <span className="text-[3.6px] uppercase leading-none tracking-[0.3em] text-gold/60">
        Specialty Café &amp; Roastery
      </span>
      <span className="mt-0.5 text-[3px] uppercase leading-none tracking-[0.42em] text-paper/35">
        Addis Ababa
      </span>
    </span>
  );
}

function BackThumb() {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#101a14]">
      <span className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-gold/35" />
      <Monogram className="h-[18%] w-auto text-gold/80" />
      <span className="px-3 text-center font-display text-[5.4px] italic leading-[1.35] text-paper/75">
        {brand.tagline}
      </span>
      <span className="mt-0.5 text-[3.2px] uppercase leading-none tracking-[0.4em] text-gold/45">
        Thank you
      </span>
    </span>
  );
}

function ChapterThumb({ category }: { category: (typeof categories)[number] }) {
  return (
    <PaperShell>
      <span className="text-[3.4px] uppercase leading-none tracking-[0.42em] text-gold-deep/80">
        Chapter
      </span>
      <span className="mt-[6%] font-display text-[22px] leading-none text-gold/45">
        {category.numeral}
      </span>
      <span className="mt-[8%] text-center font-display text-[6.6px] font-medium uppercase leading-[1.25] tracking-[0.12em] text-ink">
        {category.title}
      </span>
      <span className="my-[9%] h-px w-3/5 bg-gold/60" />
      <span className="line-clamp-2 px-1 text-center font-display text-[3.9px] italic leading-[1.4] text-clay">
        {category.tagline}
      </span>
    </PaperShell>
  );
}

function DishesThumb({
  category,
  currency,
}: {
  category: (typeof categories)[number];
  currency: Currency;
}) {
  return (
    <PaperShell>
      <span className="flex w-full items-baseline justify-between gap-1">
        <span className="text-[3.4px] uppercase leading-none tracking-[0.32em] text-gold-deep/80">
          Ch. {category.numeral}
        </span>
        <span className="text-[3.4px] uppercase leading-none tracking-[0.22em] text-ink-soft/50">
          {category.items.length} items
        </span>
      </span>
      <span className="mt-[4%] w-full border-b border-gold/40 pb-[4%] text-left font-display text-[6.4px] font-medium uppercase leading-none tracking-[0.1em] text-ink">
        {category.title}
      </span>
      <span className="mt-[7%] flex w-full flex-col gap-[4px]">
        {category.items.slice(0, 5).map((item) => (
          <span key={item.id} className="flex w-full items-baseline gap-[3px]">
            <span className="truncate text-[3.7px] leading-none text-ink-soft/90">
              {item.name}
            </span>
            <span className="h-px flex-1 border-b border-dotted border-ink/25" />
            <span className="shrink-0 text-[3.5px] leading-none text-gold-deep">
              {formatPrice(item.price, currency)}
            </span>
          </span>
        ))}
      </span>
    </PaperShell>
  );
}
