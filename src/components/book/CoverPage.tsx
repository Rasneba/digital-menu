import { PageFrame } from "./PageFrame";
import { Monogram } from "@/components/Brand";
import { brand, photoSrc } from "@/data/menu";

export function CoverPage() {
  return (
    <PageFrame variant="cover">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photoSrc(39047893, 1600)}
          alt=""
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#16241c]/85 via-[#16241c]/70 to-[#0b1410]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(200,164,78,0.18),transparent_60%)]" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-[10cqw] text-center">
        <Monogram className="h-[14cqh] w-[14cqh] text-gold" />

        <h1 className="foil mt-[2.4cqh] font-display text-[10.5cqh] leading-none tracking-[0.24em]">
          Yegesha Coffee
        </h1>

        <p className="mt-[1.6cqh] text-[1.9cqh] uppercase tracking-[0.6em] text-gold/75">
          Specialty Café &amp; Roastery
        </p>

        <div className="my-[2.8cqh] flex w-full items-center justify-center gap-[2.2cqw]">
          <span className="h-px flex-1 bg-gold/30" />
          <span className="text-[1.6cqh] tracking-[0.44em] text-gold/60">Addis Ababa</span>
          <span className="h-px flex-1 bg-gold/30" />
        </div>

        <p className="font-display text-[5cqh] italic leading-none text-paper/95">
          {brand.tagline}
        </p>
        <p className="mt-[1.2cqh] text-[1.85cqh] uppercase tracking-[0.46em] text-paper/55">
          {brand.volume}
        </p>
        <p className="mt-[0.6cqh] text-[1.85cqh] uppercase tracking-[0.46em] text-paper/40">
          {brand.season}
        </p>
      </div>

      <div className="relative flex shrink-0 flex-col items-center gap-[1.6cqh] pb-[5cqh]">
        <button
          type="button"
          data-action="open-menu"
          className="group flex items-center gap-[1.2cqw] border border-gold/35 px-[3.4cqw] py-[1.5cqh] text-[1.6cqh] uppercase tracking-[0.34em] text-gold/80 transition-colors duration-300 hover:border-gold/70 hover:text-gold"
        >
          Open the menu
          <svg
            viewBox="0 0 24 24"
            className="h-[2.2cqh] w-[2.2cqh] transition-transform duration-300 group-hover:translate-x-[0.3cqh]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>

        <div className="flex items-center gap-[1.6cqw] text-[1.6cqh] uppercase tracking-[0.36em] text-gold/45">
          <span>{brand.addressShort}</span>
          <span className="h-[0.4cqh] w-[0.4cqh] rotate-45 bg-gold/50" />
          <span>{brand.city}</span>
        </div>
      </div>
    </PageFrame>
  );
}
