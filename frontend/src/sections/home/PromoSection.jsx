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

export default function PromoSection() {
  return (
    <section className="overflow-hidden bg-warm-white">
      <div className="grid min-h-[500px] lg:grid-cols-2">
        {/* Text */}
        <div className="flex flex-col justify-center px-10 py-16 lg:px-16">
          <motion.p {...fadeUp(0)} className="section-pre-title mb-5">
            Special Offer
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-serif text-4xl text-charcoal sm:text-5xl"
          >
            Up To 50% OFF Luxury Stays
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-5 text-base leading-8 text-charcoal/65 max-w-md"
          >
            Greetings from Discovery Samal Resort. Enjoy exclusive discounted rates
            with premium inclusions designed for a seamless beachfront escape.
          </motion.p>
          <motion.ul
            {...fadeUp(0.3)}
            className="mt-5 space-y-2 text-sm text-charcoal/65"
          >
            {[
              "Full Board Buffet Meals",
              "Free Airport Transfer from Clark International Airport",
              "Beachfront, Pool, Cabana and Pavilion Access",
              "Welcome Drink on arrival",
              "Pet-Friendly accommodation and free WiFi",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {item}
              </li>
            ))}
          </motion.ul>
          <motion.div {...fadeUp(0.4)} className="mt-8">
            <Link to="/booking" className="sv-btn">
              Book Your Promo Stay
            </Link>
          </motion.div>
        </div>

        {/* Image collage */}
        <motion.div
          className="grid grid-cols-2 min-h-[360px]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <img
            src={`${CDN}/img_44.jpg`}
            alt="Day pass beach"
            className="h-full w-full object-cover"
          />
          <div className="grid grid-rows-2">
            <img
              src={`${CDN}/img_47.jpg`}
              alt="Day pass activities"
              className="h-full w-full object-cover"
            />
            <img
              src={`${CDN}/img_48.jpg`}
              alt="Day pass pool"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
