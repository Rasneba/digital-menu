import { PageFrame } from "./PageFrame";
import { Monogram } from "@/components/Brand";
import { brand, photoSrc } from "@/data/menu";

const KEY = [
  { key: "V", label: "Vegetarian" },
  { key: "VG", label: "Vegan" },
  { key: "GF", label: "Gluten free" },
  { key: "N", label: "Contains nuts" },
  { key: "S", label: "Spiced" },
];

export function BackCoverPage() {
  return (
    <PageFrame variant="cover">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photoSrc(34206671, 1600)}
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1712]/92 via-[#16241c]/82 to-[#0b1410]/96" />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-[9cqw] text-center">
        <Monogram className="h-[10cqh] w-[10cqh] text-gold/80" />
        <p className="mt-[2cqh] font-display text-[6cqh] italic leading-none text-paper/90">
          {brand.tagline}
        </p>
        <div className="my-[2cqh] flex w-full items-center justify-center gap-[1.6cqw]">
          <span className="h-px flex-1 bg-gold/25" />
          <span className="h-[0.5cqh] w-[0.5cqh] rotate-45 bg-gold/60" />
          <span className="h-px flex-1 bg-gold/25" />
        </div>

        <p className="max-w-[86%] text-[1.95cqh] leading-[1.6] text-paper/65">
          {brand.about} All prices are inclusive of 5% SC &amp; 15% VAT.
        </p>

        <div className="mt-[2.2cqh] flex flex-wrap items-center justify-center gap-x-[1.6cqw] gap-y-[0.6cqh] text-[1.45cqh] uppercase tracking-[0.24em] text-gold/45">
          {KEY.map((entry) => (
            <span key={entry.key} className="flex items-center gap-[0.5cqw]">
              <span className="font-display text-[1.8cqh] text-gold/70">{entry.key}</span>
              <span>{entry.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex shrink-0 flex-col items-center gap-[0.9cqh] pb-[5cqh] text-center text-[1.65cqh] uppercase tracking-[0.32em] text-gold/50">
        <span>{brand.hours}</span>
        <span>{brand.address}</span>
        <span>{brand.phone}</span>
      </div>
    </PageFrame>
  );
}
