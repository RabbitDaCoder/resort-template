import { motion } from "framer-motion";
import { Wind, Tv, Wifi, Waves, Bath, Bed, PawPrint, Sun } from "lucide-react";

const AMENITIES = [
  { icon: Wind, label: "Air Conditioning" },
  { icon: Sun, label: "Private Balcony" },
  { icon: Tv, label: "Smart LED TV" },
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: Bath, label: "Hot & Cold Shower" },
  { icon: Waves, label: "Infinity Pool" },
  { icon: PawPrint, label: "Pet Friendly" },
  { icon: Bed, label: "Premium Bedding" },
];

export default function AmenitiesSection() {
  return (
    <section className="bg-seafoam py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal">
            Villa Amenities
          </p>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-normal leading-tight text-charcoal sm:text-5xl">
            Thoughtful Comforts In Every Villa
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:gap-x-10">
          {AMENITIES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-teal/20 bg-warm-white text-teal transition-all duration-500 group-hover:border-teal group-hover:bg-teal group-hover:text-white">
                <Icon size={26} strokeWidth={1.4} />
              </div>
              <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-charcoal/80">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
