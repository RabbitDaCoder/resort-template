import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ctaBg from "../../assets/discoverysamal/hero-3.jpg";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <img
        src={ctaBg}
        alt="Discovery Samal Resort coastline"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-teal-dark/75" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55"
        >
          Ready to Escape?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-serif text-4xl text-white sm:text-5xl lg:text-6xl"
        >
          Your Dream Beach Getaway Awaits
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-base text-white/70 leading-relaxed"
        >
          Whether you&rsquo;re planning a romantic escape, a family holiday, or
          a destination event — Discovery Samal Resort on Samal Island, Davao del Norteis
          ready to welcome you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            to="/booking"
            className="inline-flex items-center justify-center bg-white px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-dark transition-all hover:bg-seafoam"
          >
            Book Now
          </Link>
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center border border-white/50 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            View Rooms
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
