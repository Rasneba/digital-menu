"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MenuBook, type BookPosition, type MenuBookHandle } from "@/components/MenuBook";
import { PhotoViewer } from "@/components/PhotoViewer";
import { Monogram, Wordmark } from "@/components/Brand";
import { CurrencySelector } from "@/components/CurrencySelector";
import { FloatingToolbar } from "@/components/menu/FloatingToolbar";
import { TableOfContents } from "@/components/menu/TableOfContents";
import { ThumbnailSheet } from "@/components/menu/ThumbnailSheet";
import {
  allPhotos,
  categories,
  DEFAULT_CURRENCY,
  pagesImageUrls,
  TOTAL_PAGES,
  type Currency,
} from "@/data/menu";
import { navigate } from "@/lib/router";
import { cn } from "@/utils/cn";
import { haptic } from "@/utils/haptics";
import {
  readSessionFlag,
  readSessionNumber,
  writeSessionFlag,
  writeSessionNumber,
} from "@/utils/storage";

const STORAGE_KEY = "yebet-menet-currency";
const PAGE_KEY = "yegesha-menu-page";
const HINT_KEY = "yegesha-menu-hint-shown";

const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 1.3;

function loadCurrency(): Currency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ETB" || stored === "USD" || stored === "EUR") return stored;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_CURRENCY;
}

function restoredPage(): number {
  const saved = readSessionNumber(PAGE_KEY);
  if (saved === null) return 0;
  return Math.min(Math.max(Math.trunc(saved), 0), TOTAL_PAGES - 1);
}

