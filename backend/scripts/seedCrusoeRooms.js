/**
 * Seed script: Discovery Samal Resort Rooms
 *
 * Reads local images from frontend/src/assets/rooms/<Room Name>/
 * Uploads each image to Cloudinary, then upserts the room in MongoDB.
 *
 * Usage:
 *   node backend/scripts/seedCrusoeRooms.js
 *
 * Options:
 *   --dry-run     Print rooms without touching DB or Cloudinary
 *   --skip-images Skip Cloudinary upload (re-use existing URLs or empty [])
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const Room = require("../models/Room");
const connectDB = require("../config/db");

const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_IMAGES = process.argv.includes("--skip-images");

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Path to local room images ─────────────────────────────────────────────────
const ROOMS_ASSETS = path.resolve(__dirname, "../../frontend/src/assets/rooms");

// ── Shared inclusions for every room ─────────────────────────────────────────
const INCLUSIONS = [
  "Buffet Breakfast, Lunch & Dinner",
  "Aquaria Water Park Access",
  "Beach Access",
  "Use of Resort Amenities",
  "Complimentary Fitness Center Access",
  "Free Parking & WiFi",
  "Friendly On-Site Assistance for a Comfortable Stay",
  "Water Activities",
];

// ── Room definitions ──────────────────────────────────────────────────────────
// `folderName` must match the exact directory name inside assets/rooms/
const ROOMS = [
  {
    name: "Cocoon Pod",
    folderName: "Cocoon Pod",
    slug: "cocoon-pod",
    category: "Standard",
    description:
      "A cozy, futuristic Cocoon Pod designed for up to 2 guests seeking a unique beach retreat. Compact yet comfortable with all modern amenities and full resort access. FREE: 1 child below 6 years old.",
    maxGuests: 2,
    occupancy: 2,
    pricePerNight: 5000,
    bedType: "1 Queen Bed",
    size: "20 sqm",
    note: "FREE: 1 child below 6 years old",
  },
  {
    name: "Apollo Aeropods",
    folderName: "Apollo Aeropods",
    slug: "apollo-aeropods",
    category: "Standard",
    description:
      "Step into the future with the Apollo Aeropod — a sleek space-inspired capsule accommodation with panoramic windows, smart lighting, and a private outdoor deck overlooking the resort. Fits up to 4 guests.",
    maxGuests: 4,
    occupancy: 4,
    pricePerNight: 6200,
    bedType: "2 Queen Beds",
    size: "30 sqm",
  },
  {
    name: "Cupola",
    folderName: null, // no local images available
    slug: "cupola",
    category: "Standard",
    description:
      "The Cupola is a charming dome-style cabin with distinctive circular architecture, airy interiors, and vibrant accents. Perfect for families of up to 5 looking for a playful and memorable beach stay.",
    maxGuests: 5,
    occupancy: 5,
    pricePerNight: 7300,
    bedType: "1 King Bed + Bunk Bed",
    size: "35 sqm",
  },
  {
    name: "Beachfront Cabin",
    folderName: "Beachfront Cabin",
    slug: "beachfront-cabin",
    category: "Standard",
    description:
      "Wake up steps from the shore in the Beachfront Cabin — a natural bamboo and timber cabin with direct beach access, floor-to-ceiling glass doors, and serene ocean views for up to 6 guests.",
    maxGuests: 6,
    occupancy: 6,
    pricePerNight: 8500,
    bedType: "2 Queen Beds",
    size: "45 sqm",
  },
  {
    name: "Beach Suite",
    folderName: "Beach Suite",
    slug: "beach-suite",
    category: "Premium",
    description:
      "The Beach Suite offers premium beachside living with a spacious layout, luxurious finishes, soaking tub, and a private terrace. Ideal for large families or group celebrations of 8 to 10 guests.",
    maxGuests: 10,
    occupancy: 8,
    pricePerNight: 10800,
    bedType: "2 King Beds + Sofa Beds",
    size: "70 sqm",
  },
  {
    name: "Private Villa",
    folderName: "Private Villa",
    slug: "private-villa",
    category: "Premium",
    description:
      "Experience resort living at its finest in the Private Villa — a multi-room villa with a fully equipped living area, tropical garden, and premium furnishings for 12 to 14 guests.",
    maxGuests: 14,
    occupancy: 12,
    pricePerNight: 15000,
    bedType: "3 King Beds + Extra Beds",
    size: "120 sqm",
  },
  {
    name: "Luxury Pool Villas",
    folderName: "Luxury pool villas",
    slug: "luxury-pool-villas",
    category: "Luxury",
    description:
      "An expansive luxury pool villa with a private infinity pool, open-plan living, vaulted ceilings, and lush tropical surroundings for up to 20 guests. The ultimate group getaway at Discovery Samal Resort.",
    maxGuests: 20,
    occupancy: 20,
    pricePerNight: 20000,
    bedType: "4 King Beds + Extra Beds",
    size: "200 sqm",
  },
  {
    name: "Luxury Couples",
    folderName: "Luxury Couples",
    slug: "luxury-couples",
    category: "Luxury",
    description:
      "Designed for intimate grand celebrations, the Luxury Couples villa features multiple bedrooms, a private pool, outdoor dining, and butler service for up to 15 guests — the crown jewel of Discovery Samal Resort.",
    maxGuests: 15,
    occupancy: 15,
    pricePerNight: 25000,
    bedType: "3 King Beds + Premium Suites",
    size: "250 sqm",
  },
];

// ── Upload all images in a folder to Cloudinary ───────────────────────────────
async function uploadRoomImages(folderName, slug) {
  if (SKIP_IMAGES || !folderName) {
    console.log(`  ⏭  Skipping images for "${folderName || "none"}"`);
    return [];
  }

  const folderPath = path.join(ROOMS_ASSETS, folderName);
  if (!fs.existsSync(folderPath)) {
    console.warn(`  ⚠  Folder not found: ${folderPath}`);
    return [];
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  if (files.length === 0) {
    console.warn(`  ⚠  No image files found in: ${folderPath}`);
    return [];
  }

  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(folderPath, files[i]);
    const publicId = `discoverysamal-resort/rooms/${slug}/${slug}-${i + 1}`;
    try {
      console.log(`  📤 Uploading ${files[i]} → ${publicId}`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "discoverysamal-resort/rooms",
        public_id: `${slug}/${slug}-${i + 1}`,
        resource_type: "image",
        overwrite: true,
      });
      urls.push(result.secure_url);
    } catch (err) {
      console.error(`  ❌ Failed to upload ${files[i]}:`, err.message);
    }
  }

  return urls;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  if (DRY_RUN) {
    console.log("\n🔍 DRY RUN — no DB or Cloudinary changes will be made.\n");
  }

  if (!DRY_RUN) {
    await connectDB();
  }

  console.log(`\n🌴 Seeding ${ROOMS.length} rooms...\n`);

  for (const room of ROOMS) {
    console.log(`\n── ${room.name} ──`);

    let images = [];
    if (!DRY_RUN) {
      images = await uploadRoomImages(room.folderName, room.slug);
      console.log(`  ✅ ${images.length} image(s) uploaded`);
    } else {
      const folderPath = room.folderName
        ? path.join(ROOMS_ASSETS, room.folderName)
        : null;
      const count =
        folderPath && fs.existsSync(folderPath)
          ? fs
              .readdirSync(folderPath)
              .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)).length
          : 0;
      console.log(`  📁 ${count} local image(s) found`);
    }

    const doc = {
      name: room.name,
      slug: room.slug,
      category: room.category,
      description: room.description,
      maxGuests: room.maxGuests,
      occupancy: room.occupancy,
      capacity: room.maxGuests,
      pricePerNight: room.pricePerNight,
      bedType: room.bedType,
      size: room.size,
      features: [...INCLUSIONS],
      images,
      available: true,
      ...(room.note ? { note: room.note } : {}),
    };

    if (DRY_RUN) {
      console.log(
        `  📋 Would upsert:`,
        JSON.stringify({ ...doc, images: `[${images.length} urls]` }, null, 2),
      );
      continue;
    }

    try {
      const result = await Room.findOneAndUpdate({ slug: room.slug }, doc, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(`  ✅ Saved: ${result.name} (${result._id})`);
    } catch (err) {
      console.error(`  ❌ DB error for ${room.name}:`, err.message);
    }
  }

  if (!DRY_RUN) {
    console.log("\n✅ Seeding complete.\n");
    await mongoose.disconnect();
  } else {
    console.log("\n✅ Dry run complete.\n");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
