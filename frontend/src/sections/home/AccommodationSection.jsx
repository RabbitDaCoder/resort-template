import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getRooms } from "../../services/api";

const SUND = "https://lirp.cdn-website.com/b434b26a/dms3rep/multi/opt";

const FALLBACK_IMAGES = [
  `${SUND}/2BR+POOL+VILLA+LEFT+WING+3-1920w.jpeg`,
  `${SUND}/2+BEDROOM+DUPLEX5-1920w.jpeg`,
  `${SUND}/154685286600-1920w.jpeg`,
  `${SUND}/2BR+Pool+Villa+r-Wing+5-1920w.jpeg`,
  `${SUND}/3BR+Pool+Villa+10-1920w.jpeg`,
  `${SUND}/3+BEDROOM+15-1920w.jpeg`,
  `${SUND}/IMG_9301-3a6b22d3-1920w.jpeg`,
];

const FALLBACK_VILLAS = [
  {
    name: "Pool Villa",
    occupancy: "2 Guests · King Bed · Private Pool",
    price: "From ₱9,500 / night",
    image: `${SUND}/2BR+POOL+VILLA+LEFT+WING+3-1920w.jpeg`,
  },
  {
    name: "Plunge Pool Villa",
    occupancy: "4 Guests · 2 Bedrooms · Plunge Pool",
    price: "From ₱14,500 / night",
    image: `${SUND}/2+BEDROOM+DUPLEX5-1920w.jpeg`,
  },
  {
    name: "Beachfront Villa",
    occupancy: "6 Guests · Sea View · Direct Beach Access",
    price: "From ₱17,500 / night",
    image: `${SUND}/154685286600-1920w.jpeg`,
  },
];

export default function AccommodationSection() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getRooms({ available: true });
        const data = res?.data?.data ?? res?.data ?? res;
        if (active && Array.isArray(data) && data.length) {
          setRooms(data.slice(0, 3));
        }
      } catch {
        /* fallback handled below */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const villas = rooms.length
    ? rooms.map((r, i) => ({
        slug: r.slug,
        name: r.name,
        occupancy: r.occupancy || `Up to ${r.capacity || 2} Guests`,
        price: r.price
          ? `From ₱${Number(r.price).toLocaleString()} / night`
          : "",
        image:
          r.images?.[0] ||
          r.image ||
          FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      }))
    : FALLBACK_VILLAS;

  return (
    <section className="bg-warm-white py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 lg:mb-20 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal">
              The Villas
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.1] text-charcoal sm:text-5xl lg:text-[56px]">
              Accommodations <br className="hidden sm:block" />
              By The Sea
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.85] text-charcoal/70">
            Three distinct villa experiences — each thoughtfully designed with
            private outdoor spaces, soft natural materials, and uninterrupted
            views of the coast.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {villas.map((villa, i) => (
            <motion.article
              key={villa.slug || villa.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="group flex flex-col"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5] w-full overflow-hidden bg-charcoal/5">
                  <img
                    src={villa.image}
                    alt={villa.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
              </div>

              <div className="pt-7">
                <h3 className="font-serif text-2xl font-light text-charcoal sm:text-[28px]">
                  {villa.name}
                </h3>
                <p className="mt-2 text-[13px] uppercase tracking-[0.18em] text-charcoal/55">
                  {villa.occupancy}
                </p>
                {villa.price && (
                  <p className="mt-4 text-sm font-medium text-teal">
                    {villa.price}
                  </p>
                )}
                <Link
                  to={villa.slug ? `/rooms/${villa.slug}` : "/rooms"}
                  className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal transition-colors hover:text-teal"
                >
                  Discover Villa
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-20 flex justify-center">
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center border border-charcoal/30 px-12 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-charcoal transition-colors hover:border-teal hover:bg-teal hover:text-white"
          >
            View All Villas
          </Link>
        </div>
      </div>
    </section>
  );
}
