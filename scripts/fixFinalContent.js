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

// contactData.js - wrong location/airport in FAQ
fix("frontend/src/data/contactData.js", [
  [
    "Weddings, debuts, conferences and milestone gatherings on the shores of White Beach.",
    "Weddings, debuts, conferences and milestone gatherings on the shores of Samal Island, Davao del Norte.",
  ],
  [
    "Yes \u2014 roundtrip hotel van transfers between Caticlan Jetty Port and the resort are included in our beachfront packages. For other arrangements, our concierge can organise private transfers on request.",
    "Yes \u2014 we can arrange roundtrip transfers between Francisco Bangoy International Airport in Davao City and the resort. Our concierge can also organise a private boat transfer from Davao City to Samal Island on request.",
  ],
  [
    "How close is the resort to White Beach?",
    "How do I get to Discovery Samal from Davao City?",
  ],
  [
    "Discovery Samal offers direct frontage to White Beach at Station 3 \u2014 you are steps away from the pristine white sand, with a quieter atmosphere than Stations 1 and 2.",
    "Discovery Samal is located on Samal Island, Island Garden City of Samal. From Davao City, take a short boat ride across the Davao Gulf \u2014 the island is approximately 15\u201320 minutes by ferry from Sasa Wharf in Davao City, making it an incredibly accessible island escape.",
  ],
  // Fix the â€" mojibake that slipped through
  ["\u00e2\u0080\u0094", "\u2014"],
]);

// activitiesData.js - remove Poro Point-era activities (LED roses, tulips, urban lights)
// and update the Spa image path
fix("frontend/src/data/activitiesData.js", [
  // Update spa image path
  [
    'images: ["/activities/wellness/zaphira-spa/article-image2.jpg"]',
    'images: ["https://image-tc.galaxy.tf/wijpeg-e9e3fi5ee3nudxmag9mtxp6bm/aerial-1.jpg"]',
  ],
]);

// Contact.jsx - fix mojibake alt text
fix("frontend/src/pages/Contact.jsx", [
  [
    'alt="Discovery Samal â€" White Beach"',
    'alt="Discovery Samal \u2014 Samal Island Resort"',
  ],
  [
    'alt="Discovery Samal \u00e2\u0080\u0094 White Beach"',
    'alt="Discovery Samal \u2014 Samal Island Resort"',
  ],
]);

console.log("\nAll done.");
