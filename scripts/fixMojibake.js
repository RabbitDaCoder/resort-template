const fs = require("fs");
const path = require("path");

const files = [
  "frontend/src/pages/Activities.jsx",
  "frontend/src/pages/About.jsx",
  "frontend/src/pages/Contact.jsx",
  "frontend/src/pages/Offer.jsx",
  "frontend/src/data/contactData.js",
  "frontend/src/sections/home/homeContent.js",
];

const root = path.join(__dirname, "..");

files.forEach((f) => {
  const full = path.join(root, f);
  let c = fs.readFileSync(full, "utf8");
  const before = c;
  // Fix double-encoded middle dot: Ã‚Â· → ·
  c = c.replace(/\u00c3\u0082\u00c2\u00b7/g, "\u00B7");
  // Fix single-encoded mojibake middle dot: Â· → ·
  c = c.replace(/\u00c2\u00b7/g, "\u00B7");
  // Fix em dash mojibake: â€" → —
  c = c.replace(/\u00e2\u0080\u0093/g, "\u2013");
  c = c.replace(/\u00e2\u0080\u0094/g, "\u2014");
  if (c !== before) {
    fs.writeFileSync(full, c, "utf8");
    console.log("Fixed: " + f);
  } else {
    console.log("No change: " + f);
  }
});

console.log("Done");
