import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { experienceSlides } from "./homeContent";

const SECTION_ACTIONS = [
  { label: "Accommodation", to: "/rooms" },
  { label: "Dining", sectionId: "dining" },
  { label: "Facilities", sectionId: "facilities" },
  { label: "Offers", sectionId: "offers" },
  { label: "Gallery", sectionId: "gallery" },
];

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
}

const inView = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = experienceSlides;

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section id="experiences" className="bg-cream py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p variants={inView} custom={0} className="label-tag mb-5">
            Experiences
          </motion.p>
          <motion.h2
            variants={inView}
            custom={1}
            className="max-w-xl font-serif text-5xl leading-[1.08] text-forest-dark sm:text-6xl lg:text-[5rem]"
          >
            Dare to Discover
          </motion.h2>
          <motion.p
            variants={inView}
            custom={2}
            className="mt-6 max-w-xl text-base leading-8 text-charcoal/70"
          >
            Curated moments across water, dining, stays, and celebrations.
            Designed to let every hour unfold with effortless ease.
          </motion.p>
          <motion.div
            variants={inView}
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {SECTION_ACTIONS.map((action) =>
              action.to ? (
                <Link
                  key={action.label}
                  to={action.to}
                  className="inline-flex min-h-10 items-center justify-center border border-forest/40 px-5 text-[11px] uppercase tracking-[0.2em] text-forest font-semibold transition-colors duration-200 hover:bg-forest hover:text-white hover:border-forest"
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => scrollToSection(action.sectionId)}
                  className="inline-flex min-h-10 items-center justify-center border border-forest/40 px-5 text-[11px] uppercase tracking-[0.2em] text-forest font-semibold transition-colors duration-200 hover:bg-forest hover:text-white hover:border-forest"
                >
                  {action.label}
                </button>
              ),
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative overflow-hidden"
        >
          <div className="relative min-h-[520px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide.image}
                src={activeSlide.image}
                alt={activeSlide.title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                    {activeSlide.title}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl text-white">
                    {activeSlide.subtitle}
                  </h3>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 w-10 transition-colors ${
                      index === activeIndex ? "bg-gold" : "bg-white/30"
                    }`}
                    aria-label={`Show ${slide.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
