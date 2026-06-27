import { motion } from "framer-motion";
import { brand } from "../../lib/brand";

const CDN = brand.cdnBase;

const FEATURES = [
  {
    pre: "Located in",
    title: "Getting Here",
    body: "Discovery Samal Resort is located on Samal Island, Island Garden City of Samal, Davao del Norte — accessible via Francisco Bangoy International Airport in Davao City.",
    image: `${CDN}/img_26.jpg`,
    reverse: false,
  },
  {
    pre: "Stay Connected",
    title: "Free Wi-Fi",
    body: "Stay connected with our complimentary high-speed Wi-Fi available throughout the resort, including all rooms and outdoor areas.",
    image: `${CDN}/img_06.jpg`,
    reverse: true,
  },
  {
    pre: "Comfort Awaits",
    title: "King Size Beds",
    body: "Sink into cloud-like king-size beds with premium linen in our spacious seaview rooms, each with a private terrace overlooking the sea.",
    image: `${CDN}/img_15.jpg`,
    reverse: false,
  },
  {
    pre: "Relax & Rejuvenate",
    title: "Wellness & Spa",
    body: "From beachfront massages to holistic body treatments, our wellness offerings are designed to restore balance to your mind and body.",
    image: `${CDN}/img_25.jpg`,
    reverse: true,
  },
  {
    pre: "Dine In",
    title: "Room Service",
    body: "Enjoy freshly prepared meals delivered directly to your room. Our in-room dining menu features an array of local and international cuisine.",
    image: `${CDN}/img_12.jpg`,
    reverse: false,
  },
  {
    pre: "Culinary Journey",
    title: "Restaurant & Bar",
    body: "Our Sunrise Pavilion restaurant serves breakfast, lunch, and dinner with stunning views of the ocean, complemented by a full-service bar.",
    image: `${CDN}/img_27.jpg`,
    reverse: true,
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export default function FeatureGridSection() {
  return (
    <section className="overflow-hidden bg-seafoam">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className={`grid min-h-[360px] md:grid-cols-2 ${f.reverse ? "md:[&>*:first-child]:order-2" : ""}`}
        >
          {/* Image */}
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1 }}
          >
            <img
              src={f.image}
              alt={f.title}
              className="h-full min-h-[280px] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex flex-col justify-center px-10 py-14 lg:px-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeIn}
          >
            <p className="section-pre-title mb-4">{f.pre}</p>
            <h3 className="font-serif text-3xl text-charcoal sm:text-4xl">
              {f.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-charcoal/60">
              {f.body}
            </p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