export default function DigitalMenuPage() {
  const bookRef = useRef<MenuBookHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | null>(null);
  const preloaded = useRef<Set<string>>(new Set());
  const lastIndex = useRef(-1);

  const [position, setPosition] = useState<BookPosition>({
    index: 0,
    total: TOTAL_PAGES,
    orientation: "landscape",
  });
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>(loadCurrency);
  const [ready, setReady] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [cssExpanded, setCssExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* Where the reader left off — read once, at mount */
  const [initialPage] = useState(restoredPage);

  const isFullscreen = nativeFullscreen || cssExpanded;

  /* ---- toast helper ------------------------------------------------- */
  const showToast = useCallback((message: string, duration = 2400) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  /* ---- persist currency --------------------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      /* storage unavailable */
    }
  }, [currency]);

  /* ---- image preloading: current page ± 1 --------------------------- */
  const preloadNearby = useCallback((index: number) => {
    const urls = pagesImageUrls();
    for (const page of [index - 1, index, index + 1]) {
      urls.get(page)?.forEach((url) => {
        if (preloaded.current.has(url)) return;
        preloaded.current.add(url);
        const img = new Image();
        img.decoding = "async";
        img.src = url;
      });
    }
  }, []);

  const handlePositionChange = useCallback(
    (next: BookPosition) => {
      setPosition(next);
      if (next.index !== lastIndex.current) {
        if (lastIndex.current !== -1) haptic(10);
        lastIndex.current = next.index;
        writeSessionNumber(PAGE_KEY, next.index);
        preloadNearby(next.index);
      }
    },
    [preloadNearby],
  );

  /* ---- fullscreen (native with CSS fallback for iOS) ---------------- */
  useEffect(() => {
    const onChange = () => setNativeFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (cssExpanded) {
      setCssExpanded(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* already out */
      }
      return;
    }
    const supportsNative =
      typeof document !== "undefined" &&
      typeof document.documentElement?.requestFullscreen === "function";
    if (supportsNative && rootRef.current) {
      try {
        await rootRef.current.requestFullscreen();
        return;
      } catch {
        /* fall through to CSS fullscreen */
      }
    }
    setCssExpanded(true);
  }, [cssExpanded]);

  /* tell the flip book the box changed size (zoom / expand toggles) */
  useEffect(() => {
    const timer = window.setTimeout(
      () => window.dispatchEvent(new Event("resize")),
      80,
    );
    return () => window.clearTimeout(timer);
  }, [zoom, cssExpanded]);

  const scrollStage = useCallback((left: number, top: number) => {
    const stage = scrollRef.current;
    if (!stage) return;
    try {
      stage.scrollTo({ left, top });
    } catch {
      /* older WebViews without Element.scrollTo */
      stage.scrollLeft = left;
      stage.scrollTop = top;
    }
  }, []);

  /* re-centre the stage whenever the zoom level changes */
  useEffect(() => {
    const stage = scrollRef.current;
    if (!stage) return;
    if (zoom === ZOOM_MIN) {
      scrollStage(0, 0);
      return;
    }
    const timer = window.setTimeout(() => {
      scrollStage(
        (stage.scrollWidth - stage.clientWidth) / 2,
        (stage.scrollHeight - stage.clientHeight) / 2,
      );
    }, 90);
    return () => window.clearTimeout(timer);
  }, [zoom, scrollStage]);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(ZOOM_MAX, Math.round(z * ZOOM_STEP * 100) / 100)),
    [],
  );
  const zoomOut = useCallback(
    () =>
      setZoom((z) => {
        const next = z / ZOOM_STEP;
        return next < 1.12 ? ZOOM_MIN : Math.round(next * 100) / 100;
      }),
    [],
  );
  const resetZoom = useCallback(() => setZoom(ZOOM_MIN), []);

  /* ---- keyboard ------------------------------------------------------ */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (tocOpen) setTocOpen(false);
        if (thumbsOpen) setThumbsOpen(false);
        if (cssExpanded) setCssExpanded(false);
        return;
      }
      if (viewerIndex !== null || tocOpen || thumbsOpen) return;
      if (event.key === "ArrowRight") bookRef.current?.next();
      if (event.key === "ArrowLeft") bookRef.current?.prev();
      if (event.key === "Home") bookRef.current?.goTo(0);
      if (event.key === "End") bookRef.current?.goTo(TOTAL_PAGES - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, tocOpen, thumbsOpen, cssExpanded]);

  /* ---- first-visit gesture hint -------------------------------------- */
  useEffect(() => {
    if (!ready) return;
    if (!readSessionFlag(HINT_KEY)) {
      writeSessionFlag(HINT_KEY);
      showToast("Swipe or drag a corner to turn the page", 3600);
    }
  }, [ready, showToast]);

  const openPhoto = useCallback((photoId: number) => {
    const index = allPhotos.findIndex((photo) => photo.id === photoId);
    if (index >= 0) setViewerIndex(index);
  }, []);

  const goTo = useCallback((index: number) => {
    bookRef.current?.goTo(index);
  }, []);

  /* ---- page numbering -------------------------------------------------- */
  const { toolbarLabel, section } = useMemo(() => {
    const { index, total, orientation } = position;

    if (index === 0) {
      return {
        toolbarLabel: "Cover",
        section: "Yegesha Coffee — Specialty Café & Roastery",
      };
    }
    if (index >= total - 1) {
      return { toolbarLabel: String(total), section: "Colophon" };
    }

    const start = index % 2 === 1 ? index : index - 1;
    const end = start + 1;
    const categoryIndex = Math.floor((start - 1) / 2);
    const category = categories[Math.min(Math.max(categoryIndex, 0), categories.length - 1)];

    return {
      toolbarLabel:
        orientation === "portrait" ? String(index + 1) : `${start + 1}–${end + 1}`,
      section: `${category.numeral} · ${category.title}`,
    };
  }, [position]);

  const activeCategory = useMemo(() => {
    const { index, total } = position;
    if (index === 0 || index >= total - 1) return -1;
    const start = index % 2 === 1 ? index : index - 1;
    return Math.floor((start - 1) / 2);
  }, [position]);

  const canPrev = position.index > 0;
  const canNext = position.index < position.total - 1;

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex h-dvh w-full flex-col overflow-hidden bg-espresso",
        cssExpanded && "fixed inset-0 z-[60] h-[100dvh]",
      )}
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(200,164,78,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_120%,rgba(120,84,48,0.22),transparent_60%)]" />

      {/* header — hidden in reading-focused expanded mode */}
      {!cssExpanded && (
        <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-2 sm:px-8 sm:py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gold transition-opacity hover:opacity-80"
            aria-label="Back to Yegesha Coffee"
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
          </div>
        </header>
      )}

      {/* the book — panning surface */}
      <main className="relative z-10 min-h-0 flex-1">
        <div
          ref={scrollRef}
          className={cn(
            "no-scrollbar absolute inset-0 overflow-auto overscroll-contain",
            zoom > 1 && "stage--zoomed",
          )}
        >
          <div
            className="flex h-full w-full p-1.5 sm:p-3"
            style={{
              width: `${zoom * 100}%`,
              height: `${zoom * 100}%`,
              margin: "auto",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            <div
              className="mx-auto h-full w-full"
              style={{ maxWidth: `${1040 * zoom}px` }}
            >
              <div className="h-full w-full shadow-book sm:drop-shadow-[0_45px_70px_rgba(0,0,0,0.55)]">
                <MenuBook
                  ref={bookRef}
                  onPositionChange={handlePositionChange}
                  onPhotoOpen={openPhoto}
                  onReady={() => setReady(true)}
                  currency={currency}
                  initialPage={initialPage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* zoom reset chip */}
        {zoom > 1.01 && (
          <button
            type="button"
            onClick={resetZoom}
            className="sheet-fade absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-gold/30 bg-[#14100c]/85 px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur transition hover:border-gold/60"
          >
            {Math.round(zoom * 100)}% · Reset
          </button>
        )}

        {/* loading overlay */}
        <div
          aria-hidden={ready}
          className={cn(
            "pointer-events-none absolute inset-0 z-10 grid place-items-center bg-espresso/70 transition-opacity duration-700 ease-out",
            ready && "opacity-0",
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative grid h-20 w-20 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold/15" />
              <span className="loader-ring absolute inset-0 rounded-full border border-transparent border-t-gold/90" />
              <Monogram className="h-11 w-11 text-gold" />
            </div>
            <p className="font-display text-lg tracking-[0.34em] text-paper/85">YEGESHA</p>
            <p className="text-[8px] uppercase tracking-[0.52em] text-gold/55">
              Setting the table…
            </p>
          </div>
        </div>
      </main>

      {/* bottom area — bookmark rail + floating toolbar */}
      <footer className="relative z-20 shrink-0">
        {/* category bookmarks */}
        {!cssExpanded && (
          <nav
            aria-label="Menu chapters"
            className="bookmark-rail quiet-scroll flex items-center gap-1.5 overflow-x-auto px-3 pb-1 pt-1 sm:justify-center sm:px-8"
          >
            {categories.map((category, i) => {
              const isActive = activeCategory === i;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    haptic(6);
                    bookRef.current?.goTo(1 + i * 2);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-all duration-300 sm:px-3 sm:text-[10px] sm:tracking-[0.26em]",
                    isActive
                      ? "border-gold/70 bg-gold/15 text-gold"
                      : "border-transparent text-paper/45 hover:border-gold/30 hover:text-paper/80",
                  )}
                >
                  <span className="font-display text-[10px] tracking-[0.2em] sm:text-[11px]">
                    {category.numeral}
                  </span>
                  <span className="ml-1.5">{category.title}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* floating toolbar */}
        <div className="flex items-center justify-center px-1.5 pb-[max(env(safe-area-inset-bottom),0.45rem)] pt-0.5 sm:px-4 sm:pb-[max(env(safe-area-inset-bottom),0.65rem)]">
          <FloatingToolbar
            pageLabel={toolbarLabel}
            totalPages={position.total}
            orientation={position.orientation}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={() => bookRef.current?.prev()}
            onNext={() => bookRef.current?.next()}
            onOpenToc={() => setTocOpen(true)}
            onOpenThumbs={() => setThumbsOpen(true)}
            zoom={zoom}
            canZoomIn={zoom < ZOOM_MAX}
            canZoomOut={zoom > ZOOM_MIN}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onToast={showToast}
          />
        </div>
      </footer>

      {/* toast */}
      {toast && (
        <div
          role="status"
          className="toast-in pointer-events-none fixed bottom-20 left-1/2 z-30 w-max max-w-[88vw] rounded-full border border-gold/25 bg-[#14100c]/92 px-4 py-2 text-center text-[9px] uppercase leading-relaxed tracking-[0.22em] text-paper/85 backdrop-blur"
        >
          {toast}
        </div>
      )}

      {/* bottom sheets */}
      {tocOpen && (
        <TableOfContents
          currentIndex={position.index}
          activeCategory={activeCategory}
          onGoTo={goTo}
          onClose={() => setTocOpen(false)}
        />
      )}
      {thumbsOpen && (
        <ThumbnailSheet
          currentIndex={position.index}
          orientation={position.orientation}
          currency={currency}
          onGoTo={goTo}
          onClose={() => setThumbsOpen(false)}
        />
      )}

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
