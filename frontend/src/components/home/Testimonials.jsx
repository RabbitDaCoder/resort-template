import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    date: "March 2025",
    avatar: "https://i.pravatar.cc/80?img=1",
    text: "Absolutely stunning resort! The beach is pristine, staff was incredibly friendly, and the food was amazing. We will definitely be coming back for our anniversary next year.",
  },
  {
    name: "James Reyes",
    date: "January 2025",
    avatar: "https://i.pravatar.cc/80?img=3",
    text: "We booked the villa for a family reunion and it was perfect. Spacious rooms, great amenities, and the kids loved the water activities. Best vacation we have had in years.",
  },
  {
    name: "Angela Cruz",
    date: "December 2024",
    avatar: "https://i.pravatar.cc/80?img=5",
    text: "A hidden paradise in Batangas. The sunset views from the beachfront are incredible. The spa services were top-notch and exactly what I needed for a relaxing getaway.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-offwhite py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            What Guests Say
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal">
            Testimonials
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ name, date, avatar, text }) => (
            <div
              key={name}
              className="bg-white border-t-4 border-olive shadow-sm p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-sand text-sand" />
                ))}
              </div>

              {/* Quote */}
              <span className="text-sand text-5xl font-serif leading-none block mb-2">
                &ldquo;
              </span>
              <p className="text-gray-600 italic leading-relaxed mb-6">
                {text}
              </p>

              {/* Divider */}
              <hr className="border-gray-200 mb-5" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-charcoal">{name}</p>
                  <p className="text-xs text-gray-400">{date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
