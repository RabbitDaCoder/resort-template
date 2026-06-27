require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

const connectDB = require("../config/db");
const Room = require("../models/Room");
const Discount = require("../models/Discount");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JSON_PATH = path.resolve(__dirname, "../../accommodation-scrape.json");
const LOCAL_IMAGE_DIRS = {
  "seaview-villa": path.resolve(
    __dirname,
    "../../frontend/src/assets/rooms/Seaview Villa",
  ),
  "luxury-suite-seaview": path.resolve(
    __dirname,
    "../../frontend/src/assets/rooms/Luxury Suite",
  ),
};

function normalizeCategory(name) {
  const lower = String(name || "").toLowerCase();
  if (lower.includes("deluxe")) return "Deluxe";
  if (
    lower.includes("villa") ||
    lower.includes("suite") ||
    lower.includes("casitas")
  )
    return "Villa";
  return "Premier";
}

function parseMaxGuests(room) {
  if (Number.isFinite(room.maxAdults)) return Number(room.maxAdults);
  if (typeof room.guestRange === "string") {
    const nums = room.guestRange.match(/\d+/g);
    if (nums && nums.length) {
      return Number(nums[nums.length - 1]);
    }
  }
  return 2;
}

function getSizeValue(room) {
  if (room.roomSizeSqm) return `${room.roomSizeSqm} sqm`;
  if (room.configuration) return String(room.configuration);
  return undefined;
}

function getLocalImageFiles(slug) {
  const dir = LOCAL_IMAGE_DIRS[slug];
  if (!dir || !fs.existsSync(dir)) return [];

  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  return fs
    .readdirSync(dir)
    .filter((file) => allowed.has(path.extname(file).toLowerCase()))
    .map((file) => path.join(dir, file));
}

async function uploadLocalImages(slug) {
  const files = getLocalImageFiles(slug);
  const uploaded = [];

  for (let i = 0; i < files.length; i += 1) {
    const result = await cloudinary.uploader.upload(files[i], {
      folder: "discoverysamal-resort/rooms",
      public_id: `${slug}-${i + 1}`,
      overwrite: true,
      resource_type: "image",
    });
    uploaded.push(result.secure_url);
  }

  return uploaded;
}

function buildRoomPayload(room, images, globalInclusions) {
  const originalPrice = Number(room?.pricing?.originalPrice || 0);
  const promoPrice = Number(room?.pricing?.promoPrice || 0);
  const maxGuests = parseMaxGuests(room);

  return {
    name: room.name,
    slug: room.slug,
    description: room.description,
    occupancy: maxGuests,
    maxGuests,
    size: getSizeValue(room),
    bedType: room.bedType,
    pricePerNight: originalPrice,
    discountPrice:
      promoPrice > 0 && promoPrice < originalPrice ? promoPrice : undefined,
    discountLabel: room?.pricing?.discountLabel || undefined,
    features: Array.isArray(globalInclusions) ? globalInclusions : [],
    images,
    available: true,
    category: normalizeCategory(room.name),
  };
}

async function upsertDiscount(roomDoc, roomSource) {
  const percentage = Number(roomSource?.pricing?.discountPercent || 0);
  if (!percentage) return null;

  const startDate = new Date();
  const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const name = `${roomDoc.name} ${percentage}% OFF`;

  const payload = {
    name,
    type: "percentage",
    value: percentage,
    appliesTo: "specific_rooms",
    rooms: [roomDoc._id],
    categories: [],
    startDate,
    endDate,
    active: true,
    label: roomSource?.pricing?.discountLabel || `${percentage}% OFF`,
    minimumNights: 1,
    createdBy: "seed",
  };

  return Discount.findOneAndUpdate({ name, createdBy: "seed" }, payload, {
    returnDocument: "after",
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
}

async function run() {
  if (!fs.existsSync(JSON_PATH)) {
    throw new Error(`Accommodation JSON not found: ${JSON_PATH}`);
  }

  const source = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const rooms = Array.isArray(source.rooms) ? source.rooms : [];
  if (!rooms.length)
    throw new Error("No rooms found in accommodation-scrape.json");

  await connectDB();

  const summary = [];

  for (const room of rooms) {
    let images = Array.isArray(room.photoUrls)
      ? room.photoUrls.filter(Boolean)
      : [];
    if (images.length === 0) {
      images = await uploadLocalImages(room.slug);
    }

    const roomPayload = buildRoomPayload(room, images, source.globalInclusions);
    const savedRoom = await Room.findOneAndUpdate(
      { slug: room.slug },
      roomPayload,
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    const savedDiscount = await upsertDiscount(savedRoom, room);

    summary.push({
      slug: savedRoom.slug,
      images: Array.isArray(savedRoom.images) ? savedRoom.images.length : 0,
      price: savedRoom.pricePerNight,
      promo: savedRoom.discountPrice || null,
      discountRule: savedDiscount ? savedDiscount.name : null,
    });
  }

  console.log(
    JSON.stringify({ seededRooms: summary.length, rooms: summary }, null, 2),
  );

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error.message || error);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
