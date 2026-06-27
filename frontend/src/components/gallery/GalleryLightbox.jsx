import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, galleryImages } from "../../data/galleryData";

const labelFor = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export default function GalleryLightbox({ openId, onClose, onChange }) {
  const open = openId !== null && openId !== undefined;
  const index = open ? galleryImages.findIndex((i) => i.id === openId) : -1;
  const image = index >= 0 ? galleryImages[index] : null;
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);

  const goPrev = () => {
    if (index <= 0) return;
    setDirection(-1);
    onChange(galleryImages[index - 1].id);
  };
  const goNext = () => {
    if (index < 0 || index >= galleryImages.length - 1) return;
    setDirection(1);
    onChange(galleryImages[index + 1].id);
  };

  // Keyboard nav
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Prefetch neighbors
  useEffect(() => {
    if (!open || index < 0) return;
    [index - 1, index + 1].forEach((i) => {
      const next = galleryImages[i];
      if (next) {
        const img = new Image();
        img.src = next.src;
      }
    });
  }, [open, index]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const dx = touchStartX.current - endX;
    if (dx > 50) goNext();
    else if (dx < -50) goPrev();
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {open && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(29,33,56,0.96)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Category tag */}
          <span
            className="fixed left-5 top-5 z-[2] rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
            style={{ backgroundColor: "#C9B48A", color: "#1D2138" }}
          >
            {labelFor(image.category)}
          </span>

          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close lightbox"
            className="fixed right-5 top-5 z-[2] text-white transition-transform duration-300 hover:rotate-90"
          >
            <X size={28} />
          </button>

          {/* Prev (desktop side) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            disabled={index === 0}
            className="fixed left-4 top-1/2 z-[2] hidden -translate-y-1/2 text-white transition-transform duration-200 hover:-translate-x-[3px] disabled:pointer-events-none disabled:opacity-25 sm:block"
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={36} />
          </button>

          {/* Next (desktop side) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            disabled={index === galleryImages.length - 1}
            className="fixed right-4 top-1/2 z-[2] hidden -translate-y-1/2 text-white transition-transform duration-200 hover:translate-x-[3px] disabled:pointer-events-none disabled:opacity-25 sm:block"
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronRight size={36} />
          </button>

          {/* Image */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={image.id}
              src={image.src}
              alt={image.alt}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-h-[75vh] max-w-[100vw] rounded-md object-contain sm:max-h-[86vh] sm:max-w-[88vw]"
            />
          </AnimatePresence>

          {/* Mobile prev/next bottom strip */}
          <div className="fixed inset-x-0 bottom-12 z-[2] flex items-center justify-center gap-8 sm:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={index === 0}
              aria-label="Previous image"
              className="text-white disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              disabled={index === galleryImages.length - 1}
              aria-label="Next image"
              className="text-white disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Counter */}
          <div
            className="fixed inset-x-0 bottom-5 z-[2] text-center text-[13px]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            {index + 1} / {galleryImages.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
