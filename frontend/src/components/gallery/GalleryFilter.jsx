import { useEffect, useState } from "react";
import { CATEGORIES } from "../../data/galleryData";

export default function GalleryFilter({ active, onChange, count }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="sticky top-0 z-40 border-b transition-shadow duration-300"
      style={{
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderColor: "rgba(0,0,0,0.08)",
        boxShadow: scrolled ? "0 4px 18px -8px rgba(29,33,56,0.18)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div
          className="flex flex-1 items-center gap-2 overflow-x-auto sm:gap-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.gallery-tabs::-webkit-scrollbar{display:none}`}</style>
          <div className="gallery-tabs flex items-center gap-2 sm:gap-3">
            {CATEGORIES.map((c) => {
              const isActive = c.id === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange(c.id)}
                  className="whitespace-nowrap rounded-full px-[18px] py-[7px] text-[13px] font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          backgroundColor: "#1D2138",
                          color: "#fff",
                          border: "1px solid #1D2138",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "rgba(29,33,56,0.55)",
                          border: "1px solid rgba(29,33,56,0.18)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#1D2138";
                      e.currentTarget.style.borderColor = "#1D2138";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(29,33,56,0.55)";
                      e.currentTarget.style.borderColor = "rgba(29,33,56,0.18)";
                    }
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <p
          className="hidden whitespace-nowrap text-[13px] sm:block"
          style={{ color: "rgba(29,33,56,0.40)" }}
        >
          Showing {count} {count === 1 ? "photo" : "photos"}
        </p>
      </div>
    </div>
  );
}
