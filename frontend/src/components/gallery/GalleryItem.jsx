import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { CATEGORIES } from "../../data/galleryData";

const labelFor = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export default function GalleryItem({ image, index, onOpen }) {
  const eager = index < 8;
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(image.id)}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        duration: 0.32,
        delay: index * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[10px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-tan/70"
      aria-label={`Open ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "auto" : "async"}
        className="block w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to top, rgba(29,33,56,0.80) 0%, transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span
          className="rounded-full px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.1em]"
          style={{ backgroundColor: "#C9B48A", color: "#1D2138" }}
        >
          {labelFor(image.category)}
        </span>
        <ZoomIn size={20} className="text-white drop-shadow" />
      </div>
    </motion.button>
  );
}
