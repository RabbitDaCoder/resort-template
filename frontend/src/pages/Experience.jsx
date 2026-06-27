import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { brand } from "../lib/brand";

const CDN = brand.cdnBase;

const services = [
  {
    icon: `${CDN}/bus.svg`,
    title: "Airport Shuttle",
    desc: "Seamless transfers from Clark International Airport to Discovery Samal Resort, arranged at your convenience.",
    bg: `${CDN}/DJI_0239_1.jpg`,
  },
  {
    icon: `${CDN}/dish.svg`,
    title: "In-Room Dining",
    desc: "Curated meals delivered to your suite until 9:00 PM. Wake up to our signature breakfast or indulge in evening room service.",
    bg: `${CDN}/Breakfast_Set_up.jpg`,
  },
  {
    icon: `${CDN}/wifi.svg`,
    title: "Complimentary Wi-Fi",
    desc: "Stay connected throughout your stay with high-speed Wi-Fi available in all rooms and resort common areas.",
    bg: `${CDN}/sundownersvillas01_qX9pJvj.jpg`,
  },
  {
    icon: `${CDN}/sauna.svg`,
    title: "Spa & Massage",
    desc: "Surrender to bliss with our in-house massage therapists. Choose from a range of signature treatments and wellness rituals.",
    bg: `${CDN}/img_51.jpg`,
  },
  {
    icon: `${CDN}/housekeeping.svg`,
    title: "Daily Housekeeping",
    desc: "Your suite is refreshed daily by our attentive housekeeping team â€” crisp linens, pristine bathrooms, and turndown service.",
    bg: `${CDN}/suites.jpg`,
  },
  {
    icon: `${CDN}/parking.svg`,
    title: "Complimentary Parking",
    desc: "Ample and secure on-site parking for all registered guests at no additional charge.",
    bg: `${CDN}/DJI_0414-scaled.jpg`,
  },
];

const banners = [
  {
    title: "Rooms & Suites",
    subtitle: "Explore our accommodations",
    image: `${CDN}/suites.jpg`,
    to: "/rooms",
  },
  {
    title: "Experiences",
    subtitle: "Discover what awaits",
    image: `${CDN}/DJI_0239_1.jpg`,
    to: "/activities",
  },
  {
    title: "Offers & Packages",
    subtitle: "Find exclusive deals",
    image: `${CDN}/176403407_266533145169046_6427536515171493951_n.jpg`,
    to: "/offers",
  },
];

const stats = [
  { num: "24/7", label: "Front Desk" },
  { num: "6+", label: "Resort Services" },
  { num: "100%", label: "Beach Access" },
  { num: "Ã¢Ëœâ€¦4.8", label: "Guest Rating" },
];

export default function Experience() {
  return (
    <div className="bg-warm-white">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={`${CDN}/dining.jpg`}
          alt="Discovery Samal Services"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/75" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-6 w-full pb-20">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="section-pre-title text-white/70 mb-4"
            >
              At Your Service
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-4 text-white/70 text-lg max-w-xl"
            >
              Every detail thoughtfully curated so you can simply be present.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-pre-title mb-4">Thoughtful Hospitality</p>
            <h2 className="font-serif text-4xl text-teal-dark mb-6">
              Designed Around You
            </h2>
            <p className="text-charcoal/60 leading-relaxed text-lg">
              At Discovery Samal Resort, every service is an extension of our
              commitment to you. From the moment you arrive until your last
              goodbye, we ensure comfort, convenience, and care at every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <img
                  src={s.bg}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <div className="mb-3">
                    <img
                      src={s.icon}
                      alt={s.title}
                      className="w-8 h-8 brightness-0 invert opacity-80"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-dark py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-serif text-4xl text-white mb-2">{s.num}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banners */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-pre-title mb-4">Explore More</p>
            <h2 className="font-serif text-4xl text-teal-dark">
              Discover Discovery Samal
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {banners.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={b.to}
                  className="group block relative overflow-hidden rounded-2xl aspect-[3/2]"
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-7">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
                      {b.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl text-white group-hover:translate-x-1 transition-transform duration-300">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-seafoam py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-pre-title mb-4">Ready to Experience It?</p>
            <h2 className="font-serif text-4xl text-teal-dark mb-5">
              Begin Your Journey
            </h2>
            <p className="text-charcoal/60 mb-8 leading-relaxed">
              Every service awaits your arrival. Book your stay and let us take
              care of the rest.
            </p>
            <Link to="/booking" className="sv-btn">
              Reserve Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

