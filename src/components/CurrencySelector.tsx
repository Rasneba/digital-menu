"use client";

import {
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  convert,
  formatPrice,
  type Currency,
} from "@/data/menu";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "yebet-menet-currency";

interface CurrencySelectorProps {
  currency: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelector({ currency, onChange }: CurrencySelectorProps) {
  const options: Currency[] = ["ETB", "USD", "EUR"];

  return (
    <div className="relative z-20 shrink-0">
      <button
        type="button"
        onClick={() => {
          const next = options[(options.indexOf(currency) + 1) % options.length];
          localStorage.setItem(STORAGE_KEY, next);
          onChange(next);
        }}
        className={cn(
          "flex items-center gap-2 rounded-full border border-gold/30 bg-ink/40 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.34em] text-paper/90 transition hover:border-gold/70 hover:text-gold",
        )}
        aria-label="Switch currency"
      >
        <span className="text-gold">{CURRENCY_SYMBOLS[currency]}</span>
        <span className="text-paper/60">{CURRENCY_NAMES[currency]}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 text-paper/50 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 12l5 5 5-5" />
        </svg>
      </button>
    </div>
  );
}

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
}

export function PriceDisplay({ amount, currency }: PriceDisplayProps) {
  return <span className="font-semibold text-gold-deep">{formatPrice(amount, currency)}</span>;
}

interface ConvertedPriceProps {
  etbAmount: number;
  currency: Currency;
}

export function ConvertedPrice({ etbAmount, currency }: ConvertedPriceProps) {
  if (currency === "ETB") return null;
  const converted = convert(etbAmount, "ETB", currency);
  return (
    <span className="text-paper/40 text-[80%] ml-1">
      ({formatPrice(converted, currency)})
    </span>
  );
}
