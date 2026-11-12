import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface PageFrameProps {
  children: ReactNode;
  /** Small running head printed at the top of the page */
  runningHead?: ReactNode;
  /** Page number printed at the foot of the page */
  folio?: string;
  variant?: "paper" | "cover";
  className?: string;
}

export function PageFrame({
  children,
  runningHead,
  folio,
  variant = "paper",
  className,
}: PageFrameProps) {
  const isCover = variant === "cover";

  return (
    <div
      className={cn(
        "menu-page flex h-full w-full flex-col",
        isCover ? "menu-page--cover cover-grain" : "paper-grain",
        className,
      )}
    >
      {/* gold rule frame */}
      <div
        className={cn(
          "pointer-events-none absolute inset-[2.4cqh_2.6cqw] z-20 border",
          isCover ? "border-gold/35" : "border-gold/30",
        )}
      />
      <div className="pointer-events-none absolute inset-[3.2cqh_3.4cqw] z-20 border border-gold/15" />

      {runningHead && (
        <header className="relative z-10 flex shrink-0 items-center justify-between px-[7cqw] pt-[5.2cqh] text-[1.95cqh] uppercase tracking-[0.42em]">
          <span className="text-gold-deep/80">{runningHead}</span>
          <span className="h-px flex-1 translate-x-[1.6cqw] bg-gold/25" />
        </header>
      )}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>

      {folio && (
        <footer className="relative z-10 flex shrink-0 items-center justify-center gap-[2cqw] px-[7cqw] pb-[4.4cqh] pt-[2cqh] text-[2cqh] tracking-[0.3em]">
          <span className="h-px w-[6cqw] bg-gold/35" />
          <span className="text-ink-soft/70">{folio}</span>
          <span className="h-px w-[6cqw] bg-gold/35" />
        </footer>
      )}
    </div>
  );
}
