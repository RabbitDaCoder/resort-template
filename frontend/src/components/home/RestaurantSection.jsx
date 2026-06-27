import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brand } from "../../lib/brand";
import "swiper/css";
import "swiper/css/navigation";

const foodImages = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
];

export default function RestaurantSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — text */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            Fresh &amp; Tasty
          </p>
          <h2 className="font-serif text-3xl lg:text-[38px] text-charcoal leading-tight mb-6">
            Restaurant and Bar
          </h2>
          <p className="text-gray-600 leading-[1.8] mb-6">
            {brand.displayName} keeps dining easy with fresh seafood, Filipino
            staples, and laid-back drinks that fit beach mornings and sunset
            wind-downs.
          </p>
          <Link
            to="/activities"
            className="text-sm font-medium text-olive hover:underline"
          >
            See Menu &rarr;
          </Link>
        </div>

        {/* Right — carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".food-prev",
              nextEl: ".food-next",
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            className="h-90 lg:h-105"
          >
            {foodImages.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`Food ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="food-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 hover:bg-white transition-colors">
            <ChevronLeft size={20} className="text-charcoal" />
          </button>
          <button className="food-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 hover:bg-white transition-colors">
            <ChevronRight size={20} className="text-charcoal" />
          </button>
        </div>
      </div>
    </section>
  );
}
