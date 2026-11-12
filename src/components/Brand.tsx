import { cn } from "@/utils/cn";

export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path
        d="M50 6 L57.5 42.5 L50 94 L42.5 42.5 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="42"
        fill="currentColor"
      >
        É
      </text>
    </svg>
  );
}

export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Monogram className={compact ? "h-7 w-7" : "h-9 w-9"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-medium tracking-[0.34em]",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          ÉCLAT
        </span>
        {!compact && (
          <span className="mt-1 text-[10px] font-light uppercase tracking-[0.42em] opacity-70">
            Café &amp; Kitchen
          </span>
        )}
      </span>
    </span>
  );
}
