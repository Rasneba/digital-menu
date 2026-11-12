import { PageFrame } from "./PageFrame";
import { brand, photoSrc, type MenuCategory } from "@/data/menu";

const KEY = [
  { key: "V", label: "Vegetarian" },
  { key: "VG", label: "Vegan" },
  { key: "GF", label: "Gluten free" },
  { key: "N", label: "Nuts" },
  { key: "S", label: "Spiced" },
];

export function ChapterPage({
  category,
  folio,
  showKey = false,
}: {
  category: MenuCategory;
  folio: string;
  showKey?: boolean;
}) {
  return (
    <PageFrame runningHead={`Chapter ${category.numeral}`} folio={folio}>
      <div className="flex min-h-0 flex-1 flex-col px-[7cqw] pb-[1cqh] pt-[2.6cqh]">
        <div className="flex items-end justify-between gap-[2cqw]">
          <div className="min-w-0">
            <p className="text-[1.8cqh] uppercase tracking-[0.5em] text-gold-deep/75">
              Chapter {category.numeral}
            </p>
            <h2 className="mt-[0.8cqh] font-display text-[8cqh] leading-[0.92] text-ink">
              {category.title}
            </h2>
          </div>
          <span className="shrink-0 font-display text-[6.4cqh] leading-none text-gold/35">
            {category.numeral}
          </span>
        </div>

        <div className="mt-[1.4cqh] flex items-center gap-[1.4cqw]">
          <span className="h-px w-[7cqw] bg-gold/60" />
          <p className="font-display text-[2.8cqh] italic text-clay">{category.tagline}</p>
        </div>

        <figure className="relative mt-[2cqh] min-h-0 flex-1 overflow-hidden">
          <img
            src={photoSrc(category.photo, 1400)}
            alt={category.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <figcaption className="absolute bottom-0 left-0 right-0 px-[1.4cqw] pb-[1.4cqh] text-[1.5cqh] uppercase tracking-[0.32em] text-paper/75">
            {brand.name} — {brand.city}
          </figcaption>
        </figure>

        <p className="mt-[1.6cqh] border-t border-gold/25 pt-[1.4cqh] font-display text-[2.35cqh] italic leading-[1.45] text-ink-soft/85">
          {category.note}
        </p>

        {showKey && (
          <div className="mt-[1.4cqh] flex flex-wrap items-center gap-x-[1.6cqw] gap-y-[0.6cqh] text-[1.5cqh] uppercase tracking-[0.24em] text-ink-soft/60">
            <span className="text-gold-deep/80">Key</span>
            {KEY.map((entry) => (
              <span key={entry.key} className="flex items-center gap-[0.5cqw]">
                <span className="font-display text-[1.9cqh] text-gold-deep">{entry.key}</span>
                <span>{entry.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </PageFrame>
  );
}
