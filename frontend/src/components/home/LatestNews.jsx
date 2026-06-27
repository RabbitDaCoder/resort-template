import { Link } from "react-router-dom";
import { brand } from "../../lib/brand";

export default function LatestNews() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mb-3">
            Latest News
          </h2>
          <div className="w-16 h-0.5 bg-olive mx-auto" />
        </div>

        {/* Promo card */}
        <div className="max-w-sm mx-auto shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
            alt="Summer Sale"
            className="w-full h-52 object-cover"
          />
          <div className="p-6 text-center">
            <h3 className="font-serif text-2xl text-charcoal mb-3">
              Summer Sale
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Up to <span className="font-bold text-olive">40% OFF</span> on
              weekday stays
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Up to <span className="font-bold text-olive">30% OFF</span> on
              weekend stays
            </p>

            <div className="bg-olive text-white py-4 px-6 mb-6">
              <p className="font-serif text-lg tracking-wide">
                {brand.shortName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                Resort
              </p>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Valid for bookings from June 1 &ndash; August 31, 2025
            </p>

            <Link
              to="/booking"
              className="block bg-olive text-white py-3 text-sm font-medium uppercase tracking-[0.15em] hover:bg-forest transition-colors duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
