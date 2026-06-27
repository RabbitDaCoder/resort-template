const catchAsync = require("../utils/catchAsync");
const bookingService = require("../services/bookingService");
const emailService = require("../services/emailService");
const auditService = require("../services/auditService");
const generateReceipt = require("../utils/generateReceipt");

exports.createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.create(req.body);
  res.status(201).json({ success: true, data: booking });
});

exports.checkAvailability = catchAsync(async (req, res) => {
  const data = await bookingService.checkAvailability(req.query);
  res.json({ success: true, data });
});

exports.getBookings = catchAsync(async (req, res) => {
  const { bookings, pagination } = await bookingService.getAll(req.query);
  res.json({ success: true, data: bookings, pagination });
});

exports.getBookingById = catchAsync(async (req, res) => {
  const booking = await bookingService.getById(req.params.id);
  res.json({ success: true, data: booking });
});

exports.updateBookingStatus = catchAsync(async (req, res) => {
  const booking = await bookingService.updateStatus(
    req.params.id,
    req.body.status,
  );
  auditService.log({
    action: `BOOKING_${req.body.status.toUpperCase()}`,
    entity: "Booking",
    entityId: booking._id,
    adminId: req.admin?.id,
    changes: { status: req.body.status },
    req,
  });
  res.json({ success: true, data: booking });
});

exports.sendReceipt = catchAsync(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await bookingService.getById(bookingId);
  const pdfBuffer = await generateReceipt(booking);
  const result = await emailService.sendReceiptEmail(booking, pdfBuffer);
  res.json({
    success: result.success,
    message: result.success ? "Receipt sent" : "Failed to send receipt",
  });
});

exports.getBookedDates = catchAsync(async (req, res) => {
  const result = await bookingService.getBookedDates(req.query);
  res.json({ success: true, dates: result.dates, count: result.count });
});

exports.downloadReceipt = catchAsync(async (req, res) => {
  const booking = await bookingService.getById(req.params.id);
  const pdfBuffer = await generateReceipt(booking);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="Receipt_${booking.bookingRef}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });
  res.end(pdfBuffer);
});

exports.confirmInstallment = catchAsync(async (req, res) => {
  const booking = await bookingService.confirmInstallment(
    req.params.id,
    parseInt(req.body.installmentNumber),
  );
  auditService.log({
    action: `INSTALLMENT_${req.body.installmentNumber}_CONFIRMED`,
    entity: "Booking",
    entityId: booking._id,
    adminId: req.admin?.id,
    req,
  });
  res.json({ success: true, data: booking });
});

exports.sendReminder = catchAsync(async (req, res) => {
  const { booking, continuationUrl } =
    await bookingService.sendInstallmentReminder(req.params.id);
  res.json({
    success: true,
    message: "Reminder sent",
    data: booking,
    continuationUrl,
  });
});

exports.generatePaymentLink = catchAsync(async (req, res) => {
  const booking = await bookingService.getById(req.params.id);
  const continuationUrl = await bookingService.generateContinuationUrl(
    booking._id,
  );

  // Optionally send email to guest
  if (req.body.sendEmail) {
    if (booking.paymentStatus === "partial") {
      emailService.sendRemainingBalanceReminder(booking, continuationUrl);
    } else {
      emailService.sendPaymentReminder(booking, 1, continuationUrl);
    }
  }

  res.json({ success: true, continuationUrl });
});

exports.getContinuationBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.verifyContinuationToken(
    req.params.token,
  );
  res.json({ success: true, data: booking });
});

exports.deleteBooking = catchAsync(async (req, res) => {
  await bookingService.delete(req.params.id);
  auditService.log({
    action: "BOOKING_DELETED",
    entity: "Booking",
    entityId: req.params.id,
    adminId: req.admin?.id,
    req,
  });
  res.json({ success: true, message: "Booking deleted" });
});
