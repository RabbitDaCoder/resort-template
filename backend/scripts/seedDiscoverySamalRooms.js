/**
 * Seed script — Discovery Samal Resort rooms & villas
 * Usage: node backend/scripts/seedDiscoverySamalRooms.js
 *
 * Uses CDN images directly (no Cloudinary upload needed).
 * WARNING: Clears all existing rooms before inserting.
 */

const mongoose = require("mongoose");
const Room = require("../models/Room");
const roomsData = require("../seed/rooms");
require("dotenv").config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const existing = await Room.countDocuments();
    if (existing > 0) {
      console.log(`Found ${existing} existing room(s). Clearing...`);
      await Room.deleteMany({});
      console.log("Cleared.\n");
    }

    const inserted = await Room.insertMany(roomsData);

    console.log(`Seeded ${inserted.length} rooms successfully:\n`);
    inserted.forEach((r) =>
      console.log(
        `  ✓  ${r.name.padEnd(32)} ${r.category.padEnd(14)} ₱${r.pricePerNight.toLocaleString()}/night`,
      ),
    );

    await mongoose.disconnect();
    console.log("\nDone. Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("\nSeed failed:", err.message);
    process.exit(1);
  }
}

seed();
