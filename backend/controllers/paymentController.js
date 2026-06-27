const catchAsync = require("../utils/catchAsync");
const paymentService = require("../services/paymentService");
const auditService = require("../services/auditService");

exports.uploadProof = catchAsync(async (req, res) => {
  const booking = await paymentService.uploadProof(
    req.params.id,
    req.file,
    req.body.installmentNumber,
    req.body.paymentOption,
  );
  res.json({ success: true, data: booking });
});

exports.getPaymentDetails = catchAsync(async (req, res) => {
  const details = await paymentService.getDetails();
  res.json({ success: true, data: details });
});

exports.updatePaymentDetails = catchAsync(async (req, res) => {
  const details = await paymentService.updateDetails(req.body);
  auditService.log({
    action: "UPDATE_PAYMENT_DETAILS",
    entity: "PaymentDetails",
    entityId: details._id,
    adminId: req.admin?.id,
    req,
  });
  res.json({ success: true, data: details });
});
