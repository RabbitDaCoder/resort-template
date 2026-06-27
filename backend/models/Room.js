const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    minGuests: { type: Number },
    capacity: { type: Number },
    occupancy: { type: Number },
    size: { type: String },
    bedType: { type: String },
    pricePerNight: { type: Number, required: true },
    discountPrice: { type: Number },
    discountLabel: { type: String },
    weekendPrice: { type: Number },
    features: [String],
    images: [String],
    videoUrl: { type: String, trim: true },
    videoPoster: { type: String, trim: true },
    tagline: { type: String, trim: true },
    location: { type: String, trim: true },
    intro: { type: String, trim: true },
    propertySliderImages: [String],
    aLaCarteImages: [String],
    menus: { type: mongoose.Schema.Types.Mixed },
    miniBar: { type: mongoose.Schema.Types.Mixed },
    hotline: { type: mongoose.Schema.Types.Mixed },
    available: { type: Boolean, default: true },
    category: {
      type: String,
      enum: [
        "Standard",
        "Premium",
        "Luxury",
        "Deluxe",
        "Premier",
        "Family",
        "Loft",
        "Annex",
        "Villa",
        "Dormitory",
        "Cabin",
        "Presidential",
      ],
    },
    maxGuests: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: true },
);

roomSchema.pre("save", function () {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

module.exports = mongoose.model("Room", roomSchema);
