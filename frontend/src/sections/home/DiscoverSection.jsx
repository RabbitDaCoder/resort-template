import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand";
import discoverBg from "../../assets/discoverysamal/discover-bg.jpg";
import aboutBg from "../../assets/discoverysamal/about-bg.jpg";

export default function DiscoverSection() {
  return (
    <section
      id="discover"
      className="relative scroll-mt-20 overflow-hidden bg-warm-white py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Image stack */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative h-[480px] sm:h-[560px] lg:h-[640px]"
        >
          <div className="absolute left-0 top-0 h-[78%] w-[72%] overflow-hidden">
            <img
              src={discoverBg}
              alt={`${brand.displayName} coastline`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[58%] w-[58%] overflow-hidden border-8 border-warm-white">
            <img
              src={aboutBg}
              alt="Pool villa interior"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -left-6 -top-6 hidden h-24 w-24 border border-teal/30 lg:block" />
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal">
            Discover {brand.shortName}
          </p>
          <h2 className="mb-7 font-serif text-4xl font-light leading-[1.1] text-charcoal sm:text-5xl lg:text-[56px]">
            A Seaside Sanctuary <br />
            On Samal Island, Davao del Norte
          </h2>
          <p className="mb-5 text-[15px] leading-[1.85] text-charcoal/70">
            Nestled on the shores of Samal Island in the Island Garden City of
            Samal, Davao del Norte, {brand.displayName} is an intimate
            collection of 153 pool villas and seaview suites designed for slow
            mornings, long sunsets, and the kind of stillness only the sea can
            offer.
          </p>
          <p className="mb-10 text-[15px] leading-[1.85] text-charcoal/70">
            Every villa opens to the breeze, with private pools, soft natural
            light, and warm Filipino hospitality at every turn. Whether you are
            travelling as a couple, with family, or with friends, our villas
            invite you to unwind on island time.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-teal px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-teal-dark"
            >
              Our Story
            </Link>
            <Link
              to="/gallery"
              className="text-[12px] font-semibold uppercase tracking-[0.25em] text-charcoal/70 underline-offset-8 transition-colors hover:text-teal hover:underline"
            >
              View Gallery →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
