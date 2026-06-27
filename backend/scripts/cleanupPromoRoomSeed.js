require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

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

const ROOM_SLUGS = ["seaview-villa", "luxury-suite-seaview"];
const DISCOUNT_NAMES = [
  "Seaview Villa 50% OFF",
  "Luxury Suite Seaview 50% OFF",
];
const CLOUDINARY_PREFIXES = [
  "discoverysamal-resort/rooms/seaview-villa-",
  "discoverysamal-resort/rooms/luxury-suite-seaview-",
];

async function deleteCloudinaryByPrefix(prefix) {
  const result = await cloudinary.api.delete_resources_by_prefix(prefix, {
    resource_type: "image",
    type: "upload",
  });
  return result;
}

async function run() {
  await connectDB();

  const rooms = await Room.find({ slug: { $in: ROOM_SLUGS } })
    .select("_id name slug images")
    .lean();
  const roomIds = rooms.map((room) => room._id);

  const discountDeleteResult = await Discount.deleteMany({
    $or: [{ name: { $in: DISCOUNT_NAMES } }, { rooms: { $in: roomIds } }],
  });

  const roomDeleteResult = await Room.deleteMany({ slug: { $in: ROOM_SLUGS } });

  const cloudinaryResults = [];
  for (const prefix of CLOUDINARY_PREFIXES) {
    const deleted = await deleteCloudinaryByPrefix(prefix);
    cloudinaryResults.push({ prefix, deleted });
  }

  console.log(
    JSON.stringify(
      {
        removedRoomSlugs: ROOM_SLUGS,
        matchedRoomsBeforeDelete: rooms.map((r) => ({
          slug: r.slug,
          imageCount: Array.isArray(r.images) ? r.images.length : 0,
        })),
        deletedRoomsCount: roomDeleteResult.deletedCount,
        deletedDiscountsCount: discountDeleteResult.deletedCount,
        cloudinaryDeletion: cloudinaryResults,
      },
      null,
      2,
    ),
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
