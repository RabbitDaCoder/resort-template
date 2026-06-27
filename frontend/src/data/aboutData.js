// About Us — content map
// All imagery reused from existing local assets (activities, events, restaurants, home slides).

import hom1 from "../assets/slides/hom1.jpg";
import hom2 from "../assets/slides/hom2.jpg";
import hom3 from "../assets/slides/hom3.jpg";
import hom4 from "../assets/slides/hom4.jpg";
import hom5 from "../assets/slides/hom5.jpg";
import hom6 from "../assets/slides/hom6.jpg";
import hom7 from "../assets/slides/hom7.jpg";
import hom8 from "../assets/slides/hom8.jpg";

export const ABOUT_HERO_IMAGE = hom3;

export const ABOUT_HERO = {
  preTitle: "About Discovery Samal",
  title: "Where luxury meets",
  titleAccent: "experience",
  body: "A world-class destination crafted for unforgettable escapes — relaxation, entertainment, and premium hospitality on the shores of Samal Island, Davao del Norte.",
};

// â”€â”€â”€ OUR STORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const STORY = {
  preTitle: "Our Story",
  title: "Two destinations.",
  titleAccent: "One legacy of hospitality.",
  paragraphs: [
    "Discovery Samal Hospitality Group, Inc. is the steward of two of the country's most distinctive integrated resort destinations — a legacy built on hospitality, design, and a love of the Philippine coastline.",
    "Discovery Samal Resort is a premier island resort destination nestled on the pristine shores of Samal Island, Island Garden City of Samal, Davao del Norte. Set against the breathtaking backdrop of the Davao Gulf, the resort offers 153 lush villas and suites thoughtfully designed for those who seek luxury, seclusion, and the unhurried rhythm of island life.",
    "It is the premier island resort in Davao del Norte — complete with private pool villas, hotel suites, beachfront dining, the Samal Grand Ballroom, and a full range of watersports and wellness experiences for families, couples, and groups.",
  ],
  image: hom1,
  imageCaption: "Samal Island, Davao del Norte · Premier island resort",
};

// â”€â”€â”€ PROPERTIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PROPERTIES = [
  {
    slug: "discovery-samal",
    company: "Discovery Hospitality Corporation",
    name: "Discovery Samal — Island Luxury Resort",
    location: "Samal Island · Davao del Norte",
    description:
      "Set on the pristine shores of Samal Island, Discovery Samal Resort offers 153 lush villas and suites overlooking the Davao Gulf. Complete with beachfront dining, the Samal Grand Ballroom, watersports, The Spa, and unmatched Filipino hospitality — the premier island resort escape in Mindanao.",
    image: hom2,
    stats: [
      { value: "153", label: "Villas & Suites" },
      { value: "3", label: "Restaurants" },
      { value: "5★", label: "Experience" },
    ],
  },
  {
    slug: "discovery-primea",
    company: "Discovery Hospitality Corporation",
    name: "Discovery Primea — Urban Sanctuary",
    location: "Ayala Avenue · Makati City",
    description:
      "Discovery Primea brings the same tradition of warm hospitality to the heart of Makati’s central business district. Luxury hotel suites, world-class dining at Kipling’s Restaurant, and an elevated city experience steps from Ayala Center.",
    image: hom4,
    stats: [
      { value: "223", label: "Rooms & Suites" },
      { value: "5★", label: "Deluxe Hotel" },
      { value: "2015", label: "Est." },
    ],
  },
];

