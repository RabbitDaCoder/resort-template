require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Room = require("../models/Room");
const Discount = require("../models/Discount");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const slugs = [
      "deluxe-seaview-king",
      "deluxe-seaview-twin",
      "casitas-seaview-rooms",
      "seaview-villa",
      "presidential-villa",
      "luxury-suite-seaview",
    ];

    const rooms = await Room.find({ slug: { $in: slugs } })
      .select("name slug images pricePerNight discountPrice")
      .sort({ slug: 1 })
      .lean();

    const discounts = await Discount.find({
      name: {
        $in: [
          "Deluxe Seaview King 50% OFF",
          "Deluxe Seaview Twin 50% OFF",
          "Casitas Seaview Rooms 50% OFF",
          "Seaview Villa 50% OFF",
          "Presidential Villa 50% OFF",
          "Luxury Suite Seaview 50% OFF",
        ],
      },
      active: true,
    })
      .select("name type value appliesTo active")
      .sort({ name: 1 })
      .lean();

    console.log(
      JSON.stringify(
        {
          roomsCount: rooms.length,
          discountsCount: discounts.length,
          rooms: rooms.map((r) => ({
            slug: r.slug,
            images: Array.isArray(r.images) ? r.images.length : 0,
            price: r.pricePerNight,
            promo: r.discountPrice,
          })),
          discounts: discounts.map((d) => ({
            name: d.name,
            type: d.type,
            value: d.value,
            appliesTo: d.appliesTo,
            active: d.active,
          })),
        },
        null,
        2,
      ),
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
