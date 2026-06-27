/**
 * Restyle admin/login from brown-orange palette to site teal palette.
 *
 * Old → New
 * #5a230e (dark brown text)     → #111111
 * #1a0a04 (sidebar / deep bg)   → #111111
 * #d48500 (orange accent)       → #008c8c
 * #af4c0f (dark orange)         → #006d6d
 * #faf0e1 (cream light)         → #f7f7f5
 * #fff9ee (ivory page bg)       → #f7f7f5
 * rgba versions                 → matching rgba
 */

const fs = require("fs");
const path = require("path");

const BASE = path.resolve(__dirname, "../frontend/src");

const FILES = [
  "layouts/AdminLayout.jsx",
  "pages/admin/Dashboard.jsx",
  "pages/admin/ManageRooms.jsx",
  "pages/admin/AdminDiscounts.jsx",
  "pages/admin/ViewBookings.jsx",
  "pages/admin/PendingPayments.jsx",
  "pages/admin/PaymentSettingsPage.jsx",
  "pages/admin/SocialManager.jsx",
  "components/admin/DiscountFormModal.jsx",
  "pages/Login.jsx",
];

const REPLACEMENTS = [
  // ── rgba versions (must come before hex so partial matches don't interfere) ──
  [/rgba\(212,\s*133,\s*0,/g,  "rgba(0,140,140,"],
  [/rgba\(175,\s*76,\s*15,/g,  "rgba(0,109,109,"],
  [/rgba\(90,\s*35,\s*14,/g,   "rgba(17,17,17,"],
  [/rgba\(26,\s*10,\s*4,/g,    "rgba(17,17,17,"],

  // ── Gradient via: dark brown used as mid-stop → teal dark mid-stop ──
  // e.g. from-[#1a0a04] via-[#5a230e] to-[#1a0a04]
  [/via-\[#5a230e\]/g, "via-[#0a3a3a]"],

  // ── Inline style gradient strings ──
  [/#5a230e 0%, transparent/g,  "#0a3a3a 0%, transparent"],

  // ── Hex colours (order matters: longest/most-specific first) ──
  [/#5a230e/gi, "#111111"],
  [/#1a0a04/gi, "#111111"],
  [/#d48500/gi, "#008c8c"],
  [/#af4c0f/gi, "#006d6d"],
  [/#faf0e1/gi, "#f7f7f5"],
  [/#fff9ee/gi, "#f7f7f5"],
];

// Special case: login page background radial gradient needs distinct colours
const LOGIN_BG_OLD = '"radial-gradient(circle at 30% 20%, #0a3a3a 0%, transparent 60%), radial-gradient(circle at 80% 80%, #008c8c 0%, transparent 60%)"';
// (will already be correct after REPLACEMENTS run above)

let changed = 0;

for (const rel of FILES) {
  const fp = path.join(BASE, rel);
  if (!fs.existsSync(fp)) { console.log(`SKIP (not found): ${rel}`); continue; }

  let src = fs.readFileSync(fp, "utf8");
  let out = src;

  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }

  if (out !== src) {
    fs.writeFileSync(fp, out, "utf8");
    console.log(`✓  Updated: ${rel}`);
    changed++;
  } else {
    console.log(`–  No change: ${rel}`);
  }
}

console.log(`\nDone. ${changed} file(s) updated.`);
