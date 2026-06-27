import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import GalleryItem from "./GalleryItem";
import { galleryImages } from "../../data/galleryData";

export default function GalleryGrid({ activeCategory, onOpen }) {
  const items = useMemo(() => {
    if (activeCategory === "all") return galleryImages;
    return galleryImages.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-[15px]" style={{ color: "rgba(29,33,56,0.35)" }}>
          No photos in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 pt-10 sm:px-6">
      <div
        className="[column-gap:8px] sm:[column-gap:12px]"
        style={{ columnCount: "auto" }}
      >
        <div
          className="columns-1 sm:columns-2 lg:columns-3"
          style={{ columnGap: "12px" }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((img, idx) => (
              <GalleryItem
                key={img.id}
                image={img}
                index={idx}
                onOpen={onOpen}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
