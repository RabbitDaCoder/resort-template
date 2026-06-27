import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand";

const CDN = brand.cdnBase;

const ACTIVITIES = [
  {
    name: "Water Activities",
    image: `${CDN}/img_52.jpg`,
    description:
      "Kayaking, jet skiing, snorkeling, and more — our waters are your playground. Perfect for thrill-seekers and families alike.",
    href: "/activities",
  },
  {
    name: "Private Events & Weddings",
    image: `${CDN}/img_53.jpg`,
    description:
      "From intimate beach ceremonies to grand celebrations, Discovery Samal provides a stunning backdrop for your most precious moments.",
    href: "/activities",
  },
  {
    name: "Beachfront Infinity Pool",
    image: `${CDN}/WhatsApp_Image_2025-08-09_at_10.18.48AM_1.jpeg`,
    description:
      "Enjoy a refreshing swim in our infinity pool while taking in the breathtaking horizon views over the Davao Gulf.",
    href: "/activities",
  },
  {
    name: "Wellness & Massage",
    image: `${CDN}/img_51.jpg`,
    description:
      "Surrender to a world of relaxation with our beachfront massage services and holistic wellness treatments.",
    href: "/activities",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function ActivitiesSection() {
  return (
    <section
      id="activities"
      className="scroll-mt-20 bg-warm-white py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <p className="section-pre-title mb-4">Activities & Experiences</p>
          <h2 className="font-serif text-4xl text-charcoal sm:text-5xl">
            Things to Do
          </h2>
          <p className="mt-5 text-sm text-charcoal/55 max-w-xl mx-auto">
            From thrilling water sports to intimate wellness moments — there is
            always something to discover at Discovery Samal Resort.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map((activity, i) => (
            <motion.article
              key={activity.name}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group overflow-hidden bg-white shadow-sm"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  {activity.name}
                </h3>
                <p className="text-sm text-charcoal/55 leading-relaxed mb-4">
                  {activity.description}
                </p>
                <Link
                  to={activity.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal hover:text-teal-dark transition-colors"
                >
                  Learn More â†’
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <Link to="/activities" className="sv-btn-outline">
            All Activities
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
