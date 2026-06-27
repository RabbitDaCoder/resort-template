import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GalleryHero from "../components/gallery/GalleryHero";
import GalleryFilter from "../components/gallery/GalleryFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import GalleryLightbox from "../components/gallery/GalleryLightbox";
import { galleryImages } from "../data/galleryData";

const CTA_IMG =
  "https://image-tc.galaxy.tf/wijpeg-aeexb9m4bu60ndq3vcdnb7l9o/discovery-samal-08124-2_standard.jpg";

export default function Gallery() {
  const [active, setActive] = useState("all");
  const [openId, setOpenId] = useState(null);

  const visibleCount = useMemo(() => {
    if (active === "all") return galleryImages.length;
    return galleryImages.filter((i) => i.category === active).length;
  }, [active]);

  return (
    <main className="bg-warm-white">
      <GalleryHero />

      <GalleryFilter
        active={active}
        onChange={setActive}
        count={visibleCount}
      />

      <GalleryGrid activeCategory={active} onOpen={(id) => setOpenId(id)} />

      <GalleryLightbox
        openId={openId}
        onClose={() => setOpenId(null)}
        onChange={setOpenId}
      />

      {/* CTA strip */}
      <section className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
        <img
          src={CTA_IMG}
          alt="Discovery Samal beachfront at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-bold text-white"
            style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.1 }}
          >
            Ready to Make Your Own Memories?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-4 max-w-xl text-[16px] sm:text-[18px]"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Book a villa. Show up. The rest takes care of itself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Link to="/booking" className="sv-btn">
              Book Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
