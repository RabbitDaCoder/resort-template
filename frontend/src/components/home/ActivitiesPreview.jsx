import { Link } from "react-router-dom";
import { brand } from "../../lib/brand";

const activities = [
  {
    name: "Jet Ski",
    image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600",
    desc: "Race across the waves on our high-powered jet skis.",
  },
  {
    name: "Banana Boat",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
    desc: "Hold on tight for a thrilling banana boat ride.",
  },
  {
    name: "Kayaking",
    image: "https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=600",
    desc: "Explore the calm waters at your own pace.",
  },
  {
    name: "Snorkeling",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600",
    desc: "Discover the rich marine life in the sanctuary.",
  },
  {
    name: "Flying Fish",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600",
    desc: "Feel like you are flying above the sea.",
  },
];

export default function ActivitiesPreview() {
  return (
    <section className="bg-charcoal py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — left aligned */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-olive font-semibold mb-3">
            Experience
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Activities
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            {brand.displayName} pairs the shoreline with water activities that
            make quick getaways feel fuller without overpacking the itinerary.
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, 5-col grid desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 scrollbar-hide">
          {activities.map((activity) => (
            <div
              key={activity.name}
              className="relative overflow-hidden group cursor-pointer flex-shrink-0 w-56 lg:w-auto"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75"
                />
                <div className="absolute inset-0 bg-forest/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to="/activities"
                    className="border border-white text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-forest transition-colors duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-white font-serif text-lg mb-1">
                  {activity.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {activity.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
