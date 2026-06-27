import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { offers } from "./homeContent";

const ICONS = ["🌊", "👨‍👩‍👧‍👦", "🍽️"];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function OffersSection() {
  return (
    <section id="offers" className="scroll-mt-20 bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-3xl"
        >
          <p className="label-tag mb-5">Packages &amp; Offers</p>
          <h2 className="font-serif text-5xl leading-[1.08] text-forest-dark sm:text-6xl">
            Boutique stays tailored
            <br />
            <span className="italic text-forest">for your next escape.</span>
          </h2>
          <div className="mt-6 h-px w-20 bg-gold/50" />
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <motion.article
              key={offer.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group relative flex flex-col bg-white border border-cream-dark p-8 hover:border-gold/40 transition-colors duration-300"
            >
              {/* Icon */}
              <span className="mb-5 text-3xl">{ICONS[i]}</span>

              {/* Gold top line reveal */}
              <div className="absolute top-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full" />

              <h3 className="font-serif text-3xl italic text-forest-dark mb-4">
                {offer.title}
              </h3>
              <p className="flex-1 text-base leading-8 text-charcoal/60 mb-8">
                {offer.text}
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-forest border-b border-forest/30 pb-0.5 hover:border-forest transition-colors duration-200 w-fit"
              >
                Book Now
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
