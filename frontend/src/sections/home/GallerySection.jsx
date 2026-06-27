import { motion } from "framer-motion";
import hom1 from "../../assets/slides/hom1.jpg";
import hom2 from "../../assets/slides/hom2.jpg";
import hom3 from "../../assets/slides/hom3.jpg";
import hom4 from "../../assets/slides/hom4.jpg";
import hom5 from "../../assets/slides/hom5.jpg";
import hom6 from "../../assets/slides/hom6.jpg";
import hom7 from "../../assets/slides/hom7.jpg";
import hom8 from "../../assets/slides/hom8.jpg";

const GALLERY_IMAGES = [hom1, hom2, hom3, hom4, hom5, hom6, hom7, hom8];

export default function GallerySection() {
  return (
    <section
      id="gallery"
      className="scroll-mt-20 bg-cream-light py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <p className="label-tag mb-4">Gallery</p>
          <h2 className="font-serif text-5xl text-forest-dark sm:text-6xl">
            The Discovery Samal Moments
          </h2>
          <p className="mt-5 text-sm text-charcoal/55">
            A glimpse of the coastal calm, curated escapes, and golden-hour
            stories.
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY_IMAGES.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.6 }}
              className="overflow-hidden bg-white"
            >
              <img
                src={src}
                alt={`Discovery Samal gallery ${index + 1}`}
                className="w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
