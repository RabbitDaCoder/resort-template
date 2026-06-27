const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const idempotency = require("../middleware/idempotency");
const { bookingLimiter } = require("../middleware/rateLimiter");
const {
  createBookingSchema,
  checkAvailabilitySchema,
  updateBookingStatusSchema,
  sendReceiptSchema,
} = require("../validators/booking.validator");
const {
  createBooking,
  checkAvailability,
  getBookings,
  getBookingById,
  updateBookingStatus,
  sendReceipt,
  getBookedDates,
  downloadReceipt,
  confirmInstallment,
  sendReminder,
  deleteBooking,
  generatePaymentLink,
  getContinuationBooking,
} = require("../controllers/bookingController");

router.get("/booked-dates", getBookedDates);
router.get(
  "/availability",
  validate(checkAvailabilitySchema, "query"),
  checkAvailability,
);
// Public: continuation payment link (token-verified, no auth)
router.get("/continue/:token", getContinuationBooking);
router.post(
  "/",
  bookingLimiter,
  idempotency,
  validate(createBookingSchema),
  createBooking,
);
router.get("/:id", getBookingById);
router.get("/:id/receipt", auth, downloadReceipt);
router.get("/", auth, getBookings);
router.patch(
  "/:id/status",
  auth,
  validate(updateBookingStatusSchema),
  updateBookingStatus,
);
router.patch("/:id/confirm-installment", auth, confirmInstallment);
router.patch("/:id/send-reminder", auth, sendReminder);
router.post("/:id/generate-payment-link", auth, generatePaymentLink);
router.delete("/:id", auth, deleteBooking);
router.post(
  "/send-receipt",
  bookingLimiter,
  validate(sendReceiptSchema),
  sendReceipt,
);

module.exports = router;
