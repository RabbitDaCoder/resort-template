import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Clock, MapPin } from "lucide-react";
import { brand } from "../lib/brand";

const CDN = brand.cdnBase;
const MENU_PDF =
  "https://d1lmdmhhbtmxsa.cloudfront.net/documents/SUNRISE_PAVILION_MENU_EL_MAR_2026.pdf";

const banners = [
  {
    title: "Rooms & Suites",
    subtitle: "Explore accommodations",
    image: `${CDN}/suites.jpg`,
    to: "/rooms",
  },
  {
    title: "Experiences",
    subtitle: "Discover what awaits",
    image: `${CDN}/DJI_0239_1.jpg`,
    to: "/activities",
  },
];

export default function FoodMenu() {
  return (
    <div className="bg-warm-white">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={`${CDN}/dining.jpg`}
          alt="Dining at Discovery Samal"
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
              Culinary Experiences
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            >
              Dining &amp; Bar
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="mt-4 text-white/70 text-lg max-w-xl"
            >
              A seaside dining experience where every meal is a moment to
              savour.
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
            <p className="section-pre-title mb-4">Seaside Dining</p>
            <h2 className="font-serif text-4xl text-teal-dark mb-6">
              Flavours Kissed by the Ocean
            </h2>
            <p className="text-charcoal/60 leading-relaxed text-lg">
              From morning light to evening breeze, Discovery Samal offers
              intimate dining venues set against the stunning backdrop of
              Samal Island's coastline. Fresh ingredients, artful presentation, and
              warm Filipino hospitality at every table.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sunrise Pavilion — image left */}
      <section className="pb-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] group"
            >
              <img
                src={`${CDN}/Breakfast_Set_up.jpg`}
                alt="Sunrise Pavilion"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs uppercase tracking-[0.18em] text-teal font-semibold">
                  Restaurant
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="section-pre-title mb-4">Sunrise Pavilion</p>
              <h2 className="font-serif text-4xl md:text-5xl text-teal-dark mb-5">
                Where Every Morning
                <br />
                Begins Beautifully
              </h2>
              <p className="text-charcoal/60 leading-relaxed mb-5">
                Start your day with panoramic ocean views and a carefully
                curated menu of Filipino classics, fresh tropical fruits, and
                artisan pastries. Our Sunrise Pavilion is open for breakfast and
                lunch, offering a relaxed dining experience steps from the
                shore.
              </p>
              <p className="text-charcoal/60 leading-relaxed mb-8">
                Whether you prefer a hearty spread or a light à la carte
                breakfast, every dish is prepared with fresh, locally sourced
                ingredients and served with heartfelt hospitality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-charcoal/60">
                  <Clock size={16} className="text-teal shrink-0" />
                  <span>Open daily 8:00 AM — 5:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal/60">
                  <MapPin size={16} className="text-teal shrink-0" />
                  <span>Beachfront Pavilion</span>
                </div>
              </div>
              <a
                href={MENU_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-btn inline-flex items-center gap-2"
              >
                View The Menu
                <ExternalLink size={15} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-seafoam" />
      </div>

      {/* La Playa Bar — image right */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <p className="section-pre-title mb-4">La Playa Bar &amp; Café</p>
              <h2 className="font-serif text-4xl md:text-5xl text-teal-dark mb-5">
                Sip, Socialise &amp;
                <br />
                Savour by the Sea
              </h2>
              <p className="text-charcoal/60 leading-relaxed mb-5">
                Perched at the water&apos;s edge, La Playa Bar &amp; Café is El
                Mar&apos;s premier beachfront social hub. From signature sunset
                cocktails to hand-crafted mocktails and cold brews, every sip is
                made to linger over.
              </p>
              <p className="text-charcoal/60 leading-relaxed mb-8">
                The ideal venue for private functions, intimate celebrations,
                and spontaneous gatherings. Let the sound of the waves set the
                soundtrack for your evening.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "Private Events",
                  "Sunset Cocktails",
                  "Live Acoustic",
                  "Beach Gatherings",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-seafoam rounded-full text-xs uppercase tracking-[0.15em] text-teal-dark font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/contact" className="sv-btn-outline inline-block">
                Enquire for Events
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] group order-1 lg:order-2"
            >
              <img
                src={`${CDN}/JES08503.jpg`}
                alt="La Playa Bar"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs uppercase tracking-[0.18em] text-teal font-semibold">
                  Bar &amp; Café
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banners */}
      <section className="pb-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {banners.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Link
                  to={b.to}
                  className="group block relative overflow-hidden rounded-2xl aspect-[16/7]"
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
                      {b.subtitle}
                    </p>
                    <h3 className="font-serif text-3xl text-white group-hover:translate-x-1 transition-transform duration-300">
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
      <section className="bg-teal-dark py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-pre-title text-white/60 mb-4">
              Reserve a Table or Room
            </p>
            <h2 className="font-serif text-4xl text-white mb-5">
              Savour Every Moment
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Book your stay and enjoy exclusive access to all our dining
              venues.
            </p>
            <Link to="/booking" className="sv-btn">
              Book a Stay
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
