const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "frontend",
  "src",
  "data",
  "aboutData.js",
);
let content = fs.readFileSync(filePath, "utf8");

// Fix remaining garbled sequences (latin1-decoded UTF-8 mojibake)
content = content.replace(/â€"/g, "\u2014"); // em dash —
content = content.replace(/Â·/g, "\u00B7"); // middle dot ·
content = content.replace(/â˜…/g, "\u2605"); // star ★
// Remove all box-drawing comment decorations (they appear in comments only)
content = content.replace(/â"€/g, "\u2500");

// Fix "Eight restaurants" blurb in EXPERIENCES
content = content.replace(
  "Eight restaurants — from Mediterranean coastal kitchens to specialty bars and lounges.",
  "Three dining venues — The Bistro, Morning Catch, and Haribar Lounge — offering fresh seafood, al fresco meals, and beach cocktails.",
);

// Fix Recreation blurb (9-hole golf / cliffside grounds)
content = content.replace(
  "Pools, courts, watersports and a 9-hole golf course set across the cliffside grounds.",
  "Watersports, kayaking, beach volleyball, and an infinity pool overlooking the Davao Gulf.",
);

// Fix Recreation image
content = content.replace(
  'image: "/activities/water/fira-infinity-pool/slider-image1.jpg",',
  "image: hom5,",
);

// Fix Wellness blurb
content = content.replace(
  "Zaphira Spa rituals, a fitness studio, and quiet hours framed by lantern light.",
  "The Spa at Discovery Samal — body rituals, massage therapies, and quiet hours by the water.",
);

// Fix Wellness image
content = content.replace(
  'image: "/activities/wellness/zaphira-spa/article-image2.jpg",',
  "image: hom8,",
);

// Fix Entertainment blurb
content = content.replace(
  "Lounge evenings, live music, and luminous garden walks among 11,000 LED roses.",
  "Haribar Lounge evenings, live music nights, and sunset cocktails by the beach.",
);

// Fix Entertainment image
content = content.replace(
  'image: "/activities/scenery/led-roses/viber_image_2019-11-12_15-42-26.jpg",',
  "image: hom7,",
);

// Fix Events blurb
content = content.replace(
  "Eight venues for weddings, debuts, and milestone gatherings above the West Philippine Sea.",
  "The Samal Grand Ballroom and scenic island venues for weddings, debuts, and milestone gatherings.",
);

// Fix Events image
content = content.replace(
  `image:
      "/events/_hero/event-venues-page-website-header-announcement-1600-x-649-1.jpg",`,
  "image: hom3,",
);

// Fix HIGHLIGHTS
content = content.replace(
  `  { value: 20, suffix: "+", label: "Years of Excellence" },
  { value: 100, suffix: "+", label: "Luxury Suites & Villas" },
  { value: 8, suffix: "", label: "Event Venues" },
  { value: 8, suffix: "", label: "Restaurants & Bars" },
  { value: 65, suffix: " ha", label: "Cliffside Grounds" },`,
  `  { value: 153, suffix: "+", label: "Villas & Suites" },
  { value: 3, suffix: "", label: "Restaurants & Bars" },
  { value: 10, suffix: "+", label: "Activities & Sports" },
  { value: 1, suffix: "", label: "Grand Ballroom" },
  { value: 5, suffix: "\u2605", label: "Experience" },`,
);

// Fix WHY_US items
content = content.replace(
  "Five-star rooms and villas designed in a Santorini whitewashed palette of blue and gold.",
  "153 lush villas and suites bringing the most distinctive luxury of space on Samal Island.",
);
content = content.replace(
  "Cliffside views over the West Philippine Sea — sunrise, sunset, and the long blue between.",
  "Breathtaking views of the Davao Gulf — sunrise, sunset, and the long blue of Samal waters.",
);
content = content.replace(
  "From Zaphira Spa rituals to luminous LED-rose gardens, every hour of the day is composed.",
  "From The Spa wellness rituals to island watersports, every hour of the day is composed.",
);
content = content.replace(
  "Two flagship destinations — Poro Point and Rizal — anchored in Philippine landscape and craft.",
  "A Discovery Hospitality Corporation property — anchored in Philippine landscape, culture, and craft.",
);

// Fix GALLERY - replace broken local paths with hom images
content = content.replace(
  `export const GALLERY = [
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
];`,
  `export const GALLERY = [
  hom1,
  hom2,
  hom3,
  hom4,
  hom5,
  hom6,
  hom7,
  hom8,
];`,
);

// Fix TESTIMONIALS
content = content.replace(
  "A genuinely luxurious escape. The Santorini architecture is breathtaking and the service was warm at every turn — a true hidden gem of Northern Luzon.",
  "A genuinely luxurious island escape. The villas are breathtaking and the service was warm at every turn — a true hidden gem of Mindanao.",
);
content = content.replace(
  "We held our wedding at the sundeck venue. Sunset over the West Philippine Sea, golden hour, attentive staff — exactly the moment we had imagined.",
  "We celebrated our wedding at the Samal Grand Ballroom. Sunset over the Davao Gulf, golden hour, attentive staff — exactly the moment we had imagined.",
);
content = content.replace(
  "Guest \u00b7 Manila", // already fixed middle dot
  "Guest \u00b7 Manila",
);

// Fix PROPERTIES block (Poro Point → Discovery Samal + Primea)
const propPattern = /export const PROPERTIES = \[[\s\S]*?\];/;
const newProps = `export const PROPERTIES = [
  {
    slug: "discovery-samal",
    company: "Discovery Hospitality Corporation",
    name: "Discovery Samal \u2014 Island Luxury Resort",
    location: "Samal Island \u00b7 Davao del Norte",
    description:
      "Set on the pristine shores of Samal Island, Discovery Samal Resort offers 153 lush villas and suites overlooking the Davao Gulf. Complete with beachfront dining, the Samal Grand Ballroom, watersports, The Spa, and unmatched Filipino hospitality \u2014 the premier island resort escape in Mindanao.",
    image: hom2,
    stats: [
      { value: "153", label: "Villas & Suites" },
      { value: "3", label: "Restaurants" },
      { value: "5\u2605", label: "Experience" },
    ],
  },
  {
    slug: "discovery-primea",
    company: "Discovery Hospitality Corporation",
    name: "Discovery Primea \u2014 Urban Sanctuary",
    location: "Ayala Avenue \u00b7 Makati City",
    description:
      "Discovery Primea brings the same tradition of warm hospitality to the heart of Makati\u2019s central business district. Luxury hotel suites, world-class dining at Kipling\u2019s Restaurant, and an elevated city experience steps from Ayala Center.",
    image: hom4,
    stats: [
      { value: "223", label: "Rooms & Suites" },
      { value: "5\u2605", label: "Deluxe Hotel" },
      { value: "2015", label: "Est." },
    ],
  },
];`;

if (propPattern.test(content)) {
  content = content.replace(propPattern, newProps);
  console.log("PROPERTIES block replaced successfully");
} else {
  console.log("WARN: PROPERTIES block pattern not matched");
}

fs.writeFileSync(filePath, content, "utf8");
console.log("aboutData.js fixed successfully");
