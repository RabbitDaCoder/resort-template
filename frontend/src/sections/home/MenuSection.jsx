import { Link } from "react-router-dom";
import { menuCards } from "./homeContent";

export default function MenuSection() {
  return (
    <section className="relative overflow-hidden bg-cream-light py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="label-tag mb-4">Menu &amp; Bar</p>
            <h2 className="text-left font-serif text-5xl leading-none text-forest-dark sm:text-6xl">
              Dining Menus
            </h2>
            <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.35em] text-forest/70">
              Coastal flavors, crafted drinks, and sunset rituals.
            </p>
          </div>
          <div className="space-y-4 border-l border-cream-dark pl-6 text-sm text-charcoal/60">
            <p className="font-semibold text-forest-dark">Dining Hours</p>
            <p>Breakfast 7:00 - 10:30</p>
            <p>All-day menu 11:30 - 22:00</p>
            <p>Bar service 15:00 - 23:30</p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {menuCards.map((menuCard, index) => (
            <article
              key={menuCard.title}
              className={`group overflow-hidden rounded-none bg-white shadow-[0_24px_50px_rgba(44,34,28,0.08)] ${
                index === 1 ? "lg:translate-y-10" : ""
              }`}
            >
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={menuCard.image}
                  alt={menuCard.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-6 left-6 max-w-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/80">
                    {menuCard.title}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl text-white">
                    {menuCard.subtitle}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <span className="text-sm uppercase tracking-[0.3em] text-forest/70">
                  Menu details
                </span>
                <Link
                  to={menuCard.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-semibold text-forest hover:text-forest-dark transition-colors"
                >
                  {menuCard.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
