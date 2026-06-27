import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Users,
  ChevronRight,
  ChevronLeft,
  Bed,
  BedDouble,
  Check,
  Maximize2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Plus,
  Minus,
  Flame,
  Palmtree,
  Gem,
  Waves,
  Heart,
  Plane,
  UtensilsCrossed,
  Wifi,
  PawPrint,
  Baby,
  Coffee,
} from "lucide-react";
import toast from "react-hot-toast";
import { getRooms, createBooking } from "../services/api";
import { useBookingSettings } from "../hooks/useBookingSettings";
import BookingCalendar from "../components/booking/BookingCalendar";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Dates", icon: CalendarDays },
  { label: "Villa", icon: Bed },
  { label: "Guest", icon: Users },
  { label: "Review", icon: ShieldCheck },
];

const INCLUDED_BENEFITS = [
  "Breakfast, Lunch & Dinner Buffet",
  "Beachfront & Resort Access",
  "Welcome Drinks",
  "Free WiFi",
  "Pet Friendly",
];

const INCLUDED_PACKAGE = [
  { icon: UtensilsCrossed, label: "Breakfast, Lunch & Dinner Buffet" },
  { icon: Coffee, label: "Unlimited Drinks During Meals" },
  { icon: Plane, label: "Round-trip Airport Transfer" },
  { icon: Waves, label: "Beachfront & Pool Access" },
  { icon: Wifi, label: "Complimentary High-Speed WiFi" },
  { icon: PawPrint, label: "Pet-Friendly Accommodation" },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Best-rate guarantee" },
  { icon: Plane, label: "Free airport transfer" },
  { icon: Sparkles, label: "Instant confirmation" },
  { icon: Heart, label: "Family & pet friendly" },
];

/**
 * Derive luxury status tags from existing room fields.
 * Pure frontend — no schema change.
 */