// â”€â”€â”€ EXPERIENCE PILLARS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const EXPERIENCES = [
  {
    title: "Luxury Suites",
    blurb:
      "Hotel rooms and private villas calibrated for quiet, light, and a view of the sea.",
    image: hom5,
    href: "/rooms",
  },
  {
    title: "Fine Dining",
    blurb:
      "Three dining venues — The Bistro, Morning Catch, and Haribar Lounge — offering fresh seafood, al fresco meals, and beach cocktails.",
    image: hom6,
    href: "/restaurants",
  },
  {
    title: "Recreation",
    blurb:
      "Watersports, kayaking, beach volleyball, and an infinity pool overlooking the Davao Gulf.",
    image: hom5,
    href: "/activities",
  },
  {
    title: "Wellness",
    blurb:
      "The Spa at Discovery Samal — body rituals, massage therapies, and quiet hours by the water.",
    image: hom8,
    href: "/activities",
  },
  {
    title: "Entertainment",
    blurb:
      "Haribar Lounge evenings, live music nights, and sunset cocktails by the beach.",
    image: hom7,
    href: "/activities",
  },
  {
    title: "Events & Celebrations",
    blurb:
      "The Samal Grand Ballroom and scenic island venues for weddings, debuts, and milestone gatherings.",
    image:
      "/events/_hero/event-venues-page-website-header-announcement-1600-x-649-1.jpg",
    href: "/events",
  },
];

// â”€â”€â”€ RESORT HIGHLIGHTS (counter stats) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const HIGHLIGHTS = [
  { value: 20, suffix: "+", label: "Years of Excellence" },
  { value: 100, suffix: "+", label: "Luxury Suites & Villas" },
  { value: 8, suffix: "", label: "Event Venues" },
  { value: 8, suffix: "", label: "Restaurants & Bars" },
  { value: 65, suffix: " ha", label: "Cliffside Grounds" },
];

// â”€â”€â”€ WHY CHOOSE US â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const WHY_US = [
  {
    title: "World-Class Hospitality",
    blurb:
      "Two decades of integrated-resort experience, distilled into thoughtful, attentive service.",
  },
  {
    title: "Elegant Accommodations",
    blurb:
      "153 lush villas and suites bringing the most distinctive luxury of space on Samal Island.",
  },
  {
    title: "Scenic Destination",
    blurb:
      "Breathtaking views of the Davao Gulf — sunrise, sunset, and the long blue of Samal waters.",
  },
  {
    title: "Curated Experiences",
    blurb:
      "From The Spa wellness rituals to island watersports, every hour of the day is composed.",
  },
  {
    title: "Premium Service",
    blurb:
      "A concierge culture that anticipates — and a recreation team that elevates every itinerary.",
  },
  {
    title: "A Legacy of Place",
    blurb:
      "A Discovery Hospitality Corporation property — anchored in Philippine landscape, culture, and craft.",
  },
];

// â”€â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const GALLERY = [
  hom1,
  "/activities/scenery/urban-lights/026A0533-low-res.jpg",
  hom7,
  "/restaurants/_hero/restaurants-page-website-header-announcement-1600-x-649-1.jpg",
  "/activities/water/fira-infinity-pool/slider-image1.jpg",
  hom2,
  "/activities/scenery/saint-pio-chapel/chapel-low-res.jpg",
  "/events/_hero/events-occassions-page-website-header-announcement-1600-x-649-1.jpg",
  hom8,
  "/activities/scenery/led-roses/viber_image_2019-11-12_15-42-26.jpg",
  "/activities/water/main-pool/poro-beachclubgarden.jpg",
  hom6,
];

// â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const TESTIMONIALS = [
  {
    quote:
      "A genuinely luxurious island escape. The villas are breathtaking and the service was warm at every turn — a true hidden gem of Mindanao.",
    name: "Maria Reyes",
    role: "Guest · Manila",
  },
  {
    quote:
      "We celebrated our wedding at the Samal Grand Ballroom. Sunset over the Davao Gulf, golden hour, attentive staff — exactly the moment we had imagined.",
    name: "Jonathan & Angela Lim",
    role: "Wedding · Samal Island",
  },
  {
    quote:
      "The infinity pool is unreal. White stone, blue water, and a horizon that seems to go forever. We extended our stay by two nights.",
    name: "Daniel Cruz",
    role: "Guest · Cebu",
  },
];

// silence unused import warnings if any
export const _all = [hom1, hom2, hom3, hom4, hom5, hom6, hom7, hom8];
