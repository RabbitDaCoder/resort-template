import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { brand } from "../../lib/brand";
import { footerLogos } from "./homeContent";

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.7-1.6H16V4.8c-.2 0-.9-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.4V11H8.7v3h2.2v7h2.6Z" />
    </svg>
  );
}

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.75, ease: [0.22, 0.61, 0.36, 1] },
});

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-cream-dark py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Partner logos */}
        {footerLogos.length > 0 && (
          <motion.div
            {...inView(0)}
            className="mb-16 grid gap-3 border-y border-charcoal/10 py-6 sm:grid-cols-3"
          >
            {footerLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex min-h-20 items-center justify-center bg-white/60 px-6 py-4"
              >
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Section header */}
        <motion.div {...inView(0.05)} className="mb-14">
          <p className="label-tag mb-4">Get In Touch</p>
          <h2 className="font-serif text-5xl text-forest-dark sm:text-6xl">
            Contact Us
          </h2>
          <div className="mt-5 h-px w-20 bg-gold/50" />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          {/* Contact info */}
          <motion.div {...inView(0.1)}>
            <h3 className="mb-7 font-serif text-2xl italic text-forest-dark">
              Resort Information
            </h3>
            <ul className="space-y-5 text-sm leading-7 text-charcoal/65">
              <li className="flex gap-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{brand.address}</span>
              </li>
              {brand.phone && (
                <li className="flex gap-3.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{brand.phone}</span>
                </li>
              )}
              <li className="flex gap-3.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{brand.email}</span>
              </li>
            </ul>
          </motion.div>

          {/* Office hours */}
          <motion.div
            {...inView(0.2)}
            className="relative overflow-hidden border border-cream-dark/50 bg-white/70 p-8"
          >
            <h3 className="mb-6 font-serif text-2xl italic text-forest-dark">
              Resort Office Hours
            </h3>
            <div className="flex gap-3.5 text-sm leading-7 text-charcoal/65">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <p className="font-medium text-charcoal/80">Monday to Sunday</p>
                <p>24 hours open</p>
              </div>
            </div>
            <Link
              to="/booking"
              className="mt-8 inline-flex min-h-11 items-center justify-center bg-forest text-white px-7 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 hover:bg-forest-dark"
            >
              Reserve Now
            </Link>
          </motion.div>

          {/* Social */}
          <motion.div {...inView(0.3)}>
            <h3 className="mb-7 font-serif text-2xl italic text-forest-dark">
              Stay Connected
            </h3>
            {brand.facebookPageUrl && (
              <a
                href={brand.facebookPageUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-forest/30 text-forest transition-colors duration-200 hover:bg-forest hover:text-white"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
            <p className="mt-7 text-sm text-charcoal/45 italic">
              Tag us in your photos and share your experience.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
