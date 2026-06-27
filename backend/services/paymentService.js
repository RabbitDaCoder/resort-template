const Booking = require("../models/Booking");
const PaymentDetails = require("../models/PaymentSettings");
const { uploadToCloudinary } = require("../middleware/upload");
const AppError = require("../utils/AppError");
const emailService = require("./emailService");

const paymentService = {
  async uploadProof(bookingId, file, installmentNumber, paymentOption) {
    if (!file) throw new AppError("Payment screenshot is required", 400);

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError("Booking not found", 404);

    // Set payment option on first upload if provided
    if (
      paymentOption &&
      booking.paymentStatus === "unpaid" &&
      booking.paymentOption === "full"
    ) {
      booking.paymentOption = paymentOption;
      if (paymentOption === "installment") {
        const firstHalf = Math.ceil(booking.totalAmount / 2);
        booking.installment = {
          firstPaymentAmount: firstHalf,
          secondPaymentAmount: booking.totalAmount - firstHalf,
          firstPaymentStatus: "unpaid",
          secondPaymentStatus: "unpaid",
          secondPaymentDueDate: new Date(booking.checkIn),
        };
      }
    }

    const result = await uploadToCloudinary(file.buffer, "payments");

    if (booking.paymentOption === "installment" && installmentNumber) {
      const num = parseInt(installmentNumber);
      if (num === 1) {
        booking.installment.firstPaymentScreenshot = result.secure_url;
        booking.installment.firstPaymentStatus = "pending";
        booking.installment.firstPaymentDate = new Date();
        // Track payment in history
        booking.payments.push({
          amount: booking.installment.firstPaymentAmount || 0,
          type: "first",
          status: "pending",
          screenshotUrl: result.secure_url,
          paidAt: new Date(),
        });
      } else if (num === 2) {
        booking.installment.secondPaymentScreenshot = result.secure_url;
        booking.installment.secondPaymentStatus = "pending";
        booking.installment.secondPaymentDate = new Date();
        booking.payments.push({
          amount: booking.installment.secondPaymentAmount || 0,
          type: "second",
          status: "pending",
          screenshotUrl: result.secure_url,
          paidAt: new Date(),
        });
      }
      // First installment uploaded → "partial"; second → still "pending" until admin confirms
      booking.paymentStatus = num === 1 ? "partial" : "pending";
    } else {
      booking.paymentScreenshot = result.secure_url;
      booking.paymentStatus = "pending";
      booking.payments.push({
        amount: booking.totalAmount,
        type: "full",
        status: "pending",
        screenshotUrl: result.secure_url,
        paidAt: new Date(),
      });
    }

    await booking.save();

    const populated = await booking.populate("room", "name pricePerNight");
    emailService.sendAdminPaymentAlert({
      booking: populated,
      screenshotUrl: result.secure_url,
    });
    emailService.sendAutoReceipt(populated);

    return populated;
  },

  async getDetails() {
    let details = await PaymentDetails.findOne();
    if (!details) {
      details = await PaymentDetails.create({
        bankName: "Update in admin dashboard",
        accountName: "Discovery Samal Resort",
        accountNumber: "0000000000",
        instructions: "",
        gcashName: "",
        gcashNumber: "",
        gcashInstructions: "",
      });
    }
    return details;
  },

  async updateDetails(data) {
    let details = await PaymentDetails.findOne();
    if (!details) {
      details = await PaymentDetails.create(data);
    } else {
      details.bankName = data.bankName;
      details.accountName = data.accountName;
      details.accountNumber = data.accountNumber;
      details.instructions = data.instructions || "";
      details.gcashName = data.gcashName || "";
      details.gcashNumber = data.gcashNumber || "";
      details.gcashInstructions = data.gcashInstructions || "";
      await details.save();
    }
    return details;
  },
};

module.exports = paymentService;
