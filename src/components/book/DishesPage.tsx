"use client";

import { PageFrame } from "./PageFrame";
import {
  photoSrc,
  type MenuCategory,
  type MenuItem,
  type Tag,
  convert,
  type Currency,
} from "@/data/menu";
import { PriceDisplay, ConvertedPrice } from "@/components/CurrencySelector";

const TAG_LABELS: Record<Tag, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten free",
  N: "Contains nuts",
  S: "Spiced",
};

function Dish({
  item,
  currency,
}: {
  item: MenuItem;
  currency: Currency;
}) {
  const converted = currency === "ETB" ? null : convert(item.price, "ETB", currency);

  return (
    <article className="dish">
      <button
        type="button"
        data-photo-id={item.photo}
        aria-label={`Open a full screen photograph of ${item.name}`}
        className="dish__media group relative overflow-hidden bg-parchment-deep/40"
      >
        <img
          src={photoSrc(item.photo, 900)}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25" />
        <span className="absolute bottom-[0.9cqh] right-[0.9cqh] grid h-[4.6cqh] w-[4.6cqh] place-items-center rounded-full bg-ink/60 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg
            viewBox="0 0 24 24"
            className="h-[2.6cqh] w-[2.6cqh]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
          </svg>
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-[1cqw]">
          <h3 className="font-display text-[3.2cqh] leading-tight text-ink">{item.name}</h3>
          <span className="mb-[0.6cqh] h-px flex-1 border-b border-dotted border-ink/25" />
          <span className="shrink-0 flex items-baseline gap-[0.6cqw]">
            <PriceDisplay amount={item.price} currency={currency} />
            {converted !== null && <ConvertedPrice etbAmount={item.price} currency={currency} />}
          </span>
        </div>

        <p className="mt-[0.8cqh] text-[2.05cqh] leading-[1.4] text-ink-soft/85">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <p className="mt-[0.7cqh] flex flex-wrap gap-x-[1cqw] gap-y-[0.4cqh] text-[1.5cqh] uppercase tracking-[0.24em] text-gold-deep/70">
            {item.tags.map((tag) => (
              <span key={tag} title={TAG_LABELS[tag]}>
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}

export function DishesPage({
  category,
  folio,
  currency,
}: {
  category: MenuCategory;
  folio: string;
  currency: Currency;
}) {
  return (
    <PageFrame runningHead={`${category.numeral} · ${category.title}`} folio={folio}>
      <div className="flex min-h-0 flex-1 flex-col px-[7cqw] pb-[1cqh] pt-[2.6cqh]">
        <div className="mb-[1.8cqh] flex items-baseline justify-between gap-[2cqw]">
          <h2 className="font-display text-[4.6cqh] leading-none text-ink">{category.title}</h2>
          <span className="text-[1.7cqh] uppercase tracking-[0.34em] text-ink-soft/55">
            {category.items.length} plates
          </span>
        </div>

        <div className="dishes min-h-0 flex-1">
          {category.items.map((item) => (
            <Dish key={item.id} item={item} currency={currency} />
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
