/**
 * Doubles every room's pricePerNight (and weekendPrice if set).
 * Run ONCE — the 50% discount will bring the effective price back
 * to the original value (e.g. 3000 → 6000 listed, 3000 after 50% off).
 *
 * Usage: node backend/scripts/doubleRoomPrices.js
 *        node backend/scripts/doubleRoomPrices.js --dry-run
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Room = require("../models/Room");
const connectDB = require("../config/db");

const DRY = process.argv.includes("--dry-run");

(async () => {
  await connectDB();

  const rooms = await Room.find({}).select("name pricePerNight weekendPrice");
  if (rooms.length === 0) {
    console.log("No rooms found.");
    await mongoose.disconnect();
    return;
  }

  console.log(
    `${DRY ? "[DRY RUN] " : ""}Doubling prices for ${rooms.length} room(s):\n`,
  );

  for (const room of rooms) {
    const newPrice = room.pricePerNight * 2;
    const newWeekend = room.weekendPrice ? room.weekendPrice * 2 : undefined;

    console.log(
      `  ${room.name.padEnd(40)} ₱${room.pricePerNight.toLocaleString()} → ₱${newPrice.toLocaleString()}` +
        (newWeekend ? ` (weekend: ₱${newWeekend.toLocaleString()})` : ""),
    );

    if (!DRY) {
      const update = { pricePerNight: newPrice };
      if (newWeekend) update.weekendPrice = newWeekend;
      await Room.findByIdAndUpdate(room._id, { $set: update });
    }
  }

  if (DRY) {
    console.log("\n[DRY RUN] No changes written. Remove --dry-run to apply.");
  } else {
    console.log(
      "\n✓ All room prices doubled. The 50% discount now restores the original effective price.",
    );
  }

  await mongoose.disconnect();
})();
