import { motion } from "framer-motion";
import { galleryImages } from "../../data/galleryData";

const HERO_IMG =
  "https://lirp.cdn-website.com/b434b26a/dms3rep/multi/opt/dji_fly_20230424_153756_212_1682322109283_photo_optimized-1920w.jpeg";

export default function GalleryHero() {
  return (
    <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
      <img
        src={HERO_IMG}
        alt="Discovery Samal Resort aerial view"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29,33,56,0.30) 0%, rgba(29,33,56,0.72) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-[11px] font-medium uppercase"
          style={{ color: "#C9B48A", letterSpacing: "0.35em" }}
        >
          Samal Island, Davao del Norte· Philippines
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif font-bold text-white"
          style={{ fontSize: "clamp(40px, 6.5vw, 68px)", lineHeight: 1.05 }}
        >
          Life at Discovery Samal.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-4 max-w-xl text-[18px] font-light"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          Every pool, every sunset, every moment — captured.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute bottom-6 right-6 z-10 rounded-full px-[18px] py-[8px] text-[13px] text-white"
        style={{
          backgroundColor: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {galleryImages.length} Photos
      </motion.div>
    </section>
  );
}
