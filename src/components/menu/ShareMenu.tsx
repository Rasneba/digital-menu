import { useEffect, useRef, useState } from "react";
import { brand } from "@/data/menu";
import { haptic } from "@/utils/haptics";

interface ShareMenuProps {
  onClose: () => void;
  onToast: (message: string) => void;
}

/**
 * Compact share popover anchored above the floating toolbar.
 * Uses the OS share sheet when available; clipboard + mailto always work.
 */
export function ShareMenu({ onClose, onToast }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  /* Close on Escape and on pointer-down outside the popover */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [onClose]);

  const shareUrl = () => window.location.href;
  const shareTitle = `${brand.name} — Specialty Café & Roastery`;
  const shareText = `${brand.name} (${brand.city}) — browse the menu as a hand-bound digital book.`;

  const copyLink = async () => {
    haptic(8);
    try {
      await navigator.clipboard.writeText(shareUrl());
    } catch {
      /* clipboard API blocked — fall back to a hidden textarea */
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl();
      textarea.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        /* give up silently */
      }
      textarea.remove();
    }
    setCopied(true);
    onToast("Link copied to clipboard");
    window.setTimeout(onClose, 650);
  };

  const nativeShare = async () => {
    haptic(8);
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl() });
      onClose();
    } catch {
      /* user dismissed the share sheet — keep the popover open */
    }
  };

  const mailShare = () => {
    haptic(8);
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div
      ref={rootRef}
      role="menu"
      aria-label="Share this menu"
      className="sheet-fade absolute bottom-[calc(100%+12px)] right-0 z-50 w-60 overflow-hidden rounded-2xl border border-gold/25 bg-[#171310] p-1.5 shadow-[0_22px_55px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl"
    >
      <p className="px-3 pb-1.5 pt-2 text-[8px] uppercase tracking-[0.42em] text-gold/60">
        Share this menu
      </p>

      {canNativeShare && (
        <button type="button" role="menuitem" onClick={nativeShare} className={itemClass}>
          <span className={iconWrap}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="2.6" />
              <circle cx="6" cy="12" r="2.6" />
              <circle cx="18" cy="19" r="2.6" />
              <path d="M8.4 13.4l7.2 4.2M15.6 6.4l-7.2 4.2" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-[12px] text-paper/90">Share via…</span>
            <span className="block text-[9px] text-paper/40">Device share sheet</span>
          </span>
        </button>
      )}

      <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
        <span className={iconWrap}>
          {copied ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12.5l5 5L19.5 6.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.7 1.7" />
              <path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.7-1.7" />
            </svg>
          )}
        </span>
        <span className="flex-1">
          <span className="block text-[12px] text-paper/90">
            {copied ? "Copied!" : "Copy link"}
          </span>
          <span className="block text-[9px] text-paper/40">Paste anywhere</span>
        </span>
      </button>

      <button type="button" role="menuitem" onClick={mailShare} className={itemClass}>
        <span className={iconWrap}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3.5 7l8.5 6 8.5-6" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block text-[12px] text-paper/90">Send by email</span>
          <span className="block text-[9px] text-paper/40">Opens your mail app</span>
        </span>
      </button>
    </div>
  );
}

const itemClass =
  "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-150 hover:bg-gold/[0.08]";
const iconWrap =
  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/20 text-paper/70";
