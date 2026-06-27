import { Link } from "react-router-dom";
import { brand } from "../../lib/brand";

export default function LocationSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — text */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            Our Location
          </p>
          <h2 className="font-serif text-3xl lg:text-[38px] text-charcoal leading-tight mb-6">
            Laiya, San Juan, Batangas
          </h2>
          <p className="text-gray-600 leading-[1.8] mb-6">
            Located on the picturesque shores of Laiya, San Juan, Batangas,
            {` ${brand.displayName}`} is a direct-drive escape from Metro Manila
            with bright mornings, swimmable shoreline, and flexible overnight
            stays.
          </p>
          <Link
            to="/contact"
            className="text-sm font-medium text-olive hover:underline"
          >
            Get Directions &rarr;
          </Link>
        </div>

        {/* Right — map */}
        <div className="h-100">
          <iframe
            title={`${brand.displayName} Location`}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.098!2d121.4168!3d13.6693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd0e3b0e9f3b1d%3A0x7c1c1e1e1e1e1e1e!2sLa%20Luz%20Beach%20Resort!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
