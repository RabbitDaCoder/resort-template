import { Wifi, Sparkles, Waves, Map } from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    label: "Free Wifi",
    desc: "High speed internet available for each room.",
  },
  {
    icon: Sparkles,
    label: "Spa & Massage",
    desc: "Therapeutic massage using oil by trained staff.",
  },
  {
    icon: Waves,
    label: "Water Activities",
    desc: "Lots of premium water activities to choose from.",
  },
  {
    icon: Map,
    label: "Day Trip",
    desc: "Quick yet sweet escape does wonders to the soul.",
  },
];

export default function AmenitiesStrip() {
  return (
    <section className="bg-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e5e5]">
          {amenities.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center px-8 py-12"
            >
              <div className="border-2 border-olive w-20 h-20 flex items-center justify-center mb-5">
                <Icon size={32} className="text-olive" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
                {label}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
