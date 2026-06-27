/**
 * Fix all issues in email-service/api/send.js:
 *  1. Peso sign in formatCurrency (? → &#x20B1;)
 *  2. Tagline text
 *  3. Old green palette → teal palette
 *  4. Footer: RESORT_LANDLINE/RESORT_MOBILE → RESORT_PHONE
 *  5. Subject separators (? → —)
 *  6. Inline body separators (? Under Review / ? Confirmed → ·)
 *  7. Facebook button text color fix (color:#111111 → color:#ffffff on teal bg)
 */
const fs = require("fs");
const path = require("path");

const BASE = path.resolve(__dirname, "..");
const SEND = path.join(BASE, "email-service/api/send.js");
const ENV = path.join(BASE, "email-service/.env");

// ── send.js ──────────────────────────────────────────────────────────────────
let s = fs.readFileSync(SEND, "utf8");

// 1. Peso sign in formatCurrency
s = s.replace(
  '`?${Number(amount || 0).toLocaleString("en-PH")}`',
  '`&#x20B1;${Number(amount || 0).toLocaleString("en-PH")}`',
);

// 2. Tagline
s = s.replace(
  "Your ultimate beachside playground",
  "Your Island Discovery in Samal",
);

// 3. Color palette — global (order: longest/most-specific first)
s = s.replace(/#2C4A2E/g, "#111111");
s = s.replace(/#6B7C3E/g, "#008c8c");
s = s.replace(/#C4A882/g, "#008c8c");
s = s.replace(/#F5F4F0/g, "#f7f7f5");
s = s.replace(/color: #2c2a26/g, "color: #1a1a1a");
s = s.replace(/color: #2c2a26;/g, "color: #1a1a1a;");

// 4. Facebook button had color:#111111 on teal bg — needs to be white
s = s.replace(
  "background:#008c8c; color:#111111; padding:12px 24px;",
  "background:#008c8c; color:#ffffff; padding:12px 24px;",
);

// 5. Footer: replace RESORT_LANDLINE / RESORT_MOBILE with RESORT_PHONE
s = s.replace(
  `      \${optionalEnv(process.env.RESORT_LANDLINE) ? \`<p>Landline: \${optionalEnv(process.env.RESORT_LANDLINE)}</p>\` : ""}
      \${optionalEnv(process.env.RESORT_MOBILE) ? \`<p>Mobile: \${optionalEnv(process.env.RESORT_MOBILE)}</p>\` : ""}`,
  `      \${optionalEnv(process.env.RESORT_PHONE) ? \`<p>\${optionalEnv(process.env.RESORT_PHONE)}</p>\` : ""}`,
);

// 6. Subject separators (literal ? → em dash)
const subjectFixes = [
  [
    "Booking Received ? ${b.bookingRef}",
    "Booking Received \u2014 ${b.bookingRef}",
  ],
  [
    "New Booking ? ${b.bookingRef} ? ${b.guestName}",
    "New Booking \u2014 ${b.bookingRef} \u00b7 ${b.guestName}",
  ],
  [
    "Final Reminder: Your Booking is Still Unpaid ? ${b.bookingRef}",
    "Final Reminder: Booking Still Unpaid \u2014 ${b.bookingRef}",
  ],
  [
    "Reminder: Complete Your Payment ? ${b.bookingRef}",
    "Reminder: Complete Your Payment \u2014 ${b.bookingRef}",
  ],
  [
    "Payment Received ? ${b.bookingRef}",
    "Payment Received \u2014 ${b.bookingRef}",
  ],
  [
    "Payment Proof ? ${b.bookingRef} ? ${b.guestName}",
    "Payment Proof \u2014 ${b.bookingRef} \u00b7 ${b.guestName}",
  ],
  ["Balance Due ? ${b.bookingRef}", "Balance Due \u2014 ${b.bookingRef}"],
  [
    "Booking Cancelled ? ${b.bookingRef}",
    "Booking Cancelled \u2014 ${b.bookingRef}",
  ],
  [
    "Reservation Confirmed ? ${b.bookingRef}",
    "Reservation Confirmed \u2014 ${b.bookingRef}",
  ],
  [
    "First Payment Received ? ${b.bookingRef}",
    "First Payment Received \u2014 ${b.bookingRef}",
  ],
];
for (const [from, to] of subjectFixes) {
  s = s.replace(from, to);
}

// 7. Inline body separators
s = s.replace(
  "${formatCurrency(amountPaid)} ? Under Review",
  "${formatCurrency(amountPaid)} \u00b7 Under Review",
);
s = s.replace(
  "${formatCurrency(installment.firstPaymentAmount || 0)} ? Confirmed",
  "${formatCurrency(installment.firstPaymentAmount || 0)} \u00b7 Confirmed",
);

fs.writeFileSync(SEND, s, "utf8");
console.log("✓  Fixed: email-service/api/send.js");

// ── .env ─────────────────────────────────────────────────────────────────────
let e = fs.readFileSync(ENV, "utf8");
e = e.replace("RESORT_PHONE=+639497979831", "RESORT_PHONE=+639072487086");
e = e.replace(
  "FACEBOOK_PAGE_URL=https://www.facebook.com/share/1EPpEbqx8E/?mibextid=wwXIfr",
  "FACEBOOK_PAGE_URL=https://www.facebook.com/share/1CC3GH2aCQ/?mibextid=wwXIfr",
);
fs.writeFileSync(ENV, e, "utf8");
console.log("✓  Fixed: email-service/.env");
