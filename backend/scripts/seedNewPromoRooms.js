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

const GLOBAL_FEATURES = [
  "Breakfast, Lunch & Dinner (Full Buffet Meals)",
  "Free Airport Transfer from Mactan Airport",
  "Swimming Pool, Cabana, Beachfront & Pavilion Access",
  "Welcome Drinks Upon Arrival",
  "Parking Space",
  "Free WiFi",
  "Pet Friendly Accommodation",
];

const ROOMS_TO_SEED = [
  {
    name: "Seaview Villa",
    slug: "seaview-villa",
    category: "Villa",
    description:
      "Experience elevated coastal luxury in the Seaview Villa, designed for families and groups seeking spacious comfort by the sea. Featuring two beautifully designed rooms with premium bedding, panoramic ocean views, and modern tropical interiors, this villa creates the perfect setting for unforgettable beachside memories.",
    occupancy: 10,
    maxGuests: 10,
    size: "2 Rooms",
    bedType: "2 Beds Per Room",
    pricePerNight: 27200,
    discountPrice: 13600,
    discountLabel: "50% OFF",
    imageDir: path.resolve(
      __dirname,
      "../../frontend/src/assets/rooms/Seaview Villa",
    ),
  },
  {
    name: "Luxury Suite Seaview",
    slug: "luxury-suite-seaview",
    category: "Villa",
    description:
      "The Luxury Suite Seaview is crafted for large families, corporate retreats, and group vacations seeking a refined tropical escape. With expansive living spaces, multiple luxurious bedrooms, elegant interiors, and breathtaking views of the ocean, this suite delivers a premium private resort experience.",
    occupancy: 20,
    maxGuests: 20,
    size: "5 Rooms",
    bedType: "2 Beds Per Room",
    pricePerNight: 44000,
    discountPrice: 22000,
    discountLabel: "50% OFF",
    imageDir: path.resolve(
      __dirname,
      "../../frontend/src/assets/rooms/Luxury Suite",
    ),
  },
];

function getImageFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Image folder not found: ${dirPath}`);
  }

  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  return fs
    .readdirSync(dirPath)
    .filter((file) => allowed.has(path.extname(file).toLowerCase()))
    .map((file) => path.join(dirPath, file));
}

async function uploadLocalImage(filePath, slug, index) {
  const publicId = `${slug}-${index + 1}`;
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "discoverysamal-resort/rooms",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  return result.secure_url;
}

async function upsertDiscountForRoom(roomId, roomName) {
  const startDate = new Date();
  const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const payload = {
    name: `${roomName} 50% OFF`,
    type: "percentage",
    value: 50,
    appliesTo: "specific_rooms",
    rooms: [roomId],
    categories: [],
    startDate,
    endDate,
    active: true,
    label: "50% OFF",
    minimumNights: 1,
    createdBy: "seed",
  };

  await Discount.findOneAndUpdate(
    { name: payload.name, createdBy: "seed" },
    payload,
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );
}

async function run() {
  await connectDB();

  for (const room of ROOMS_TO_SEED) {
    const files = getImageFiles(room.imageDir);
    if (files.length === 0) {
      throw new Error(`No image files found in: ${room.imageDir}`);
    }

    console.log(`Uploading ${files.length} images for ${room.name}...`);
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i += 1) {
      const uploaded = await uploadLocalImage(files[i], room.slug, i);
      uploadedUrls.push(uploaded);
    }

    const payload = {
      name: room.name,
      slug: room.slug,
      category: room.category,
      description: room.description,
      occupancy: room.occupancy,
      maxGuests: room.maxGuests,
      size: room.size,
      bedType: room.bedType,
      pricePerNight: room.pricePerNight,
      discountPrice: room.discountPrice,
      discountLabel: room.discountLabel,
      features: GLOBAL_FEATURES,
      images: uploadedUrls,
      available: true,
    };

    const savedRoom = await Room.findOneAndUpdate(
      { slug: room.slug },
      payload,
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    await upsertDiscountForRoom(savedRoom._id, room.name);

    console.log(
      `Seeded room: ${savedRoom.name} | images: ${uploadedUrls.length} | price: P${savedRoom.pricePerNight.toLocaleString()} | promo: P${savedRoom.discountPrice.toLocaleString()}`,
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch(async (error) => {
  console.error("Seed failed:", error.message || error);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