function deriveRoomTags(room) {
  const tags = [];
  const cat = String(room?.category || "").toLowerCase();
  const view = String(room?.viewType || "").toLowerCase();
  const name = String(room?.name || "").toLowerCase();
  const cap = room?.maxGuests || room?.capacity || room?.occupancy || 0;
  if (/villa|luxury|premier|suite/.test(cat + " " + name))
    tags.push({ icon: Gem, label: "Luxury Suite", tone: "gold" });
  if (/beach/.test(view + " " + name + " " + cat))
    tags.push({ icon: Palmtree, label: "Beachfront", tone: "teal" });
  if (/pool/.test(view + " " + name))
    tags.push({ icon: Waves, label: "Pool View", tone: "teal" });
  if (cap >= 4)
    tags.push({ icon: Heart, label: "Family Favorite", tone: "warm" });
  return tags.slice(0, 2);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmt(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fmtDisplay(d) {
  if (!d) return "—";
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const fadeIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: "easeOut" },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ------- Booking settings from admin -------------------------- */
  const { data: bookingSettings } = useBookingSettings();
  const maxGuestsPerBooking = bookingSettings?.maxGuestsPerBooking ?? 50;

  /* ------- State (all preserved) -------------------------------- */
  const [step, setStep] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const numberOfGuests = guests.adults + guests.children;

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preselectedRoom = searchParams.get("room");

  /* ------- Data fetching (preserved) ---------------------------- */
  useEffect(() => {
    const params = { available: true };
    if (checkIn) params.checkIn = fmt(checkIn);
    if (checkOut) params.checkOut = fmt(checkOut);

    setLoading(true);
    getRooms(params)
      .then((roomsRes) => {
        const rd = roomsRes.data.data || roomsRes.data;
        setRooms(Array.isArray(rd) ? rd : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (preselectedRoom && rooms.length > 0) {
      const room = rooms.find((r) => r._id === preselectedRoom);
      if (room) setSelectedRoom(room);
    }
  }, [preselectedRoom, rooms]);

  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  const totalAmount =
    nights > 0 && selectedRoom
      ? nights * (selectedRoom.discountPrice || selectedRoom.pricePerNight)
      : 0;

  const availableRooms = useMemo(() => {
    if (!checkIn || !checkOut) return rooms;
    return rooms.filter((r) => {
      // If room has no capacity metadata, don't hide it — show it.
      const cap = r.maxGuests || r.capacity || r.occupancy;
      if (!cap) return true;
      return cap >= numberOfGuests;
    });
  }, [rooms, checkIn, checkOut, numberOfGuests]);

  /* ------- Step navigation (preserved) -------------------------- */
  const handleSelectRange = (ci, co) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  const skipRoomStep = !!(preselectedRoom && selectedRoom);

  const nextStep = (from) => {
    if (from === 0 && skipRoomStep) return 2;
    return from + 1;
  };
  const prevStep = (from) => {
    if (from === 2 && skipRoomStep) return 0;
    return from - 1;
  };

  const canNextStep = () => {
    switch (step) {
      case 0:
        return checkIn && checkOut && nights > 0;
      case 1:
        return selectedRoom !== null;
      case 2:
        return form.guestName && form.guestEmail && form.guestPhone;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await createBooking({
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        numberOfGuests,
        specialRequests: form.specialRequests,
        room: selectedRoom._id,
        checkIn: fmt(checkIn),
        checkOut: fmt(checkOut),
      });
      const booking = res.data.data || res.data;
      toast.success("Reservation submitted. Continue to payment.");
      navigate(`/booking/${booking._id}/payment`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-white min-h-screen">
      <ConciergeHero />

      <Stepper step={step} setStep={setStep} skipRoomStep={skipRoomStep} />
      <TrustStrip />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step-0" {...fadeIn}>
                <StepDates
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  guests={guests}
                  setGuests={setGuests}
                  numberOfGuests={numberOfGuests}
                  onSelectRange={handleSelectRange}
                  onNext={() => setStep(nextStep(0))}
                  canNext={canNextStep()}
                  skipRoomStep={skipRoomStep}
                  maxGuestsPerBooking={maxGuestsPerBooking}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step-1" {...fadeIn}>
                <StepRooms
                  rooms={availableRooms}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  onChangeDates={() => setStep(0)}
                  onPicked={() => setStep(2)}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  numberOfGuests={numberOfGuests}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" {...fadeIn}>
                <StepGuest
                  form={form}
                  setForm={setForm}
                  onBack={() => setStep(prevStep(2))}
                  onNext={() => setStep(3)}
                  canNext={canNextStep()}
                  selectedRoom={selectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  numberOfGuests={numberOfGuests}
                  totalAmount={totalAmount}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step-3" {...fadeIn}>
                <StepReview
                  form={form}
                  selectedRoom={selectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  numberOfGuests={numberOfGuests}
                  totalAmount={totalAmount}
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function ConciergeHero() {
  return (
    <section className="relative h-[44vh] min-h-[320px] overflow-hidden bg-teal-dark">
      <img
        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/70" />
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full pb-14 lg:pb-20 text-white">
          <p className="text-[11px] tracking-[0.35em] uppercase text-white/75 font-medium">
            Reservations · Samal Island, Davao del Norte
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mt-5 leading-[1.05]">
            Reserve your villa.
          </h1>
          <p className="mt-5 max-w-xl text-white/75 leading-relaxed font-light">
            A few quiet steps with our concierge. We'll guide you through dates,
            your villa, and a calm, secure payment.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

function Stepper({ step, setStep, skipRoomStep }) {
  return (
    <div className="bg-warm-white border-b border-charcoal/10">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 py-7 overflow-x-auto">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            const clickable = i < step && !(i === 1 && skipRoomStep);
            return (
              <button
                key={s.label}
                onClick={() => clickable && setStep(i)}
                disabled={!clickable}
                className={`flex items-center gap-3 shrink-0 transition-colors ${
                  clickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-teal text-white"
                      : done
                        ? "bg-teal-dark text-white"
                        : "border border-charcoal/20 text-charcoal/35"
                  }`}
                >
                  {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                </span>
                <span
                  className={`text-[11px] tracking-[0.28em] uppercase font-medium hidden sm:inline ${
                    active
                      ? "text-teal-dark"
                      : done
                        ? "text-charcoal/70"
                        : "text-charcoal/35"
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="hidden sm:inline-block w-12 h-px bg-charcoal/15 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 0 — DATES                                                      */
/* ------------------------------------------------------------------ */

function StepDates({
  checkIn,
  checkOut,
  nights,
  guests,
  setGuests,
  numberOfGuests,
  onSelectRange,
  onNext,
  canNext,
  skipRoomStep,
  maxGuestsPerBooking,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7">
        <SectionEyebrow>The Calendar</SectionEyebrow>
        <h2 className="font-serif text-4xl text-teal-dark mt-3 leading-tight">
          When will you be staying?
        </h2>
        <p className="mt-4 text-charcoal/60 leading-relaxed font-light max-w-md">
          Select your arrival, then your departure. Past dates are unavailable.
        </p>

        <div className="mt-10 bg-warm-white border border-charcoal/10 p-6 lg:p-8">
          <BookingCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onSelectRange={onSelectRange}
          />
        </div>

        <IncludedPackageBlock />
      </div>

      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 bg-warm-white border border-charcoal/10 p-8 shadow-[0_20px_50px_-30px_rgba(13,59,66,0.2)]">
          <SectionEyebrow>Trip Details</SectionEyebrow>
          <h3 className="font-serif text-2xl text-teal-dark mt-3">Your stay</h3>

          <div className="mt-7 space-y-5">
            <DateBlock label="Check-in" value={fmtDisplay(checkIn)} />
            <DateBlock label="Check-out" value={fmtDisplay(checkOut)} />
            {nights > 0 && (
              <p className="text-sm text-tan font-medium">
                {nights} night{nights > 1 ? "s" : ""} · 2:00 PM check-in, 11:00
                AM check-out
              </p>
            )}
          </div>

          <div className="mt-8 pt-7 border-t border-charcoal/10">
            <label className="block text-[10px] tracking-[0.28em] uppercase text-charcoal/40 font-medium mb-4">
              Guests
            </label>
            <GuestSelector
              guests={guests}
              setGuests={setGuests}
              maxGuestsPerBooking={maxGuestsPerBooking}
            />
          </div>

          <button
            onClick={onNext}
            disabled={!canNext}
            className="mt-8 w-full bg-teal text-white py-4 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {skipRoomStep ? "Continue to Guest" : "Choose your villa"}
            <ChevronRight size={14} />
          </button>

          <p className="mt-5 text-[11px] text-charcoal/45 leading-relaxed text-center">
            Best rate guaranteed when booking direct.
          </p>
        </div>
      </aside>
    </div>
  );
}

function DateBlock({ label, value }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.28em] uppercase text-charcoal/40 font-medium">
        {label}
      </p>
      <p className="mt-1.5 font-serif text-xl text-teal-dark">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 1 — ROOMS                                                      */
/* ------------------------------------------------------------------ */

function StepRooms({
  rooms,
  selectedRoom,
  setSelectedRoom,
  onChangeDates,
  onPicked,
  checkIn,
  checkOut,
  nights,
  numberOfGuests,
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <SectionEyebrow>Choose your villa</SectionEyebrow>
          <h2 className="font-serif text-4xl text-teal-dark mt-3 leading-tight">
            Curated stays for your dates.
          </h2>
          <p className="mt-3 text-charcoal/55 text-sm">
            {fmtDisplay(checkIn)} — {fmtDisplay(checkOut)} · {numberOfGuests}{" "}
            guest{numberOfGuests > 1 ? "s" : ""} · {nights} night
            {nights > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onChangeDates}
          className="text-[11px] tracking-[0.28em] uppercase text-teal-dark border-b border-teal-dark pb-1 hover:text-teal transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={13} /> Change dates
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-charcoal/15">
          <p className="text-charcoal/60 mb-4">
            No villas available for those dates and guest count.
          </p>
          <button
            onClick={onChangeDates}
            className="text-tan border-b border-tan pb-1 text-sm hover:text-teal-dark transition-colors"
          >
            Try different dates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              selected={selectedRoom?._id === room._id}
              nights={nights}
              onSelect={() => {
                setSelectedRoom(room);
                onPicked();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, selected, nights, onSelect }) {
  const originalPrice = Number(
    room.originalPricePerNight ?? room.pricePerNight ?? 0,
  );
  const price = Number(
    room.effectivePricePerNight ?? room.discountPrice ?? originalPrice,
  );
  const hasDiscount = price < originalPrice;
  const savings = hasDiscount ? originalPrice - price : 0;
  const offPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const tags = deriveRoomTags(room);
  // Placeholder urgency \u2014 deterministic from slug so it doesn't flicker on rerender.
  const urgencyVariants = [
    { icon: Flame, label: "In high demand" },
    { icon: Sparkles, label: "Popular this week" },
    { icon: Flame, label: "Booked often" },
  ];
  const slug = String(room.slug || room._id || "");
  const urgency =
    urgencyVariants[
      slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
        urgencyVariants.length
    ];

  const toneCls = {
    gold: "bg-bs-cream text-bs-brown border-bs-gold/40",
    teal: "bg-seafoam text-teal-dark border-teal/25",
    warm: "bg-warm-white text-teal-dark border-charcoal/15",
  };

  return (
    <button
      onClick={onSelect}
      className={`group text-left bg-warm-white transition-all duration-300 ${
        selected
          ? "ring-2 ring-teal shadow-[0_24px_60px_-30px_rgba(13,59,66,0.35)]"
          : "border border-charcoal/8 hover:border-charcoal/20 hover:shadow-[0_20px_44px_-30px_rgba(13,59,66,0.25)]"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-seafoam">
        {room.images?.[0] ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sage to-teal" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* Status tag chips (top-left) */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
            {tags.map(({ icon: Icon, label, tone }) => (
              <span
                key={label}
                className={`backdrop-blur-md bg-warm-white/85 text-[10px] tracking-[0.16em] uppercase font-semibold px-2.5 py-1 border ${toneCls[tone] || toneCls.warm} inline-flex items-center gap-1.5`}
              >
                <Icon size={10} strokeWidth={2} /> {label}
              </span>
            ))}
          </div>
        )}

        {/* Discount badge (top-right) */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span className="bg-bs-gold text-white text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 shadow-[0_8px_20px_-8px_rgba(212,160,23,0.7)]">
              {offPct}% Off
            </span>
            {selected && (
              <span className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center">
                <Check size={13} strokeWidth={2.5} />
              </span>
            )}
          </div>
        )}
        {!hasDiscount && selected && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center">
            <Check size={13} strokeWidth={2.5} />
          </div>
        )}

        {/* Bottom row: category + urgency */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="text-[10px] tracking-[0.28em] uppercase text-white/95 drop-shadow-sm">
            {room.category}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-warm-white/95 backdrop-blur-sm text-teal-dark text-[10px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1 shadow-sm">
            <urgency.icon
              size={10}
              strokeWidth={2.2}
              className="text-bs-gold"
            />
            {urgency.label}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl text-teal-dark group-hover:text-teal transition-colors">
          {room.name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-charcoal/55">
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            Up to {room.maxGuests || room.capacity || room.occupancy || 2}{" "}
            guests
          </span>
          {room.bedType && (
            <span className="flex items-center gap-1.5">
              <Bed size={12} />
              {room.bedType}
            </span>
          )}
          {room.size && (
            <span className="flex items-center gap-1.5">
              <Maximize2 size={12} />
              {room.size}
            </span>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-charcoal/8">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl text-teal-dark tracking-tight">
                ₱{price.toLocaleString()}
              </span>
              <span className="text-xs text-charcoal/50">/ night</span>
            </div>
            {hasDiscount && (
              <span className="text-xs text-charcoal/35 line-through">
                ₱{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="mt-1.5 text-[11px] tracking-wide text-tan font-semibold">
              Save ₱{savings.toLocaleString()} per night
            </p>
          )}
          {nights > 0 && (
            <p className="mt-2 text-[11px] text-charcoal/55">
              ₱{(price * nights).toLocaleString()} for {nights} night
              {nights > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-teal-dark font-semibold border-b border-teal-dark/40 pb-1 group-hover:border-teal-dark transition-colors">
          {selected ? "Selected" : "Reserve this villa"}
          <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 2 — GUEST                                                      */
/* ------------------------------------------------------------------ */

function StepGuest({
  form,
  setForm,
  onBack,
  onNext,
  canNext,
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  numberOfGuests,
  totalAmount,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7">
        <SectionEyebrow>Your Details</SectionEyebrow>
        <h2 className="font-serif text-4xl text-teal-dark mt-3 leading-tight">
          A few details for our concierge.
        </h2>
        <p className="mt-4 text-charcoal/60 leading-relaxed font-light max-w-md">
          We'll send your reservation confirmation here and reach out only when
          needed.
        </p>

        <div className="mt-10 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full name *">
              <input
                type="text"
                value={form.guestName}
                onChange={(e) =>
                  setForm({ ...form, guestName: e.target.value })
                }
                placeholder="Juan Dela Cruz"
                className={inputCls}
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                value={form.guestEmail}
                onChange={(e) =>
                  setForm({ ...form, guestEmail: e.target.value })
                }
                placeholder="juan@email.com"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Phone *">
            <input
              type="tel"
              value={form.guestPhone}
              onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
              placeholder="+63 908 715 8160"
              className={inputCls}
            />
          </Field>

          <Field label="Special requests">
            <textarea
              value={form.specialRequests}
              onChange={(e) =>
                setForm({ ...form, specialRequests: e.target.value })
              }
              rows={4}
              placeholder="Early check-in, dietary preferences, celebrations..."
              className={inputCls}
            />
          </Field>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={onBack}
            className="border border-charcoal/20 text-charcoal/65 px-7 py-4 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-charcoal/5 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="flex-1 min-w-[240px] bg-teal text-white px-8 py-4 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Review reservation <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <SummaryPanel
          selectedRoom={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          numberOfGuests={numberOfGuests}
          totalAmount={totalAmount}
        />
      </aside>
    </div>
  );
}

const inputCls =
  "w-full bg-warm-white border border-charcoal/15 px-4 py-3.5 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-teal transition-colors";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.28em] uppercase text-charcoal/40 font-medium mb-2.5">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* STEP 3 — REVIEW                                                     */
/* ------------------------------------------------------------------ */

function StepReview({
  form,
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  numberOfGuests,
  totalAmount,
  onBack,
  onSubmit,
  submitting,
  error,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7">
        <SectionEyebrow>Review</SectionEyebrow>
        <h2 className="font-serif text-4xl text-teal-dark mt-3 leading-tight">
          A final look before we hold your villa.
        </h2>

        {error && (
          <div className="mt-8 border-l-2 border-red-400 bg-red-50/60 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 bg-warm-white border border-charcoal/10 p-8 lg:p-10">
          {/* Villa */}
          <div className="flex gap-5 pb-7 border-b border-charcoal/10">
            {selectedRoom?.images?.[0] && (
              <div className="w-28 h-28 shrink-0 overflow-hidden">
                <img
                  src={selectedRoom.images[0]}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-[10px] tracking-[0.28em] uppercase text-tan font-medium">
                {selectedRoom?.category}
              </p>
              <h3 className="font-serif text-2xl text-teal-dark mt-1.5">
                {selectedRoom?.name}
              </h3>
              {selectedRoom?.bedType && (
                <p className="text-sm text-charcoal/55 mt-1">
                  {selectedRoom.bedType}
                </p>
              )}
            </div>
          </div>

          {/* Stay */}
          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 pb-7 border-b border-charcoal/10">
            <ReviewItem label="Check-in" value={fmtDisplay(checkIn)} />
            <ReviewItem label="Check-out" value={fmtDisplay(checkOut)} />
            <ReviewItem label="Guests" value={numberOfGuests} />
            <ReviewItem
              label="Nights"
              value={`${nights} night${nights > 1 ? "s" : ""}`}
            />
          </dl>

          {/* Guest */}
          <dl className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <ReviewItem label="Guest" value={form.guestName} />
            <ReviewItem label="Email" value={form.guestEmail} />
            <ReviewItem label="Phone" value={form.guestPhone} />
            {form.specialRequests && (
              <div className="md:col-span-2">
                <ReviewItem
                  label="Special requests"
                  value={form.specialRequests}
                />
              </div>
            )}
          </dl>
        </div>

        {/* How it works */}
        <div className="mt-10 bg-seafoam/40 p-8">
          <p className="text-[10px] tracking-[0.28em] uppercase text-tan font-medium">
            What happens next
          </p>
          <ol className="mt-5 grid sm:grid-cols-2 gap-5 text-sm text-charcoal/70">
            {[
              "Confirm your reservation",
              "Choose payment method",
              "Upload payment proof",
              "Confirmation within 24 hours",
            ].map((line, i) => (
              <li key={line} className="flex items-start gap-3">
                <span className="font-serif text-tan w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-light">{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={onBack}
            className="border border-charcoal/20 text-charcoal/65 px-7 py-4 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-charcoal/5 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 min-w-[240px] bg-teal-dark text-white px-8 py-4 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-teal transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Holding your villa…" : "Confirm reservation"}
            {!submitting && <Sparkles size={14} />}
          </button>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <SummaryPanel
          selectedRoom={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          numberOfGuests={numberOfGuests}
          totalAmount={totalAmount}
        />
      </aside>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.28em] uppercase text-charcoal/40 font-medium">
        {label}
      </dt>
      <dd className="mt-1.5 text-charcoal/85">{value || "—"}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SUMMARY PANEL (sticky right column)                                 */
/* ------------------------------------------------------------------ */

function SummaryPanel({
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  numberOfGuests,
  totalAmount,
}) {
  const price = selectedRoom?.discountPrice || selectedRoom?.pricePerNight;
  const hasDiscount =
    selectedRoom?.discountPrice &&
    selectedRoom.discountPrice < selectedRoom.pricePerNight;

  return (
    <div className="lg:sticky lg:top-28 bg-white border border-charcoal/10 p-8 shadow-[0_20px_50px_-30px_rgba(13,59,66,0.2)]">
      <p className="text-[10px] tracking-[0.28em] uppercase text-tan font-medium">
        Reservation Summary
      </p>

      {selectedRoom ? (
        <>
          {selectedRoom.images?.[0] && (
            <div className="mt-5 aspect-[4/3] overflow-hidden">
              <img
                src={selectedRoom.images[0]}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h3 className="mt-5 font-serif text-2xl text-teal-dark">
            {selectedRoom.name}
          </h3>
          {selectedRoom.bedType && (
            <p className="mt-1 text-xs text-charcoal/50">
              {selectedRoom.bedType}
            </p>
          )}
        </>
      ) : (
        <div className="mt-5 aspect-[4/3] bg-seafoam flex items-center justify-center text-[11px] tracking-[0.28em] uppercase text-charcoal/35">
          Select a villa
        </div>
      )}

      <dl className="mt-7 space-y-4 text-sm border-t border-charcoal/10 pt-6">
        <SummaryRow icon={CalendarDays}>
          {checkIn && checkOut
            ? `${fmtDisplay(checkIn)} — ${fmtDisplay(checkOut)}`
            : "Select dates"}
        </SummaryRow>
        <SummaryRow icon={Users}>
          {numberOfGuests} guest{numberOfGuests > 1 ? "s" : ""}
        </SummaryRow>
        {nights > 0 && selectedRoom && (
          <SummaryRow icon={MapPin}>
            {nights} night{nights > 1 ? "s" : ""} ·{" "}
            {hasDiscount ? (
              <>
                <span className="line-through text-charcoal/30 mr-1">
                  ₱{selectedRoom.pricePerNight.toLocaleString()}
                </span>
                ₱{price.toLocaleString()}
              </>
            ) : (
              `₱${price?.toLocaleString()}`
            )}
          </SummaryRow>
        )}
      </dl>

      {totalAmount > 0 && (
        <div className="mt-7 pt-6 border-t border-charcoal/10 flex justify-between items-baseline">
          <span className="text-[10px] tracking-[0.28em] uppercase text-charcoal/45 font-medium">
            Estimated total
          </span>
          <span className="font-serif text-3xl text-teal-dark">
            ₱{totalAmount.toLocaleString()}
          </span>
        </div>
      )}

      <div className="mt-7 pt-6 border-t border-charcoal/10">
        <p className="text-[10px] tracking-[0.28em] uppercase text-charcoal/45 font-medium">
          Inclusions
        </p>
        <ul className="mt-4 space-y-2 text-sm text-charcoal/65 font-light">
          {INCLUDED_BENEFITS.slice(0, 5).map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <span className="mt-2 w-1 h-1 bg-tan shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 text-charcoal/70">
      <Icon size={14} className="text-tan mt-1 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ children }) {
  return (
    <p className="text-[11px] tracking-[0.32em] uppercase text-tan font-medium">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* TRUST STRIP                                                         */
/* ------------------------------------------------------------------ */

function TrustStrip() {
  return (
    <div className="bg-seafoam/40 border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5">
        <ul className="flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-3">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase text-teal-dark/85 font-medium"
            >
              <Icon size={14} strokeWidth={1.6} className="text-tan" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* INCLUDED PACKAGE                                                    */
/* ------------------------------------------------------------------ */

function IncludedPackageBlock() {
  return (
    <div className="mt-10 bg-gradient-to-br from-teal-dark to-teal-deeper text-white p-8 lg:p-10">
      <p className="text-[10px] tracking-[0.32em] uppercase text-tan font-medium">
        Your All-Inclusive Stay
      </p>
      <h3 className="mt-3 font-serif text-2xl lg:text-3xl leading-tight">
        Every reservation includes the full resort experience.
      </h3>
      <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {INCLUDED_PACKAGE.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-start gap-3 text-sm text-white/85"
          >
            <span className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
              <Icon size={14} strokeWidth={1.6} className="text-tan" />
            </span>
            <span className="font-light leading-relaxed pt-1">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GUEST SELECTOR                                                      */
/* ------------------------------------------------------------------ */

function GuestSelector({ guests, setGuests, maxGuestsPerBooking = 50 }) {
  const rows = [
    {
      key: "adults",
      icon: Users,
      label: "Adults",
      hint: "Ages 13+",
      min: 1,
      max: maxGuestsPerBooking,
    },
    {
      key: "children",
      icon: Heart,
      label: "Children",
      hint: "Ages 2–12",
      min: 0,
      max: Math.max(0, maxGuestsPerBooking - 1),
    },
    {
      key: "infants",
      icon: Baby,
      label: "Infants",
      hint: "Under 2 · stay free",
      min: 0,
      max: 5,
    },
    {
      key: "pets",
      icon: PawPrint,
      label: "Pets",
      hint: "Pet-friendly resort",
      min: 0,
      max: 3,
    },
  ];
  const update = (key, delta, min, max) =>
    setGuests((g) => ({
      ...g,
      [key]: Math.min(max, Math.max(min, (g[key] || 0) + delta)),
    }));
  return (
    <div className="divide-y divide-charcoal/8 border border-charcoal/10 bg-warm-white">
      {rows.map(({ key, icon: Icon, label, hint, min, max }) => {
        const value = guests[key] || 0;
        return (
          <div
            key={key}
            className="flex items-center justify-between gap-4 px-4 py-3.5"
          >
            <div className="flex items-start gap-3 min-w-0">
              <Icon
                size={16}
                strokeWidth={1.6}
                className="text-tan mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-teal-dark">{label}</p>
                <p className="text-[11px] text-charcoal/45 mt-0.5">{hint}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => update(key, -1, min, max)}
                disabled={value <= min}
                aria-label={`Decrease ${label}`}
                className="w-8 h-8 border border-charcoal/20 text-charcoal/70 flex items-center justify-center hover:border-teal hover:text-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="w-6 text-center font-serif text-lg text-teal-dark tabular-nums">
                {value}
              </span>
              <button
                type="button"
                onClick={() => update(key, +1, min, max)}
                disabled={value >= max}
                aria-label={`Increase ${label}`}
                className="w-8 h-8 border border-charcoal/20 text-charcoal/70 flex items-center justify-center hover:border-teal hover:text-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
