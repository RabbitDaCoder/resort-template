import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "./homeContent";
import { brand } from "../../lib/brand";

const CDN = brand.cdnBase;

export default function ReviewsSection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-32">
      {/* Background */}
      <img
        src={`${CDN}/sundownersvillas01_qX9pJvj.jpg`}
        alt="Guest reviews background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-teal-dark/88" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Guest Stories
          </p>
          <h2 className="font-serif text-4xl text-white sm:text-5xl">
            What Our Guests Say
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-white/25" />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: i * 0.14,
                duration: 0.8,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative border border-white/15 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-white/80 text-white/80"
                  />
                ))}
              </div>
              <span className="absolute -top-3 left-6 select-none font-serif text-7xl leading-none text-white/10">
                &ldquo;
              </span>
              <p className="text-base italic leading-8 text-white/75">
                {t.quote}
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white/90">{t.name}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
