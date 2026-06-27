import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Users,
  BedDouble,
  Maximize2,
  MapPin,
  CalendarDays,
  Tag,
  Sparkles,
  Wifi,
  Coffee,
  Snowflake,
  ShieldCheck,
  Tv,
  Bath,
  Utensils,
  Waves,
  Car,
  Wind,
  Trees,
  Refrigerator,
  Droplet,
  X,
} from "lucide-react";
import { getRoomBySlug, getRooms } from "../services/api";

/* ------------------------------------------------------------------ */
/*  Brand palette                                                     */
/*    navy        #0a1f3d                                              */
/*    deep navy   #050d1f                                              */
/*    gold        #c9a36b                                              */
/*    gold soft   #d8b988                                              */
/*    santorini   #5a9bbf                                              */
/*    ivory       #f5f1e8                                              */
/* ------------------------------------------------------------------ */

const AMENITY_ICONS = {
  "air conditioner": Snowflake,
  "air conditioning": Snowflake,
  "wi-fi": Wifi,
  wifi: Wifi,
  "wi-fi access": Wifi,
  internet: Wifi,
  "tv (hd)": Tv,
  "cable tv": Tv,
  "led tv": Tv,
  tv: Tv,
  "coffee & tea": Coffee,
  coffee: Coffee,
  "in-room safety box": ShieldCheck,
  "in-room safe": ShieldCheck,
  "fire extinguisher": ShieldCheck,
  "mini refrigerator": Refrigerator,
  refrigerator: Refrigerator,
  "mini bar": Utensils,
  bar: Utensils,
  kitchen: Utensils,
  "dining table": Utensils,
  "bottled water": Droplet,
  "hot & cold shower": Bath,
  bathtub: Bath,
  "private bathtub": Bath,
  "common bathroom": Bath,
  "private pool": Waves,
  "infinity pool": Waves,
  "common infinity pool": Waves,
  parking: Car,
  "car garage": Car,
  balcony: Wind,
  "smoking area": Wind,
  bedroom: BedDouble,
  "living room": Sparkles,
  "kid friendly": Users,
  "pet friendly": Trees,
};

