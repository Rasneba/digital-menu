import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { photoFull } from "@/data/menu";
import { cn } from "@/utils/cn";

export interface ViewerPhoto {
  id: number;
  name: string;
  category: string;
}

interface PhotoViewerProps {
  photos: ViewerPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  onClose,
}: PhotoViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const dragOrigin = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const photo = photos[index];

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const zoomBy = useCallback(
    (factor: number, originX = 0, originY = 0) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
      if (next === scale) return;
      setScale(next);
      setOffset((current) => ({
        x: originX - ((originX - current.x) * next) / scale,
        y: originY - ((originY - current.y) * next) / scale,
      }));
    },
    [scale],
  );

  /* fullscreen */
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      reset();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [reset]);

  /* keyboard */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
      if (event.key === "ArrowLeft")
        onIndexChange((index - 1 + photos.length) % photos.length);
      if (event.key === "+" || event.key === "=") zoomBy(1.3);
      if (event.key === "-") zoomBy(1 / 1.3);
      if (event.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onIndexChange, zoomBy, reset]);

  /* wheel zoom (non passive so it can be prevented) */
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, x, y);
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  useEffect(() => {
    reset();
  }, [index, reset]);

  const onPointerDown = (event: React.PointerEvent) => {
    (event.target as Element).setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale,
      };
      dragOrigin.current = null;
      return;
    }

    dragOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const next = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, (pinch.current.scale * distance) / pinch.current.distance),
      );
      setScale(next);
      return;
    }

    if (dragOrigin.current) {
      setOffset({
        x: dragOrigin.current.ox + (event.clientX - dragOrigin.current.x),
        y: dragOrigin.current.oy + (event.clientY - dragOrigin.current.y),
      });
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) dragOrigin.current = null;
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (rootRef.current) {
        await rootRef.current.requestFullscreen();
      }
    } catch {
      /* ignore unsupported fullscreen */
    }
  };

  if (!photo) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/97 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(8, 6, 5, 0.97)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(200,164,78,0.10),transparent_70%)]" />

      {/* top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-display text-lg text-paper sm:text-xl">{photo.name}</p>
          <p className="truncate text-[10px] uppercase tracking-[0.34em] text-gold/70">
            {photo.category} · {index + 1} / {photos.length}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.35)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold/70 hover:text-gold"
            aria-label="Zoom out"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-paper/60">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoomBy(1.35)}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold/70 hover:text-gold"
            aria-label="Zoom in"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold/70 hover:text-gold"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M9 3v6H3M15 21v-6h6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M3 9V3h6M21 15v6h-6" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-paper/80 transition hover:border-gold/70 hover:text-gold"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* stage */}
      <div
        className={cn(
          "relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden",
          scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => (scale > 1 ? reset() : zoomBy(2.2))}
      >
        <img
          src={photoFull(photo.id)}
          alt={photo.name}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-transform duration-150 ease-out"
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})` }}
        />

        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
          className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/25 bg-ink/50 text-paper/80 transition hover:border-gold/70 hover:text-gold sm:left-5"
          aria-label="Previous photograph"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % photos.length)}
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/25 bg-ink/50 text-paper/80 transition hover:border-gold/70 hover:text-gold sm:right-5"
          aria-label="Next photograph"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="relative z-10 shrink-0 px-6 py-4 text-center text-[10px] uppercase tracking-[0.34em] text-paper/35">
        Scroll or pinch to zoom · drag to pan · double tap to reset
      </p>
    </div>,
    document.body,
  );
}
