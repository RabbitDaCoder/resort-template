import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { useRooms } from "../../hooks/useRooms";

/**
 * Sticky bottom booking bar for mobile.
 * Shows on /rooms, /rooms/:slug and / (home). Hides on /booking* and admin.
 * Pure UI — wires into the existing booking flow via /booking?room=:id.
 */
export default function MobileBookingBar() {
  const { pathname } = useLocation();
  const params = useParams();
  const [visible, setVisible] = useState(false);

  // Show only on guest-facing pages, not within booking funnel
  const onBookingFlow = pathname.startsWith("/booking");
  const onAdmin = pathname.startsWith("/owner");
  const isRoomDetail = /^\/rooms\/[^/]+/.test(pathname);
  const isRoomList = pathname === "/rooms";
  const isHome = pathname === "/";
  const allowed =
    !onBookingFlow && !onAdmin && (isRoomDetail || isRoomList || isHome);

  useEffect(() => {
    if (!allowed) {
      setVisible(false);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [allowed, pathname]);

  // Pull rooms only to surface the cheapest "from" price + targeted CTA
  const { data: rooms = [] } = useRooms({ available: true });

  const detailSlug = isRoomDetail ? pathname.split("/").pop() : null;
  const detailRoom = detailSlug
    ? rooms.find((r) => r.slug === detailSlug)
    : null;

  const cheapest = (() => {
    if (detailRoom) return detailRoom;
    if (!rooms.length) return null;
    return [...rooms].sort(
      (a, b) =>
        Number(
          a.effectivePricePerNight ?? a.discountPrice ?? a.pricePerNight ?? 0,
        ) -
        Number(
          b.effectivePricePerNight ?? b.discountPrice ?? b.pricePerNight ?? 0,
        ),
    )[0];
  })();

  const price = cheapest
    ? Number(
        cheapest.effectivePricePerNight ??
          cheapest.discountPrice ??
          cheapest.pricePerNight ??
          0,
      )
    : 0;
  const original = cheapest ? Number(cheapest.pricePerNight ?? 0) : 0;
  const hasDiscount = price && original && price < original;

  const bookingHref = detailRoom
    ? `/booking?room=${detailRoom._id}`
    : "/booking";

  const ctaLabel = detailRoom ? "Reserve this villa" : "Reserve your escape";

  return (
    <AnimatePresence>
      {allowed && visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40"
        >
          <div className="mx-3 mb-3 rounded-2xl bg-[#0d3b42]/95 backdrop-blur-xl text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                {cheapest ? (
                  <>
                    <p className="text-[9px] tracking-[0.28em] uppercase text-white/55 font-medium">
                      {detailRoom ? "From" : "Rates from"}
                    </p>
                    <p className="font-serif text-xl leading-tight tracking-tight mt-0.5 flex items-baseline gap-2">
                      ₱{price.toLocaleString()}
                      {hasDiscount && (
                        <span className="text-[10px] line-through text-white/40 font-sans">
                          ₱{original.toLocaleString()}
                        </span>
                      )}
                      <span className="text-[10px] text-white/55 font-sans">
                        /night
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[9px] tracking-[0.28em] uppercase text-white/55 font-medium">
                      Plan your stay
                    </p>
                    <p className="font-serif text-lg leading-tight mt-0.5 flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-tan" />
                      Choose your dates
                    </p>
                  </>
                )}
              </div>
              <Link
                to={bookingHref}
                className="shrink-0 inline-flex items-center gap-2 bg-tan text-[#0d3b42] px-4 py-3 text-[10px] tracking-[0.22em] uppercase font-bold rounded-md hover:bg-white transition-colors"
              >
                <Sparkles size={12} />
                {ctaLabel}
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
