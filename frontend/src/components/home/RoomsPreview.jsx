import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Bed, BedDouble, ArrowRight } from "lucide-react";
import { brand } from "../../lib/brand";
import { useRooms } from "../../hooks/useRooms";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="bg-white animate-pulse overflow-hidden">
      <div className="h-64 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-2.5 bg-gray-200 w-16 rounded" />
        <div className="h-5 bg-gray-200 w-36 rounded" />
        <div className="h-3 bg-gray-200 w-full rounded" />
        <div className="h-3 bg-gray-200 w-3/4 rounded" />
        <div className="h-10 bg-gray-200 w-full mt-4 rounded" />
      </div>
    </div>
  );
});

// ── Single room card (memoised so it won't re-render unless the room changes) ─
const RoomCard = memo(function RoomCard({ room, index }) {
  const slug = room.slug || room.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const maxCapacity = room.maxGuests || room.capacity || room.occupancy || 2;
  const minCapacity =
    room.minGuests || Math.max(1, maxCapacity - Math.floor(maxCapacity * 0.4));

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="bg-white overflow-hidden group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-64">
        {room.images?.[0] ? (
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-cream-dark flex items-center justify-center text-charcoal/25 text-xs uppercase tracking-widest">
            No image
          </div>
        )}

        {/* Price badge */}
        {room.discountPrice && room.discountPrice < room.pricePerNight ? (
          <>
            <div className="absolute top-4 left-4 bg-gold text-charcoal px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              {room.discountLabel || "Sale"}
            </div>
            <div className="absolute top-4 right-4 bg-forest text-white px-3 py-1 text-sm font-medium">
              ₱{room.discountPrice.toLocaleString()}/night
            </div>
          </>
        ) : (
          <div className="absolute top-4 right-4 bg-charcoal/80 text-white px-3 py-1 text-sm font-medium">
            ₱{room.pricePerNight?.toLocaleString()}/night
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-2 block">
          {room.category}
        </span>
        <h3 className="font-serif text-xl text-forest-dark mb-2 group-hover:text-forest transition-colors">
          {room.name}
        </h3>
        <p className="text-sm text-charcoal/50 leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        {room.note && (
          <p className="text-[11px] text-forest font-semibold bg-forest/8 px-3 py-1.5 mb-4">
            ✓ {room.note}
          </p>
        )}

        <div className="flex flex-col gap-1 text-xs text-charcoal/40 mb-5">
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            Good for {minCapacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={12} />
            Max {maxCapacity} guests
          </span>
          {room.bedType && (
            <span className="flex items-center gap-1.5">
              <Bed size={12} />
              {room.bedType}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Link
            to={`/rooms/${slug}`}
            className="block w-full text-center border border-forest text-forest py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-forest hover:text-white transition-colors duration-200"
          >
            View Details
          </Link>
          <Link
            to={`/booking?room=${room._id}`}
            className="block w-full text-center bg-forest text-white py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-forest-dark transition-colors duration-200"
          >
            Book This Room
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

// ── Main component ────────────────────────────────────────────────────────────
export default function RoomsPreview() {
  // React Query — 10 min staleTime set in the hook; served instantly from cache on revisit
  const { data: allRooms = [], isLoading, isError } = useRooms({ available: true });

  // Show first 3 rooms; memoised so it only recalculates when allRooms changes
  const rooms = useMemo(() => allRooms.slice(0, 3), [allRooms]);

  return (
    <section className="bg-offwhite py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            Time to Reconnect
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
            Our Accommodations
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
            {brand.displayName} focuses on bright, comfortable rooms with a
            cleaner booking experience and the flexibility guests expect from a
            relaxed beachfront stay.
          </p>
        </motion.div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : isError || rooms.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-10">
            Rooms coming soon. Check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <RoomCard key={room._id} room={room} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 bg-olive text-white px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium hover:bg-forest transition-colors duration-300"
          >
            See All Rooms <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


  return (
    <section className="bg-offwhite py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            Time to Reconnect
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
            Our Accommodations
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
            {brand.displayName} focuses on bright, comfortable rooms with a
            cleaner booking experience and the flexibility guests expect from a
            relaxed beachfront stay.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 w-20" />
                  <div className="h-5 bg-gray-200 w-40" />
                  <div className="h-3 bg-gray-200 w-full" />
                  <div className="h-10 bg-gray-200 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error || rooms.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            Rooms coming soon. Check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden h-64">
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute top-4 right-4 bg-forest text-white px-3 py-1 text-sm font-medium">
                    PHP {room.pricePerNight?.toLocaleString()}/night
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs uppercase tracking-[0.15em] text-olive font-semibold mb-2 block">
                    {room.category}
                  </span>
                  <h3 className="font-serif text-xl text-charcoal mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {room.maxGuests} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed size={12} />
                      {room.category}
                    </span>
                  </div>
                  <Link
                    to={`/rooms/${room.slug || ""}`}
                    className="block w-full text-center border border-forest text-forest py-3 text-sm font-medium uppercase tracking-wider hover:bg-forest hover:text-white transition-colors duration-300"
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/rooms"
            className="inline-block bg-olive text-white px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium hover:bg-forest transition-colors duration-300"
          >
            See All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
