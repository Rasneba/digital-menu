import { Monogram } from "@/components/Brand";
import { brand, categories, photoSrc } from "@/data/menu";
import { navigate } from "@/lib/router";

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-espresso">
      <div className="absolute inset-0">
        <img
          src={photoSrc(31970867, 2000)}
          alt=""
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/85 via-espresso/80 to-espresso" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(200,164,78,0.18),transparent_55%)]" />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Monogram className="h-16 w-16 text-gold" />

        <h1 className="foil mt-6 font-display text-5xl tracking-[0.26em] sm:text-7xl">
          Yegesha Coffee
        </h1>
        <p className="mt-4 text-[11px] uppercase tracking-[0.6em] text-gold/70">
          Specialty Café & Roastery · Addis Ababa
        </p>

        <div className="mt-8 flex w-full max-w-xl items-center gap-4">
          <span className="h-px flex-1 bg-gold/25" />
          <span className="h-1 w-1 rotate-45 bg-gold/60" />
          <span className="h-px flex-1 bg-gold/25" />
        </div>

        <p className="mt-8 max-w-lg font-display text-xl leading-relaxed text-paper/80 sm:text-2xl">
          {brand.tagline} {brand.about}
        </p>

        <button
          type="button"
          onClick={() => navigate("/digital-menu")}
          className="group mt-10 inline-flex items-center gap-3 border border-gold/40 px-8 py-4 text-[11px] uppercase tracking-[0.42em] text-gold transition-all duration-500 hover:bg-gold hover:text-espresso"
        >
          Open the menu
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>

        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.34em] text-paper/40">
          {categories.map((category) => (
            <li key={category.id}>
              <span className="font-display text-[12px] text-gold/60">{category.numeral}</span>{" "}
              {category.title}
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative z-10 flex shrink-0 flex-col items-center gap-1 border-t border-gold/10 px-6 py-5 text-center text-[10px] uppercase tracking-[0.36em] text-paper/35">
        <span>{brand.address}</span>
        <span>{brand.hours}</span>
      </footer>
    </div>
  );
}
