require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Room = require("../models/Room");
const Discount = require("../models/Discount");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const slugs = ["seaview-villa", "luxury-suite-seaview"];

    const rooms = await Room.find({ slug: { $in: slugs } })
      .select("name slug images pricePerNight discountPrice")
      .lean();

    const discounts = await Discount.find({
      name: { $in: ["Seaview Villa 50% OFF", "Luxury Suite Seaview 50% OFF"] },
      active: true,
    })
      .select("name type value appliesTo rooms active")
      .lean();

    console.log(
      "rooms",
      rooms.map((room) => ({
        slug: room.slug,
        images: Array.isArray(room.images) ? room.images.length : 0,
        price: room.pricePerNight,
        promo: room.discountPrice,
      })),
    );

    console.log(
      "discounts",
      discounts.map((discount) => ({
        name: discount.name,
        type: discount.type,
        value: discount.value,
        appliesTo: discount.appliesTo,
        roomRefs: Array.isArray(discount.rooms) ? discount.rooms.length : 0,
        active: discount.active,
      })),
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message || error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
})();
