/**
 * Seeds a 50% OFF discount that applies to all rooms.
 * Safe to re-run — skips if a discount named "50% Summer Promo" already exists.
 *
 * Usage: node backend/scripts/seedDiscount.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Discount = require("../models/Discount");
const connectDB = require("../config/db");

const DISCOUNT = {
  name: "50% Summer Promo",
  type: "percentage",
  value: 50,
  appliesTo: "all",
  startDate: new Date(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  active: true,
  label: "50% OFF",
  minimumNights: 1,
  createdBy: "seed",
};

(async () => {
  await connectDB();

  const existing = await Discount.findOne({ name: DISCOUNT.name });
  if (existing) {
    console.log("Discount already exists:", existing.name, "— skipping.");
    await mongoose.disconnect();
    return;
  }

  const created = await Discount.create(DISCOUNT);
  console.log(
    "✓ Seeded discount:",
    created.name,
    `(${created.value}% OFF, applies to all rooms)`,
  );
  console.log("  Active:", created.active);
  console.log(
    "  Period:",
    created.startDate.toDateString(),
    "→",
    created.endDate.toDateString(),
  );

  await mongoose.disconnect();
})();
