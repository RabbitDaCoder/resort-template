import { motion } from "framer-motion";
import hom2 from "../../assets/slides/hom2.jpg";

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-28">
      <div className="absolute inset-0">
        <img
          src={hom2}
          alt="Newsletter"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-cream/85" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="label-tag mb-4"
        >
          Newsletter
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.7 }}
          className="font-serif text-4xl text-forest-dark sm:text-5xl"
        >
          Stay Inspired. Live Effortlessly.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-5 text-sm text-charcoal/55"
        >
          Sign up for curated escapes, exclusive offers, and coastal stories.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-8 mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full flex-1 border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
          <button
            type="submit"
            className="bg-forest text-white px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-forest-dark transition-colors"
          >
            Subscribe
          </button>
        </motion.form>
      </div>
    </section>
  );
}
