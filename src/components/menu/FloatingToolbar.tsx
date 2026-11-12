import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { haptic } from "@/utils/haptics";
import { ShareMenu } from "./ShareMenu";

interface FloatingToolbarProps {
  /** Printed page-range label, e.g. "6–7" or "Cover" */
  pageLabel: string;
  /** Total pages in the book */
  totalPages: number;
  orientation: "portrait" | "landscape";
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenToc: () => void;
  onOpenThumbs: () => void;
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToast: (message: string) => void;
}

/**
 * The floating bottom toolbar: one-handed, thumb-sized controls clustered
 * into a single translucent pill. Everything a reader needs is within
 * reach of a thumb — never more than a couple of centimetres from the
 * edge of the screen.
 */
export function FloatingToolbar({
  pageLabel,
  totalPages,
  orientation,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onOpenToc,
  onOpenThumbs,
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  isFullscreen,
  onToggleFullscreen,
  onToast,
}: FloatingToolbarProps) {
  const [shareOpen, setShareOpen] = useState(false);

  const press = (action: () => void) => () => {
    haptic(6);
    action();
  };

  return (
    <div
      role="toolbar"
      aria-label="Book controls"
      className="toolbar-pill relative flex items-center gap-[2px] rounded-full border border-gold/22 bg-[#14100c]/85 px-1 py-1 shadow-[0_18px_45px_-14px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-1.5 sm:px-2 sm:py-1.5"
    >
      {/* turn back */}
      <IconButton label="Previous page" disabled={!canPrev} onClick={press(onPrev)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </IconButton>

      {/* position read-out */}
      <div
        className="min-w-[2.6rem] select-none text-center leading-none sm:min-w-[3.4rem]"
        aria-live="polite"
        aria-label={`Currently ${orientation === "portrait" ? "on" : "on spread"} page ${pageLabel} of ${totalPages}`}
      >
        <span className="block font-display text-[12px] font-medium tabular-nums text-paper/90 sm:text-[14px]">
          {pageLabel}
        </span>
        <span className="mt-[3px] block text-[6.5px] uppercase tracking-[0.3em] text-gold/55 sm:text-[7.5px]">
          of {totalPages}
        </span>
      </div>

      {/* turn forward */}
      <IconButton label="Next page" disabled={!canNext} onClick={press(onNext)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </IconButton>

      <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-gold/20 sm:block" />

      {/* table of contents */}
      <IconButton label="Table of contents" onClick={press(onOpenToc)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.2 6.2h10.4M9.2 12h10.4M9.2 17.8h10.4" />
          <path d="M4.6 6.2h.01M4.6 12h.01M4.6 17.8h.01" strokeWidth={2.6} />
        </svg>
      </IconButton>

      {/* page thumbnails */}
      <IconButton label="Page thumbnails" onClick={press(onOpenThumbs)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="6.6" height="6.6" rx="1.3" />
          <rect x="13.4" y="4" width="6.6" height="6.6" rx="1.3" />
          <rect x="4" y="13.4" width="6.6" height="6.6" rx="1.3" />
          <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1.3" />
        </svg>
      </IconButton>

      {/* zoom out */}
      <IconButton label="Zoom out" disabled={!canZoomOut} onClick={press(onZoomOut)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
          <path d="M5.5 12h13" />
        </svg>
      </IconButton>

      {/* zoom in */}
      <IconButton label="Zoom in" disabled={!canZoomIn} onClick={press(onZoomIn)} active={zoom > 1}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
          <path d="M12 5.5v13M5.5 12h13" />
        </svg>
      </IconButton>

      {/* share */}
      <div className="relative">
        <IconButton
          label="Share the menu"
          onClick={press(() => setShareOpen((open) => !open))}
          active={shareOpen}
          aria-expanded={shareOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="2.4" />
            <circle cx="6" cy="12" r="2.4" />
            <circle cx="18" cy="19" r="2.4" />
            <path d="M8.3 13.2l7.4 4.4M15.7 6.4l-7.4 4.4" />
          </svg>
        </IconButton>
        {shareOpen && <ShareMenu onClose={() => setShareOpen(false)} onToast={onToast} />}
      </div>

      {/* fullscreen */}
      <IconButton
        label={isFullscreen ? "Exit fullscreen" : "Read fullscreen"}
        onClick={press(onToggleFullscreen)}
        active={isFullscreen}
        aria-pressed={isFullscreen}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 4.5v5h-5M14.5 4.5v5h5M9.5 19.5v-5h-5M14.5 19.5v-5h5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 9.5v-5h5M19.5 9.5v-5h-5M4.5 14.5v5h5M19.5 14.5v5h-5" />
          </svg>
        )}
      </IconButton>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled = false,
  active = false,
  children,
  ...rest
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-150 sm:h-10 sm:w-10",
        "text-paper/78 hover:bg-gold/10 hover:text-gold active:scale-90",
        "disabled:pointer-events-none disabled:opacity-25",
        active && "bg-gold/15 text-gold",
      )}
      {...rest}
    >
      <span className="h-[18px] w-[18px] sm:h-5 sm:w-5 [&>svg]:h-full [&>svg]:w-full">{children}</span>
    </button>
  );
}
