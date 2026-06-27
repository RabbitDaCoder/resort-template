const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: { type: Number, required: true },
    appliesTo: {
      type: String,
      enum: ["all", "specific_rooms", "categories"],
      default: "all",
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    categories: [String],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    label: String,
    minimumNights: { type: Number, default: 1 },
    createdBy: String,
  },
  { timestamps: true },
);

discountSchema.index({ active: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("Discount", discountSchema);
