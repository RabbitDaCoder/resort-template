import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand";

const CDN = brand.cdnBase;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
});

export default function DiningSection() {
  return (
    <section id="dining" className="scroll-mt-20 overflow-hidden bg-seafoam">
      <div className="grid min-h-[500px] lg:grid-cols-2">
        {/* Image */}
        <motion.div
          className="relative overflow-hidden min-h-[360px]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <img
            src={`${CDN}/Sunrise-Pavilion-1.jpg`}
            alt="Sunrise Pavilion Restaurant"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Text */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-16">
          <motion.p {...fadeUp(0)} className="section-pre-title mb-5">
            Dining
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-serif text-4xl text-charcoal sm:text-5xl"
          >
            Sunrise Pavilion
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-5 text-base leading-8 text-charcoal/65 max-w-md"
          >
            Enjoy fresh Filipino and international cuisine at our open-air
            Sunrise Pavilion restaurant. Dine with a stunning unobstructed view
            of the sea and start your morning with a golden sunrise over
            Samal Island's shores.
          </motion.p>
          <motion.p
            {...fadeUp(0.3)}
            className="mt-3 text-base leading-8 text-charcoal/65 max-w-md"
          >
            Whether it&rsquo;s a casual breakfast, a romantic dinner, or sunset
            cocktails, our chefs craft every dish with fresh local ingredients
            and heartfelt care.
          </motion.p>
          <motion.div {...fadeUp(0.4)} className="mt-8">
            <Link to="/contact" className="sv-btn-outline">
              Reserve a Table
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
