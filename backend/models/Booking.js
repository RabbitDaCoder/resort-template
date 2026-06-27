const mongoose = require("mongoose");

function bookingRefPrefix() {
  const configuredId = String(process.env.PROJECT_ID || "").toUpperCase();
  const candidate = configuredId.split("-")[0] || "BOOK";
  const safe = candidate.replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return safe || "BOOK";
}

// Embedded payment record (used for installment history)
const paymentRecordSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: ["first", "second", "full"], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "cancelled"],
      default: "pending",
    },
    screenshotUrl: String,
    reference: String,
    paidAt: Date,
    confirmedAt: Date,
  },
  { _id: true },
);

const bookingSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    guestPhone: { type: String, required: true, trim: true },
    numberOfGuests: { type: Number, required: true },
    specialRequests: { type: String, trim: true },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "pending",
        "partial",
        "confirmed",
        "failed",
        "cancelled",
      ],
      default: "unpaid",
    },
    paymentOption: {
      type: String,
      enum: ["full", "installment"],
      default: "full",
    },
    paymentScreenshot: String,
    paymentRef: String,
    // Secure token for continuation link (expires after 72h)
    continuationToken: { type: String, index: { sparse: true } },
    continuationTokenExpiry: Date,
    // Embedded payment history
    payments: [paymentRecordSchema],
    installment: {
      firstPaymentAmount: Number,
      secondPaymentAmount: Number,
      firstPaymentStatus: {
        type: String,
        enum: ["unpaid", "pending", "confirmed"],
        default: "unpaid",
      },
      firstPaymentScreenshot: String,
      firstPaymentDate: Date,
      firstPaymentConfirmedAt: Date,
      secondPaymentStatus: {
        type: String,
        enum: ["unpaid", "pending", "confirmed"],
        default: "unpaid",
      },
      secondPaymentScreenshot: String,
      secondPaymentDueDate: Date,
      secondPaymentDate: Date,
      secondPaymentConfirmedAt: Date,
      secondPaymentReminderSent: { type: Boolean, default: false },
    },
    bookingRef: {
      type: String,
      unique: true,
      default: () =>
        `${bookingRefPrefix()}-${Date.now().toString(36).toUpperCase()}`,
    },
    reminderEmails: {
      firstSent: { type: Boolean, default: false },
      secondSent: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

bookingSchema.pre("validate", function () {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Check-out must be after check-in");
  }
});

// Compound index for efficient booking queries
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ guestEmail: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
