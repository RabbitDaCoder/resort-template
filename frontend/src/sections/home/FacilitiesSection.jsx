import { motion } from "framer-motion";
import { facilityCards } from "./homeContent";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function FacilitiesSection() {
  const featured = facilityCards.filter((f) => f.featured);
  const supporting = facilityCards.filter((f) => !f.featured);

  return (
    <section
      id="facilities"
      className="scroll-mt-20 bg-charcoal py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="label-tag mb-4 text-gold">Amenities &amp; Facilities</p>
          <h2 className="font-serif text-5xl text-white sm:text-6xl">
            World-Class Facilities
          </h2>
          <div className="mt-5 h-px w-20 bg-gold/40" />
        </motion.div>

        {/* Featured 2-col */}
        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((facility, i) => (
            <motion.article
              key={facility.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative overflow-hidden"
            >
              <img
                src={facility.image}
                alt={facility.label}
                className="aspect-[1.5] w-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2 text-sm italic">
                  {facility.label}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Supporting 4-col */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {supporting.map((facility, i) => (
            <motion.article
              key={facility.label}
              custom={i + 2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group relative overflow-hidden"
            >
              <img
                src={facility.image}
                alt={facility.label}
                className="aspect-[1.25] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white text-sm italic drop-shadow-sm">
                  {facility.label}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
