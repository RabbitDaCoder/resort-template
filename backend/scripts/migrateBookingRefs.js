/**
 * Migrates booking references from one prefix to another.
 * Defaults: from LLVC- to <PROJECT_ID prefix>-
 * Run: node scripts/migrateBookingRefs.js
 * Dry run: node scripts/migrateBookingRefs.js --dry-run
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");

const isDryRun = process.argv.includes("--dry-run");
const fromPrefixArg = process.argv.find((a) => a.startsWith("--from="));
const toPrefixArg = process.argv.find((a) => a.startsWith("--to="));

function normalizePrefix(value, fallback) {
  const raw = String(value || fallback || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return raw || fallback;
}

const configuredProjectPrefix = normalizePrefix(
  process.env.PROJECT_ID?.split("-")[0],
  "BOOK",
);
const fromPrefix = normalizePrefix(fromPrefixArg?.split("=")[1], "LLVC");
const toPrefix = normalizePrefix(
  toPrefixArg?.split("=")[1],
  configuredProjectPrefix,
);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const bookings = await Booking.find({
    bookingRef: new RegExp(`^${fromPrefix}-`),
  }).select("bookingRef");

  if (bookings.length === 0) {
    console.log(`No ${fromPrefix}- bookings found. Nothing to migrate.`);
    return;
  }

  console.log(
    `Found ${bookings.length} booking(s) to migrate.${isDryRun ? " (DRY RUN)" : ""}`,
  );

  for (const booking of bookings) {
    const oldRef = booking.bookingRef;
    const newRef = oldRef.replace(
      new RegExp(`^${fromPrefix}-`),
      `${toPrefix}-`,
    );
    console.log(`  ${oldRef}  →  ${newRef}`);
    if (!isDryRun) {
      await Booking.updateOne({ _id: booking._id }, { bookingRef: newRef });
    }
  }

  if (!isDryRun) {
    console.log(`\nMigrated ${bookings.length} booking ref(s) successfully.`);
  } else {
    console.log("\nDry run complete. No changes written.");
  }
}

main()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
