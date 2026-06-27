import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import hom1 from "../../assets/slides/hom1.jpg";
import hom2 from "../../assets/slides/hom2.jpg";
import hom3 from "../../assets/slides/hom3.jpg";
import hom4 from "../../assets/slides/hom4.jpg";
import hom5 from "../../assets/slides/hom5.jpg";
import hom6 from "../../assets/slides/hom6.jpg";
import hom7 from "../../assets/slides/hom7.jpg";
import hom8 from "../../assets/slides/hom8.jpg";
import { brand } from "../../lib/brand";

const slides = [hom1, hom2, hom3, hom4, hom5, hom6, hom7, hom8];

export default function HeroSlider() {
  return (
    <section className="hero-slider relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06141d] to-transparent z-10 pointer-events-none" />
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-screen w-full"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-screen w-full">
              <img
                src={src}
                alt={`${brand.displayName} slide ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,29,0.18),rgba(6,20,29,0.58))]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="max-w-4xl">
                  <p className="text-white/75 text-xs md:text-sm tracking-[0.32em] uppercase mb-5 font-semibold">
                    Beachfront stays in Laiya, Batangas
                  </p>
                  <h1 className="font-serif text-white text-4xl md:text-[68px] font-semibold leading-[0.95] mb-5">
                    {brand.displayName}
                  </h1>
                  <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-lg leading-relaxed">
                    Sunlit rooms, direct shore access, and a quieter resort pace
                    for families, reunions, and weekend escapes.
                  </p>
                </div>
                <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm text-white/85 text-[11px] uppercase tracking-[0.24em]">
                  <span className="block w-2 h-2 rounded-full bg-sand" />
                  {brand.tagline}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
