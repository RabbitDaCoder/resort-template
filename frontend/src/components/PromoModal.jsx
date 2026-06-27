import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPromos } from "../services/api";
import { Tag, X, ChevronRight } from "lucide-react";
import { brand } from "../lib/brand";

const STORAGE_KEY = "discoverysamal-resort_promo_dismissed";

export default function PromoModal() {
  const [visible, setVisible] = useState(false);
  const [promos, setPromos] = useState([]); // grouped promo events

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    getPromos()
      .then((res) => {
        const rooms = res.data.data || res.data;
        if (!Array.isArray(rooms) || rooms.length === 0) return;

        // Group rooms by discountLabel
        const grouped = {};
        rooms.forEach((room) => {
          const label = room.discountLabel || "Special Offer";
          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(room);
        });

        const events = Object.entries(grouped).map(([label, items]) => ({
          label,
          rooms: items,
        }));

        setPromos(events);
        setTimeout(() => setVisible(true), 600);
      })
      .catch(() => {});
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible || promos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label="Current promotions"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-bs-cream w-full max-w-110 shadow-[0_28px_80px_rgba(16,42,67,0.25)] overflow-hidden max-h-[85vh] flex flex-col rounded-[28px]">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal bg-warm-white/80 rounded-full"
          aria-label="Close promotions"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-teal-dark to-teal text-white px-6 py-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/60 mb-1">
            {brand.displayName}
          </p>
          <h2 className="font-serif text-2xl tracking-wide">
            Current Promotions
          </h2>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {promos.map((event) => (
            <div key={event.label}>
              {/* Event label */}
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-olive" />
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">
                  {event.label}
                </h3>
              </div>

              {/* Room cards */}
              <div className="space-y-2.5">
                {event.rooms.map((room) => {
                  const pct = Math.round(
                    ((room.pricePerNight - room.discountPrice) /
                      room.pricePerNight) *
                      100,
                  );
                  return (
                    <div
                      key={room._id}
                      className="bg-white flex items-center gap-3 p-3"
                    >
                      {/* Thumbnail */}
                      {room.images?.[0] && (
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-16 h-16 object-cover shrink-0"
                        />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-olive font-medium mb-0.5">
                          {room.category}
                        </p>
                        <p className="text-sm font-semibold text-charcoal truncate">
                          {room.name}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-[11px] text-gray-400 line-through">
                            ₱{room.pricePerNight.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-forest">
                            ₱{room.discountPrice.toLocaleString()}
                          </span>
                          {pct > 0 && (
                            <span className="text-[10px] text-bs-gold font-bold">
                              -{pct}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Book arrow */}
                      <Link
                        to={`/booking?room=${room._id}`}
                        onClick={close}
                        className="shrink-0 w-8 h-8 flex items-center justify-center bg-forest/10 text-forest hover:bg-forest hover:text-white transition-colors"
                        title="Book now"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-seafoam px-5 py-4 text-center">
          <Link
            to="/rooms"
            onClick={close}
            className="text-xs uppercase tracking-widest text-forest font-semibold hover:underline"
          >
            View All Rooms &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
