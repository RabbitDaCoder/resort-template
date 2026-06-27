import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const TOUR_VIDEO =
  "https://vid.cdn-website.com/b434b26a/videos/4cISjVfxRri0xwsDaaLW_Sundowners+Mansion+Tour-v.mp4";
const TOUR_POSTER =
  "https://lirp.cdn-website.com/b434b26a/dms3rep/multi/opt/4cISjVfxRri0xwsDaaLW_Sundowners+Mansion+Tour.v2.0000000-1920w.jpg";

export default function VirtualTourSection() {
  return (
    <section
      id="virtual-tour"
      className="relative overflow-hidden bg-teal-dark text-white py-24 lg:py-32"
    >
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-sage/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-tan/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-14">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-3 text-center md:text-left"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sage">
              Step Inside
            </p>
            <h2 className="mt-5 font-serif text-4xl uppercase leading-[1.05] lg:text-5xl">
              Video
              <br />
              Tour
            </h2>
            <div className="mx-auto mt-6 h-px w-12 bg-tan md:mx-0" />
          </motion.div>

          {/* Center — video */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="md:col-span-6"
          >
            <div className="group relative w-full overflow-hidden bg-charcoal shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={TOUR_POSTER}
                className="aspect-video w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.02]"
                style={{ objectPosition: "50% 77%" }}
              >
                <source src={TOUR_VIDEO} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>

          {/* Right — tagline + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-3 text-center md:text-left"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sage">
              Now Available
            </p>
            <p className="mt-4 font-serif text-2xl leading-tight text-white lg:text-3xl">
              For Booking
            </p>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-white/70">
              Wander the Beach Mansion before you arrive — every corner of our
              8-bedroom retreat, framed by the sea.
            </p>
            <Link
              to="/booking"
              className="mt-7 inline-flex items-center gap-2 border border-white/40 px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-white transition-colors hover:bg-white hover:text-teal-dark"
            >
              Check Availability
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
