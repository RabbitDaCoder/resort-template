import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
];

export default function AboutPreview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left — text */}
        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            About Us
          </p>
          <h2 className="font-serif text-3xl lg:text-[38px] text-charcoal leading-tight mb-6">
            A Hidden Gem on the Shores of Batangas
          </h2>
          <p className="text-gray-600 leading-[1.8] mb-6">
            A small resort on a property that has been privately owned for over
            30 years and was recently opened to the public. The resort was only
            meant to be a hide away for a family of 13 children and hence the
            many rooms and a large pavilion.
          </p>
          <Link
            to="/about"
            className="text-sm font-medium text-olive hover:underline"
          >
            Learn More &rarr;
          </Link>
        </div>

        {/* Right — image grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-2 h-[420px] lg:h-[480px]">
            <img
              src={images[0]}
              alt="Resort grounds"
              className="w-full h-full object-cover"
            />
            <img
              src={images[1]}
              alt="Beach view"
              className="w-full h-full object-cover row-span-2"
            />
            <img
              src={images[2]}
              alt="Rooms"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
