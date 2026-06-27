/**
 * Restyle all admin pages from charcoal/olive/forest palette
 * to the AdminLayout brown/orange palette (#5a230e / #d48500 / #1a0a04 / #faf0e1)
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../frontend/src");

const files = [
  "pages/admin/AdminDiscounts.jsx",
  "pages/admin/ManageRooms.jsx",
  "pages/admin/ViewBookings.jsx",
  "pages/admin/PendingPayments.jsx",
  "pages/admin/PaymentSettingsPage.jsx",
  "pages/admin/SocialManager.jsx",
  "components/admin/DiscountFormModal.jsx",
];

function restyle(content) {
  let c = content;

  // ── 1. inputClass string (appears as a variable in several files) ──
  c = c.replace(
    /border-charcoal\/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-olive transition-colors/g,
    "border-[#5a230e]/20 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#d48500] transition-colors",
  );

  // ── 2. Compound button classes (must run BEFORE individual replacements) ──

  // Add / Create / Search primary action buttons: gold on dark text
  c = c.replace(
    /\bbg-olive\b( [^\n"]*?)\btext-white\b/g,
    "bg-[#d48500]$1text-[#1a0a04]",
  );
  c = c.replace(
    /\btext-white\b( [^\n"]*?)\bbg-olive\b/g,
    "text-[#1a0a04]$1bg-[#d48500]",
  );

  // Active status filter  (bg-charcoal text-white) → dark brown
  c = c.replace(
    /\bbg-charcoal\b( [^\n"]*?)\btext-white\b/g,
    "bg-[#5a230e]$1text-[#faf0e1]",
  );

  // Confirm / Save / Download buttons (bg-forest text-white) → brown
  c = c.replace(
    /\bbg-forest\b( [^\n"]*?)\btext-white\b/g,
    "bg-[#5a230e]$1text-[#faf0e1]",
  );
  c = c.replace(
    /\btext-white\b( [^\n"]*?)\bbg-forest\b/g,
    "text-[#faf0e1]$1bg-[#5a230e]",
  );

  // ── 3. Individual class replacements ──

  // charcoal text
  c = c.replace(/\btext-charcoal\b(?![-\/])/g, "text-[#5a230e]");
  c = c.replace(/\btext-charcoal\/(\d+)\b/g, "text-[#5a230e]/$1");

  // charcoal border
  c = c.replace(/\bborder-charcoal\b(?![-\/])/g, "border-[#5a230e]");
  c = c.replace(/\bborder-charcoal\/(\d+)\b/g, "border-[#5a230e]/$1");

  // charcoal bg
  c = c.replace(/\bbg-charcoal\b(?![-\/])/g, "bg-[#5a230e]");
  c = c.replace(/\bbg-charcoal\/\[0\.0([1-9])\]\b/g, "bg-[#5a230e]/[0.0$1]");
  c = c.replace(/\bbg-charcoal\/(\d+)\b/g, "bg-[#5a230e]/$1");

  // hover variants using charcoal
  c = c.replace(/\bhover:text-charcoal\b(?![-\/])/g, "hover:text-[#5a230e]");
  c = c.replace(
    /\bhover:border-charcoal\/(\d+)\b/g,
    "hover:border-[#5a230e]/$1",
  );

  // olive
  c = c.replace(/\btext-olive\b/g, "text-[#d48500]");
  c = c.replace(/\bborder-olive\b/g, "border-[#d48500]");
  c = c.replace(/\bborder-b-olive\b/g, "border-b-[#d48500]");
  c = c.replace(/\bfocus:border-olive\b/g, "focus:border-[#d48500]");
  c = c.replace(/\bhover:bg-olive\b/g, "hover:bg-[#af4c0f]");
  c = c.replace(/\bhover:text-olive\b/g, "hover:text-[#d48500]");
  c = c.replace(/\bbg-olive\b/g, "bg-[#d48500]"); // any remaining
  c = c.replace(/\baccent-olive\b/g, "accent-[#d48500]");

  // forest
  c = c.replace(/\btext-forest\b/g, "text-[#d48500]");
  c = c.replace(/\bborder-forest\b/g, "border-[#d48500]");
  c = c.replace(/\bbg-forest-dark\b/g, "bg-[#1a0a04]");
  c = c.replace(/\bhover:bg-forest-dark\b/g, "hover:bg-[#1a0a04]");
  c = c.replace(/\bbg-forest\/(\d+)\b/g, "bg-[#5a230e]/$1");
  c = c.replace(/\bhover:bg-forest\/(\d+)\b/g, "hover:bg-[#5a230e]/$1");
  c = c.replace(/\bbg-forest\b(?![-\/])/g, "bg-[#5a230e]"); // any remaining
  c = c.replace(/\bhover:bg-forest\b(?![-\/])/g, "hover:bg-[#1a0a04]");

  // ── 4. DiscountFormModal gray classes ──
  c = c.replace(/\btext-gray-700\b/g, "text-[#5a230e]");
  c = c.replace(/\btext-gray-600\b/g, "text-[#5a230e]/70");
  c = c.replace(/\btext-gray-400\b/g, "text-[#5a230e]/40");
  c = c.replace(/\bborder-gray-300\b/g, "border-[#5a230e]/20");
  c = c.replace(/\bborder-gray-200\b/g, "border-[#5a230e]/15");
  c = c.replace(/\bhover:bg-gray-50\b/g, "hover:bg-[#faf0e1]/50");
  c = c.replace(/\bbg-gray-50\b/g, "bg-[#faf0e1]");

  return c;
}

let changed = 0;
for (const f of files) {
  const fp = path.join(root, f);
  if (!fs.existsSync(fp)) {
    console.warn(`  SKIP (not found): ${f}`);
    continue;
  }
  const before = fs.readFileSync(fp, "utf8");
  const after = restyle(before);
  if (after !== before) {
    fs.writeFileSync(fp, after, "utf8");
    console.log(`  ✓ Updated: ${f}`);
    changed++;
  } else {
    console.log(`  — No changes: ${f}`);
  }
}
console.log(`\nDone. ${changed} file(s) updated.`);
