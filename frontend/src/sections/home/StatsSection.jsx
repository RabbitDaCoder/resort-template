import { motion } from "framer-motion";

const STATS = [
  { value: "15+", label: "Hectares of coastline" },
  { value: "30+", label: "Curated accommodations" },
  { value: "5", label: "Signature experiences" },
  { value: "24/7", label: "Guest services" },
];

export default function StatsSection() {
  return (
    <section className="bg-charcoal py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="border border-white/10 py-6">
              <p className="font-serif text-4xl text-gold mb-2">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
