const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function fix(relPath, replacements) {
  const full = path.join(root, relPath);
  let c = fs.readFileSync(full, "utf8");
  const before = c;
  for (const [from, to] of replacements) {
    c = c.split(from).join(to);
  }
  if (c !== before) {
    fs.writeFileSync(full, c, "utf8");
    console.log("Fixed: " + relPath);
  } else {
    console.log("No change: " + relPath);
  }
}

// About.jsx
fix("frontend/src/pages/About.jsx", [
  // Mojibake em dash in text
  ["\u00e2\u0080\u009c", "\u201c"], // â€œ → "
  ["\u00e2\u0080\u009d", "\u201d"], // â€ → "
  ["\u00e2\u0080\u0094", "\u2014"], // â€" → —
  // Wrong location data
  ["along White Beach.", "on Samal Island, Davao del Norte."],
  ['"Steps from White Beach."', '"Island beachfront location."'],
  [
    '{ icon: Waves, label: "White Beach", value: "Steps Away" }',
    '{ icon: Waves, label: "Davao Gulf", value: "Beachfront" }',
  ],
  [
    '{ icon: Plane, label: "Caticlan Airport", value: "~30 min" }',
    '{ icon: Plane, label: "Davao Airport", value: "~30 min + ferry" }',
  ],
  [
    '{ icon: MapPin, label: "Station 3", value: "Prime spot" }',
    '{ icon: MapPin, label: "Samal Island", value: "IGACOS, Davao del Norte" }',
  ],
  // Gallery section caption
  [
    "Wander through the moments that define a stay at discoverysamal \u2014 from",
    "Wander through the moments that define a stay at Discovery Samal \u2014 from",
  ],
  [
    'Find us on <em className="italic text-[#008c8c]">White Beach</em>.',
    'Find us on <em className="italic text-[#008c8c]">Samal Island</em>.',
  ],
  // Wrong stats
  [
    '{ value: 10, suffix: "+", label: "Luxury Rooms" }',
    '{ value: 153, suffix: "+", label: "Villas & Suites" }',
  ],
  [
    '{ value: 5000, suffix: "+", label: "Happy Guests" }',
    '{ value: 3, suffix: "", label: "Restaurants & Bars" }',
  ],
]);

// Amenities.jsx
fix("frontend/src/pages/Amenities.jsx", [
  ['"Front Row to White Beach"', '"Beachfront on Samal Island"'],
  ["A true sanctuary on White Beach.", "A true sanctuary on Samal Island."],
  ["Discovery Samal \u00b7 White Beach", "Discovery Samal \u00b7 Samal Island"],
]);

// Contact.jsx
fix("frontend/src/pages/Contact.jsx", [
  [
    'alt="Discovery Samal \u2014 White Beach"',
    'alt="Discovery Samal \u2014 Samal Island Resort"',
  ],
  [
    'alt="Discovery Samal â€" White Beach"',
    'alt="Discovery Samal \u2014 Samal Island Resort"',
  ],
  [
    '<span className="italic text-[#008c8c]">White Beach</span>',
    '<span className="italic text-[#008c8c]">Samal Island</span>',
  ],
  [
    '"Contact Discovery Samal Resort \u00b7 Luxury Beachfront Resort"',
    '"Contact Discovery Samal Resort \u00b7 Luxury Island Resort"',
  ],
  [
    '"Contact Discovery Samal Resort Â· Luxury Beachfront Resort"',
    '"Contact Discovery Samal Resort \u00b7 Luxury Island Resort"',
  ],
]);

// Offer.jsx
fix("frontend/src/pages/Offer.jsx", [
  ["island moments along White Beach.", "island moments on Samal Island."],
]);

// Rooms.jsx
fix("frontend/src/pages/Rooms.jsx", [
  ["over White Beach. Every room at", "over the Davao Gulf. Every room at"],
]);

// resortInclusions.js
fix("frontend/src/lib/resortInclusions.js", [
  [
    '"Roundtrip Caticlan Airport transfer"',
    '"Roundtrip Davao Airport transfer"',
  ],
  [
    '"Roundtrip transfers from Caticlan Airport."',
    '"Roundtrip transfers from Francisco Bangoy International Airport, Davao City."',
  ],
  [
    '"Steps from White Beach, Station 3."',
    '"Direct beachfront access on Samal Island."',
  ],
  [
    '"Steps from White Beach, Station 3."',
    '"Direct beachfront access on Samal Island."',
  ],
]);

// RoomDetails.jsx
fix("frontend/src/pages/RoomDetails.jsx", [
  [
    '"https://www.thunderbird-asia.com/wp-content/uploads/2017/12/DSC0008.jpg"',
    '"https://image-tc.galaxy.tf/wijpeg-9g0c8e4jia8i8dw5hv5xd3r05/dss-website-banner-home-page-2.jpg"',
  ],
]);

console.log("\nAll done.");
