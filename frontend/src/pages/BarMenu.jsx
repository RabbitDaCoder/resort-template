import { Link } from "react-router-dom";
import hom5 from "../assets/slides/hom5.jpg";
import hom6 from "../assets/slides/hom6.jpg";
import hom7 from "../assets/slides/hom7.jpg";

const BAR_ITEMS = [
  {
    title: "Golden Hour Spritz",
    description: "Citrus, botanical bitters, and sparkling finish.",
  },
  {
    title: "Coastal Mule",
    description: "Ginger, lime, and house-crafted syrup.",
  },
  {
    title: "Nightfall Old Fashioned",
    description: "Barrel-aged blend with smoked citrus.",
  },
  {
    title: "Tropical Zero Proof",
    description: "Fresh pineapple, mint, and coconut water.",
  },
];

const BAR_GALLERY = [hom5, hom6, hom7];

export default function BarMenu() {
  return (
    <div className="bg-cream">
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img
          src={hom5}
          alt="Bar Menu"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/45 to-charcoal/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 w-full pb-14">
            <p className="label-tag text-gold">Bar</p>
            <h1 className="mt-4 font-serif text-4xl text-white lg:text-6xl">
              Bar Menu
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-3">Infinity Bar</p>
            <h2 className="font-serif text-4xl text-forest-dark">
              Golden Hour Rituals
            </h2>
            <p className="mt-4 text-sm text-charcoal/55">
              Sip signature cocktails and crisp pours as the sky fades to amber,
              framed by the shoreline breeze.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {BAR_GALLERY.map((image) => (
              <div key={image} className="h-56 overflow-hidden">
                <img
                  src={image}
                  alt="Bar service"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-cream-dark p-10">
            <h2 className="font-serif text-3xl text-forest-dark mb-8">
              Signature Cocktails
            </h2>
            <div className="space-y-6">
              {BAR_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-cream-dark pb-5"
                >
                  <h3 className="font-serif text-xl text-forest-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal/55">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/booking"
              className="mt-10 inline-flex items-center justify-center border border-forest text-forest px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-forest hover:text-white transition-colors"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
