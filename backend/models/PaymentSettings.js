const mongoose = require("mongoose");

const paymentDetailsSchema = new mongoose.Schema({
  bankName: { type: String, required: true, trim: true },
  accountName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  instructions: { type: String, trim: true },
  gcashName: { type: String, trim: true, default: "" },
  gcashNumber: { type: String, trim: true, default: "" },
  gcashInstructions: { type: String, trim: true, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentDetails", paymentDetailsSchema);
