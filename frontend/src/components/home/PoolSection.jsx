import { Link } from "react-router-dom";

export default function PoolSection() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920"
        className="w-full h-full object-cover brightness-50"
        alt="Swimming Pool"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <p className="text-sand text-sm uppercase tracking-[0.2em] mb-3 font-medium">
            Preference
          </p>
          <h2 className="font-serif text-white text-4xl lg:text-5xl font-bold mb-4 max-w-md">
            Swimming Pool
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
            Choose your preference of swimming in a pool or in the open sea.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-olive text-white px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium hover:bg-forest transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
