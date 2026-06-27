/**
 * Seeds rooms from the project root `rooms.json` (Discovery Samal Resort data).
 * Maps the scraped schema (bestRate/publishedRate, goodFor/maxOccupancy,
 * highlights, "Beach Villas"/"Pool Villas"/etc.) into the backend Room model.
 *
 * Idempotent: uses upsert by slug.
 *
 * Usage: node backend/scripts/seedThunderbirdRooms.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Room = require("../models/Room");
const connectDB = require("../config/db");

const ROOMS_JSON = path.resolve(__dirname, "../../rooms.json");

// Map source categories to Room model enum values.
const CATEGORY_MAP = {
  "Beach Villas": "Villa",
  "Pool Villas": "Villa",
  "Plunge Pool Villas": "Villa",
  "Hotel Room": "Premium",
  Standard: "Standard",
  Classic: "Standard",
  Premier: "Premier",
  Deluxe: "Deluxe",
  Family: "Family",
  Villa: "Villa",
  Luxury: "Villa",
};

function mapCategory(category) {
  return CATEGORY_MAP[category] || "Villa";
}

function buildBedType(bedConfiguration) {
  if (!Array.isArray(bedConfiguration) || bedConfiguration.length === 0) {
    return undefined;
  }
  return bedConfiguration[0];
}

function buildSize(room) {
  if (!room.size) return undefined;
  return `${room.size} ${room.sizeUnit || "sqm"}`;
}

function normalizeRoom(room, globalInclusions = []) {
  const description =
    room.longDescription || room.shortDescription || room.tagline || room.name;

  const features = [
    ...(Array.isArray(room.highlights) ? room.highlights : []),
    ...(Array.isArray(room.amenities) ? room.amenities : []),
    ...(Array.isArray(globalInclusions) ? globalInclusions : []),
  ]
    .filter(Boolean)
    .map((f) => String(f).trim());

  // Deduplicate while preserving order.
  const seen = new Set();
  const dedupedFeatures = features.filter((f) => {
    const key = f.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const pricePerNight = Number(room.publishedRate || room.bestRate || 0);
  const bestRate = Number(room.bestRate || 0);
  const hasPromo = bestRate > 0 && bestRate < pricePerNight;

  return {
    name: String(room.name || "").trim(),
    slug: room.slug ? String(room.slug).trim() : undefined,
    description: String(description || "").trim(),
    capacity: Number(room.goodFor || 1),
    occupancy: Number(room.maxOccupancy || room.goodFor || 1),
    maxGuests: Number(room.maxOccupancy || room.goodFor || 1),
    minGuests: 1,
    size: buildSize(room),
    bedType: buildBedType(room.bedConfiguration),
    pricePerNight,
    discountPrice: hasPromo ? bestRate : undefined,
    discountLabel: hasPromo ? "Best Rate" : undefined,
    features: dedupedFeatures,
    images: Array.isArray(room.images)
      ? room.images.filter(Boolean).map((i) => String(i).trim())
      : [],
    available: true,
    category: mapCategory(room.category),
    note: room.tagline ? String(room.tagline).trim() : undefined,
  };
}

(async () => {
  if (!fs.existsSync(ROOMS_JSON)) {
    console.error(`rooms.json not found at: ${ROOMS_JSON}`);
    process.exit(1);
  }

  const parsed = JSON.parse(fs.readFileSync(ROOMS_JSON, "utf8"));
  const rooms = Array.isArray(parsed) ? parsed : parsed.rooms;
  const globalInclusions =
    parsed && parsed._meta && Array.isArray(parsed._meta.globalInclusions)
      ? parsed._meta.globalInclusions
      : [];

  if (!Array.isArray(rooms) || rooms.length === 0) {
    console.error("rooms.json must contain a non-empty `rooms` array.");
    process.exit(1);
  }

  await connectDB();

  const wiped = await Room.deleteMany({});
  console.log(`🗑  Deleted ${wiped.deletedCount} existing room(s)\n`);

  let upserted = 0;
  for (const raw of rooms) {
    const payload = normalizeRoom(raw, globalInclusions);
    if (!payload.slug) {
      console.warn(`Skipping room without slug: ${payload.name}`);
      continue;
    }

    const saved = await Room.findOneAndUpdate(
      { slug: payload.slug },
      { $set: payload },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    upserted += 1;
    console.log(
      `✓ ${saved.name} — ₱${saved.pricePerNight.toLocaleString()}` +
        (saved.discountPrice
          ? ` (promo ₱${saved.discountPrice.toLocaleString()})`
          : ""),
    );
  }

  console.log(`\nSeeded ${upserted} room(s) from rooms.json`);
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
