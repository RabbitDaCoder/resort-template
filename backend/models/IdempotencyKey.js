const mongoose = require("mongoose");

const idempotencyKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  statusCode: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

module.exports = mongoose.model("IdempotencyKey", idempotencyKeySchema);
