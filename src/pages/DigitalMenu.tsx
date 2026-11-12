"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MenuBook, type BookPosition, type MenuBookHandle } from "@/components/MenuBook";
import { PhotoViewer } from "@/components/PhotoViewer";
import { Wordmark } from "@/components/Brand";
import { CurrencySelector } from "@/components/CurrencySelector";
import { allPhotos, categories, DEFAULT_CURRENCY, type Currency } from "@/data/menu";
import { navigate } from "@/lib/router";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "yebet-menet-currency";

function loadCurrency(): Currency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ETB" || stored === "USD" || stored === "EUR") return stored;
  return DEFAULT_CURRENCY;
}

export default function DigitalMenuPage() {
  const bookRef = useRef<MenuBookHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<BookPosition>({
    index: 0,
    total: 16,
    orientation: "landscape",
  });
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currency, setCurrency] = useState<Currency>(loadCurrency);

  /* persist currency */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  /* ---- fullscreen ------------------------------------------------- */
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (stageRef.current) {
        await stageRef.current.requestFullscreen();
      }
    } catch {
      /* fullscreen unavailable */
    }
  }, []);

  /* ---- keyboard ---------------------------------------------------- */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (viewerIndex !== null) return;
      if (event.key === "ArrowRight") bookRef.current?.next();
      if (event.key === "ArrowLeft") bookRef.current?.prev();
      if (event.key === "Home") bookRef.current?.goTo(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex]);

  const openPhoto = useCallback((photoId: number) => {
    const index = allPhotos.findIndex((photo) => photo.id === photoId);
    if (index >= 0) setViewerIndex(index);
  }, []);

  /* ---- page numbering --------------------------------------------- */
  const { label, section } = useMemo(() => {
    const { index, total, orientation } = position;

    if (index === 0) {
      return { label: orientation === "portrait" ? "Cover" : "Cover", section: "Yegesha Coffee — Specialty Café & Roastery" };
    }
    if (index >= total - 1) {
      return { label: `${total} / ${total}`, section: "Colophon" };
    }

    const start = index % 2 === 1 ? index : index - 1;
    const end = start + 1;
    const categoryIndex = Math.floor((start - 1) / 2);
    const category = categories[Math.min(Math.max(categoryIndex, 0), categories.length - 1)];

    return {
      label:
        orientation === "portrait"
          ? `${index + 1} / ${total}`
          : `${start + 1}–${end + 1} / ${total}`,
      section: `${category.numeral} · ${category.title}`,
    };
  }, [position]);

  const activeCategory = useMemo(() => {
    const { index, total } = position;
    if (index === 0 || index >= total - 1) return -1;
    const start = index % 2 === 1 ? index : index - 1;
    return Math.floor((start - 1) / 2);
  }, [position]);

  return (
    <div
      ref={stageRef}
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-espresso"
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(200,164,78,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_120%,rgba(120,84,48,0.22),transparent_60%)]" />

      {/* header */}
      <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-gold transition-opacity hover:opacity-80"
          aria-label="Back to Yebet Menet"
        >
          <Wordmark compact />
        </button>

        <p className="hidden flex-1 truncate text-center text-[10px] uppercase tracking-[0.46em] text-gold/55 sm:block">
          {section}
        </p>

        <div className="flex items-center gap-2">
          <CurrencySelector currency={currency} onChange={setCurrency} />
          <button
            type="button"
            onClick={() => bookRef.current?.goTo(0)}
            className="hidden rounded-full border border-gold/25 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-paper/70 transition hover:border-gold/60 hover:text-gold md:block"
          >
            Cover
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 text-paper/75 transition hover:border-gold/70 hover:text-gold"
            aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                <path d="M9 3v6H3M15 21v-6h6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                <path d="M3 9V3h6M21 15v6h-6" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* the book */}
      <main className="relative z-10 min-h-0 flex-1">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-1.5 sm:px-6">
          <div className="mx-auto h-full w-full max-w-[1040px] shadow-book sm:drop-shadow-[0_50px_80px_rgba(0,0,0,0.55)]">
            <MenuBook
              ref={bookRef}
              onPositionChange={setPosition}
              onPhotoOpen={openPhoto}
              currency={currency}
            />
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="relative z-20 shrink-0 border-t border-gold/10 bg-ink/45 backdrop-blur-md">
        {/* chapter rail */}
        <div className="quiet-scroll flex items-center gap-1.5 overflow-x-auto px-3 py-2 sm:px-8">
          {categories.map((category, i) => {
            const isActive = activeCategory === i;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => bookRef.current?.goTo(1 + i * 2)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] transition-all duration-300",
                  isActive
                    ? "border-gold/70 bg-gold/15 text-gold"
                    : "border-transparent text-paper/45 hover:border-gold/30 hover:text-paper/80",
                )}
              >
                <span className="font-display text-[11px] tracking-[0.2em]">{category.numeral}</span>
                <span className="ml-1.5">{category.title}</span>
              </button>
            );
          })}
        </div>

        {/* turn controls */}
        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1 sm:px-8 sm:pb-4">
          <button
            type="button"
            onClick={() => bookRef.current?.prev()}
            className="group flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-paper/75 transition hover:border-gold/70 hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="min-w-0 text-center">
            <p className="truncate font-display text-sm text-paper/85 sm:text-base">{section}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.4em] text-gold/60">
              {label}
            </p>
            <p className="mt-1 hidden text-[10px] uppercase tracking-[0.3em] text-paper/25 sm:block">
              Drag the corner or swipe to turn
            </p>
          </div>

          <button
            type="button"
            onClick={() => bookRef.current?.next()}
            className="group flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-paper/75 transition hover:border-gold/70 hover:text-gold"
          >
            <span className="hidden sm:inline">Next</span>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={allPhotos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