const iconForAmenity = (label) =>
  AMENITY_ICONS[
    String(label || "")
      .toLowerCase()
      .trim()
  ] || Sparkles;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { delay, duration: 1, ease: "easeOut" },
});

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
function Hero({ room, onOpenGallery }) {
  const cover =
    room.images?.[0] ||
    "https://image-tc.galaxy.tf/wijpeg-9g0c8e4jia8i8dw5hv5xd3r05/dss-website-banner-home-page-2.jpg";
  return (
    <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-[#050d1f]">
      <motion.img
        {...fadeIn()}
        src={cover}
        alt={room.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050d1f]/75 via-[#050d1f]/15 to-[#050d1f]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050d1f]/55 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 lg:px-10">
        <motion.nav
          {...fadeUp(0.1)}
          className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/55"
        >
          <Link to="/" className="transition hover:text-[#d8b988]">
            Home
          </Link>
          <span>/</span>
          <Link to="/rooms" className="transition hover:text-[#d8b988]">
            Rooms & Villas
          </Link>
          <span>/</span>
          <span className="text-[#d8b988]">{room.name}</span>
        </motion.nav>

        <motion.p
          {...fadeUp(0.18)}
          className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#d8b988]"
        >
          <span className="h-px w-10 bg-[#c9a36b]/70" />
          {room.category || "Accommodation"}
        </motion.p>
        <motion.h1
          {...fadeUp(0.28)}
          className="font-serif text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          {room.name}
        </motion.h1>
        {room.tagline && (
          <motion.p
            {...fadeUp(0.4)}
            className="mt-5 max-w-2xl font-serif text-lg italic text-[#d8b988] lg:text-xl"
          >
            {room.tagline}
          </motion.p>
        )}

        <motion.div
          {...fadeUp(0.5)}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/70"
        >
          {room.size && (
            <span className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-[#d8b988]" />
              {room.size}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#d8b988]" />
            Up to {room.maxGuests || room.occupancy || 2} guests
          </span>
          {room.bedType && (
            <span className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-[#d8b988]" />
              {room.bedType}
            </span>
          )}
          {room.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#d8b988]" />
              {room.location}
            </span>
          )}
        </motion.div>

        {Array.isArray(room.images) && room.images.length > 1 && (
          <motion.button
            {...fadeUp(0.6)}
            type="button"
            onClick={onOpenGallery}
            className="mt-10 inline-flex w-fit items-center gap-2 border border-[#c9a36b]/50 bg-white/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:bg-[#c9a36b] hover:text-[#050d1f]"
          >
            View Full Gallery ({room.images.length})
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a36b]/60 to-transparent z-10" />
    </section>
  );
}

/* ================================================================== */
/*  RESERVATION CARD (sticky)                                          */
/* ================================================================== */
function ReservationCard({ room }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(String(room.maxGuests || 2));

  const original = Number(
    room.originalPricePerNight ?? room.pricePerNight ?? 0,
  );
  const effective = Number(
    room.effectivePricePerNight ?? room.discountPrice ?? original,
  );
  const hasPromo = effective < original;

  const params = new URLSearchParams();
  params.set("room", room._id || room.slug);
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (guests) params.set("guests", guests);
  const href = `/booking?${params.toString()}`;

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="border border-[#0a1f3d]/10 bg-white shadow-[0_30px_80px_-40px_rgba(10,31,61,0.25)]">
        {/* gold hairline top */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a36b] to-transparent" />

        <div className="p-7 lg:p-8">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#5a9bbf]">
            ✦ Reserve this stay
          </p>

          <div className="mb-7 flex items-baseline gap-3">
            {hasPromo && (
              <span className="text-sm text-[#0a1f3d]/35 line-through">
                {formatPeso(original)}
              </span>
            )}
            <span className="font-serif text-4xl text-[#0a1f3d]">
              {formatPeso(effective)}
            </span>
            <span className="text-xs text-[#0a1f3d]/55">/ night</span>
          </div>

          {hasPromo && (
            <div className="mb-5 inline-block bg-[#c9a36b]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0a1f3d]">
              {room.discountLabel || "Best Rate Available"}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <SmallField label="Check-in" icon={CalendarDays}>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm text-[#0a1f3d] focus:outline-none"
              />
            </SmallField>
            <SmallField label="Check-out" icon={CalendarDays}>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm text-[#0a1f3d] focus:outline-none"
              />
            </SmallField>
            <SmallField label="Guests" icon={Users}>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-sm text-[#0a1f3d] focus:outline-none"
              >
                {[...Array(Math.max(8, room.maxGuests || 2)).keys()].map(
                  (i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ),
                )}
              </select>
            </SmallField>

            <Link
              to={href}
              className="group mt-2 flex items-center justify-center gap-2 bg-[#c9a36b] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#050d1f] transition hover:bg-[#d8b988]"
            >
              <Tag className="h-3.5 w-3.5" />
              Reserve Now
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              to="/contact"
              className="block text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0a1f3d]/55 underline-offset-8 transition hover:underline"
            >
              Or speak with concierge
            </Link>
          </form>

          <div className="mt-7 space-y-2 border-t border-[#0a1f3d]/10 pt-5 text-[11px] text-[#0a1f3d]/60">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c9a36b]" />
              Best rate guarantee
            </p>
            <p className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#c9a36b]" />
              Buffet breakfast included
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-[#c9a36b]" />
              Free cancellation up to 48h prior
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SmallField({ label, icon: Icon, children }) {
  return (
    <div className="border border-[#0a1f3d]/15 px-4 py-3">
      <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#0a1f3d]/55">
        <Icon className="h-3 w-3 text-[#c9a36b]" /> {label}
      </p>
      {children}
    </div>
  );
}

/* ================================================================== */
/*  OVERVIEW + AMENITIES                                               */
/* ================================================================== */
function Overview({ room }) {
  return (
    <div className="space-y-12">
      {/* Description */}
      <motion.div {...fadeUp()}>
        <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#5a9bbf]">
          <span className="h-px w-10 bg-[#c9a36b]" />
          The stay
        </p>
        <h2 className="mb-7 font-serif text-3xl leading-tight text-[#0a1f3d] lg:text-4xl">
          A room with a <span className="italic text-[#c9a36b]">view</span>.
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-[#0a1f3d]/70">
          <p>{room.description}</p>
          {room.intro && <p>{room.intro}</p>}
        </div>
      </motion.div>

      {/* Amenities */}
      {Array.isArray(room.features) && room.features.length > 0 && (
        <motion.div {...fadeUp(0.1)}>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#5a9bbf]">
            <span className="h-px w-10 bg-[#c9a36b]" />
            In your suite
          </p>
          <h3 className="mb-7 font-serif text-2xl text-[#0a1f3d] lg:text-3xl">
            Amenities & inclusions
          </h3>
          <div className="grid gap-px bg-[#0a1f3d]/8 sm:grid-cols-2 lg:grid-cols-3">
            {room.features.map((f) => {
              const Icon = iconForAmenity(f);
              return (
                <div
                  key={f}
                  className="flex items-center gap-4 bg-white px-5 py-4 transition hover:bg-[#f5f1e8]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#c9a36b]/30 bg-[#f5f1e8]">
                    <Icon className="h-4 w-4 text-[#c9a36b]" />
                  </span>
                  <span className="text-sm text-[#0a1f3d]/75">{f}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Specs */}
      <motion.div {...fadeUp(0.15)}>
        <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#5a9bbf]">
          <span className="h-px w-10 bg-[#c9a36b]" />
          The details
        </p>
        <h3 className="mb-7 font-serif text-2xl text-[#0a1f3d] lg:text-3xl">
          Suite specifications
        </h3>
        <dl className="grid gap-px bg-[#0a1f3d]/8 sm:grid-cols-2">
          <SpecItem label="Size" value={room.size || "—"} icon={Maximize2} />
          <SpecItem
            label="Maximum Guests"
            value={`${room.maxGuests || room.occupancy || 2} guests`}
            icon={Users}
          />
          <SpecItem
            label="Bed Configuration"
            value={room.bedType || "Premium bedding"}
            icon={BedDouble}
          />
          <SpecItem
            label="Category"
            value={room.category || "Accommodation"}
            icon={Sparkles}
          />
          <SpecItem
            label="Location"
            value={room.location || "Samal Island, Davao del Norte"}
            icon={MapPin}
          />
          <SpecItem
            label="Check-in / out"
            value="2:00 PM / 12:00 NN"
            icon={CalendarDays}
          />
        </dl>
      </motion.div>
    </div>
  );
}

function SpecItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 bg-white p-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#c9a36b]/30 bg-[#f5f1e8]">
        <Icon className="h-4 w-4 text-[#c9a36b]" />
      </span>
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0a1f3d]/55">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-[#0a1f3d]/85">{value}</dd>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  GALLERY GRID + LIGHTBOX                                            */
/* ================================================================== */
function GallerySection({ images, onOpen }) {
  if (!Array.isArray(images) || images.length < 2) return null;
  const display = images.slice(0, 7);
  return (
    <section className="bg-[#f5f1e8] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp()} className="mb-12">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#5a9bbf]">
            <span className="h-px w-10 bg-[#c9a36b]" />
            Gallery
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-4xl text-[#0a1f3d] lg:text-5xl">
              In <span className="italic text-[#c9a36b]">moments</span>.
            </h2>
            <button
              type="button"
              onClick={() => onOpen(0)}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0a1f3d] underline-offset-8 transition hover:underline"
            >
              View all {images.length} →
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {display.map((src, i) => {
            const isFeature = i === 0;
            return (
              <motion.button
                {...fadeUp(i * 0.05)}
                key={src + i}
                type="button"
                onClick={() => onOpen(i)}
                className={`group relative overflow-hidden ${
                  isFeature
                    ? "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2"
                    : ""
                }`}
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className={`w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06] ${
                    isFeature ? "h-72 lg:h-[480px]" : "h-44 lg:h-[232px]"
                  }`}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-[#050d1f]/0 transition group-hover:bg-[#050d1f]/20" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050d1f]/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 grid h-12 w-12 place-items-center border border-white/20 text-white transition hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/20 text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/20 text-white transition hover:bg-white/10"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <motion.img
          key={images[index]}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          src={images[index]}
          alt={`Image ${index + 1}`}
          className="max-h-[90vh] max-w-[92vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.32em] text-white/60">
          {index + 1} / {images.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ================================================================== */
/*  RELATED ROOMS                                                      */
/* ================================================================== */
function RelatedRooms({ rooms, currentSlug }) {
  const others = useMemo(
    () =>
      rooms
        .filter((r) => r.slug !== currentSlug && r.available !== false)
        .slice(0, 3),
    [rooms, currentSlug],
  );

  if (others.length === 0) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp()} className="mb-12 text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#5a9bbf]">
            <span className="h-px w-10 bg-[#c9a36b]" />
            More to discover
            <span className="h-px w-10 bg-[#c9a36b]" />
          </p>
          <h2 className="font-serif text-4xl text-[#0a1f3d] lg:text-5xl">
            Other <span className="italic text-[#c9a36b]">stays</span>.
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {others.map((r, i) => {
            const original = Number(r.pricePerNight || 0);
            const effective = Number(r.discountPrice || original);
            const hasPromo = effective < original;
            return (
              <motion.article
                {...fadeUp(i * 0.08)}
                key={r._id || r.slug}
                className="group flex flex-col overflow-hidden border border-[#0a1f3d]/8 bg-white"
              >
                <Link
                  to={`/rooms/${r.slug}`}
                  className="relative block h-64 overflow-hidden"
                >
                  <img
                    src={r.images?.[0]}
                    alt={r.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  {hasPromo && (
                    <span className="absolute left-4 top-4 bg-[#c9a36b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#050d1f]">
                      {r.discountLabel || "Best Rate"}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#5a9bbf]">
                      {r.category || "Stay"}
                    </p>
                    <h3 className="mb-3 font-serif text-xl text-[#0a1f3d]">
                      {r.name}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-[#0a1f3d]/60">
                      {r.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-[#0a1f3d]/10 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#0a1f3d]/45">
                        From
                      </span>
                      <p className="font-serif text-xl text-[#0a1f3d]">
                        {formatPeso(effective)}
                      </p>
                    </div>
                    <Link
                      to={`/rooms/${r.slug}`}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0a1f3d] transition hover:text-[#c9a36b]"
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function RoomDetails() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRoomBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data || res.data;
        setRoom(data || null);
      })
      .catch(() => mounted && setRoom(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let mounted = true;
    getRooms({ available: true })
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.data || res.data || [];
        setRelated(Array.isArray(list) ? list : []);
      })
      .catch(() => mounted && setRelated([]));
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="grid min-h-[80vh] place-items-center bg-[#f5f1e8]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border border-[#c9a36b]/30 border-t-[#c9a36b]" />
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#0a1f3d]/45">
            Preparing your stay
          </p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="grid min-h-[80vh] place-items-center bg-[#f5f1e8] px-6">
        <div className="max-w-md text-center">
          <p className="mb-4 font-serif text-4xl text-[#0a1f3d]">
            This stay isn't available
          </p>
          <p className="mb-8 leading-relaxed text-[#0a1f3d]/60">
            The accommodation you were looking for can no longer be found.
            Browse our other rooms to find your retreat.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 bg-[#0a1f3d] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#050d1f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(room.images) ? room.images : [];
  const openGallery = (i = 0) => setLightbox({ open: true, index: i });
  const closeGallery = () => setLightbox({ open: false, index: 0 });
  const prev = () =>
    setLightbox((s) => ({
      ...s,
      index: (s.index - 1 + images.length) % images.length,
    }));
  const next = () =>
    setLightbox((s) => ({
      ...s,
      index: (s.index + 1) % images.length,
    }));

  return (
    <div className="bg-[#f5f1e8]">
      <Hero room={room} onOpenGallery={() => openGallery(0)} />

      {/* Two-column body */}
      <section className="bg-[#f5f1e8] py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:px-10">
          <div>
            <Overview room={room} />
          </div>
          <ReservationCard room={room} />
        </div>
      </section>

      <GallerySection images={images} onOpen={openGallery} />
      <RelatedRooms rooms={related} currentSlug={room.slug} />

      {/* Final CTA */}
      <section className="bg-[#0a1f3d] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <motion.h2
            {...fadeUp()}
            className="font-serif text-4xl leading-tight lg:text-5xl"
          >
            Your <span className="italic text-[#d8b988]">{room.name}</span>{" "}
            awaits.
          </motion.h2>
          <motion.div
            {...fadeUp(0.15)}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to={`/booking?room=${room._id || room.slug}`}
              className="inline-flex items-center gap-3 bg-[#c9a36b] px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#050d1f] transition hover:bg-[#d8b988]"
            >
              <Tag className="h-3.5 w-3.5" />
              Reserve Now
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 underline-offset-8 transition hover:text-[#d8b988] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Explore Other Rooms
            </Link>
          </motion.div>
        </div>
      </section>

      {lightbox.open && (
        <Lightbox
          images={images}
          index={lightbox.index}
          onClose={closeGallery}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
