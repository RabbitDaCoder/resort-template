require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Room = require("../models/Room");
const Discount = require("../models/Discount");
const connectDB = require("../config/db");

function normalizeCategory(category) {
  const value = String(category || "")
    .trim()
    .toLowerCase();
  const categoryMap = {
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
    deluxe: "Deluxe",
    premier: "Premier",
    family: "Family",
    loft: "Loft",
    annex: "Annex",
    villa: "Villa",
    dormitory: "Dormitory",
    cabin: "Cabin",
    presidential: "Presidential",
  };

  return categoryMap[value] || "Standard";
}

function normalizeRoom(room) {
  const validObjectId =
    room.id && /^[0-9a-fA-F]{24}$/.test(String(room.id))
      ? new mongoose.Types.ObjectId(room.id)
      : undefined;
  const description = String(
    room.description ||
      room.longDescription ||
      room.shortDescription ||
      room.tagline ||
      "",
  ).trim();
  const capacity = Number(room.capacity || room.goodFor || room.maxGuests || 1);
  const maxGuests = Number(
    room.maxGuests || room.maxOccupancy || room.capacity || room.goodFor || 1,
  );
  const featuresSource = Array.isArray(room.features)
    ? room.features
    : Array.isArray(room.amenities)
      ? room.amenities
      : [];
  return {
    _id: validObjectId,
    name: String(room.name || "").trim(),
    slug: room.slug ? String(room.slug).trim() : undefined,
    description,
    capacity,
    occupancy: Number(
      room.occupancy || room.maxOccupancy || capacity || maxGuests || 1,
    ),
    minGuests: room.minGuests ? Number(room.minGuests) : undefined,
    size: room.size ? String(room.size).trim() : undefined,
    bedType: room.bedType ? String(room.bedType).trim() : undefined,
    pricePerNight: Number(
      room.pricePerNight || room.publishedRate || room.bestRate || 0,
    ),
    discountPrice:
      room.discountPrice && Number(room.discountPrice) > 0
        ? Number(room.discountPrice)
        : undefined,
    discountLabel: room.discountLabel
      ? String(room.discountLabel).trim()
      : undefined,
    weekendPrice:
      room.weekendPrice && Number(room.weekendPrice) > 0
        ? Number(room.weekendPrice)
        : undefined,
    features: featuresSource
      .filter(Boolean)
      .map((feature) => String(feature).trim()),
    images: Array.isArray(room.images)
      ? room.images.filter(Boolean).map((image) => String(image).trim())
      : [],
    videoUrl: room.videoUrl ? String(room.videoUrl).trim() : undefined,
    videoPoster: room.videoPoster ? String(room.videoPoster).trim() : undefined,
    tagline: room.tagline ? String(room.tagline).trim() : undefined,
    location: room.location ? String(room.location).trim() : undefined,
    intro: room.intro ? String(room.intro).trim() : undefined,
    propertySliderImages: Array.isArray(room.propertySliderImages)
      ? room.propertySliderImages.filter(Boolean).map((s) => String(s).trim())
      : undefined,
    aLaCarteImages: Array.isArray(room.aLaCarteImages)
      ? room.aLaCarteImages.filter(Boolean).map((s) => String(s).trim())
      : undefined,
    menus: room.menus || undefined,
    miniBar: room.miniBar || undefined,
    hotline: room.hotline || undefined,
    available: room.available !== false,
    category: normalizeCategory(room.category),
    maxGuests,
  };
}

function buildImportedDiscount(room) {
  const originalPrice = Number(room.pricePerNight || 0);
  const promoPrice = Number(room.discountPrice || 0);

  if (!originalPrice || !promoPrice || promoPrice >= originalPrice) {
    return null;
  }

  const percentageValue = ((originalPrice - promoPrice) / originalPrice) * 100;
  const roundedPercentage = Math.round(percentageValue * 100) / 100;
  const usePercentage = Number.isInteger(roundedPercentage);

  return {
    name: `${room.name} Imported Promo`,
    type: usePercentage ? "percentage" : "fixed",
    value: usePercentage ? roundedPercentage : originalPrice - promoPrice,
    appliesTo: "specific_rooms",
    rooms: [room._id],
    categories: [],
    startDate: new Date("2025-01-01T00:00:00.000Z"),
    endDate: new Date("2099-12-31T23:59:59.999Z"),
    active: true,
    label: room.discountLabel || undefined,
    minimumNights: 1,
    createdBy: "system-import",
  };
}

async function run() {
  const jsonPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.resolve(__dirname, "../../rooms-cloudinary-export.json");

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Rooms JSON file not found: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  const parsed = JSON.parse(raw);
  const rooms = Array.isArray(parsed) ? parsed : parsed.rooms;

  if (!Array.isArray(rooms) || rooms.length === 0) {
    throw new Error("Rooms JSON must contain a non-empty array");
  }

  await connectDB();

  let imported = 0;

  for (const room of rooms) {
    const payload = normalizeRoom(room);
    const filter = payload._id ? { _id: payload._id } : { slug: payload.slug };
    const savedRoom = await Room.findOneAndUpdate(filter, payload, {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    });

    const importedDiscount = buildImportedDiscount(savedRoom);

    if (importedDiscount) {
      await Discount.findOneAndUpdate(
        { createdBy: "system-import", rooms: savedRoom._id },
        importedDiscount,
        {
          returnDocument: "after",
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );
    } else {
      await Discount.deleteMany({
        createdBy: "system-import",
        rooms: savedRoom._id,
      });
    }

    imported += 1;
  }

  console.log(
    `Imported ${imported} room records from ${path.basename(jsonPath)}`,
  );
  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error(error.message || error);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
