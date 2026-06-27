import { CheckCircle } from "lucide-react";
import { brand } from "../../lib/brand";

const rules = [
  "Check-in time is 2:00 PM, check-out is 12:00 noon.",
  "Government-issued ID is required upon registration.",
  "A security deposit of PHP 2,000 is collected upon check-in.",
  "Outside food and beverages are not allowed inside the resort.",
];

export default function ArrivalInfo() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* Left — dark green */}
      <div className="bg-forest text-white px-8 lg:px-16 py-20 lg:py-28 flex items-center">
        <div>
          <h2 className="font-serif text-3xl lg:text-[38px] leading-tight mb-8">
            Arrival and Registration
          </h2>
          <ul className="space-y-5">
            {rules.map((rule) => (
              <li key={rule} className="flex gap-3 items-start">
                <CheckCircle size={20} className="text-sand shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-white/90">
                  {rule}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — off-white */}
      <div className="bg-offwhite px-8 lg:px-16 py-20 lg:py-28 flex items-center">
        <div>
          <h2 className="font-serif text-3xl lg:text-[38px] text-charcoal leading-tight mb-6">
            Book Online Today
          </h2>
          <p className="text-gray-600 leading-[1.8] mb-4">
            Planning your dream beach vacation has never been easier. Book
            online to secure the best rates and availability.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            For inquiries contact us at{" "}
            <a
              href={`mailto:${brand.email}`}
              className="text-olive hover:underline"
            >
              {brand.email}
            </a>
          </p>
          <a
            href="/booking"
            className="inline-block bg-forest text-white px-10 py-4 uppercase tracking-[0.15em] text-sm font-medium hover:bg-forest-dark transition-colors duration-300"
          >
            Book Online Now
          </a>
        </div>
      </div>
    </section>
  );
}
