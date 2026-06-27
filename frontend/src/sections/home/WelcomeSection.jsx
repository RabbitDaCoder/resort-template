import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand";

const CDN = brand.cdnBase;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function WelcomeSection() {
  return (
    <section className="bg-warm-white py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Text + image two-col */}
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-24">
          {/* Left: text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="section-pre-title mb-5"
            >
              Discovery Samal Resort on Samal Island, Davao del Norte
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-serif text-4xl leading-snug text-charcoal sm:text-5xl"
            >
              Welcome to a Seaside Sanctuary
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-base leading-8 text-charcoal/65"
            >
              Nestled along the pristine shores of Samal Island, Davao del Norte
              Discovery Samal&nbsp;Villas invites you to experience an exclusive
              coastal retreat where luxury meets nature. Our world-class
              amenities, attentive service, and breathtaking surroundings create
              an unforgettable escape for couples, families, and groups.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-4 text-base leading-8 text-charcoal/65"
            >
              Wake up to the sound of waves, spend your days exploring the
              crystal-clear waters, and unwind at our Sunrise Pavilion
              restaurant with a cold drink and a stunning sea view.
            </motion.p>
            <motion.div variants={fadeUp} custom={4} className="mt-8">
              <Link to="/about" className="sv-btn-outline">
                About Discovery Samal
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: image grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2 overflow-hidden">
              <img
                src={`${CDN}/sundownersvillas01_qX9pJvj.jpg`}
                alt="Discovery Samal Resort aerial view"
                className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden">
              <img
                src={`${CDN}/img_15.jpg`}
                alt="Discovery Samal bedroom"
                className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden">
              <img
                src={`${CDN}/Sunrise-Pavilion-1.jpg`}
                alt="Discovery Samal dining"
                className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
