const mongoose = require("mongoose");

const socialLinksSchema = new mongoose.Schema(
  {
    facebookUrl: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    maxGuestsPerBooking: { type: Number, default: 50 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SocialLinks", socialLinksSchema);
