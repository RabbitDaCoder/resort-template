const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  updatePaymentDetailsSchema,
} = require("../validators/payment.validator");
const {
  getPaymentDetails,
  updatePaymentDetails,
} = require("../controllers/paymentController");

router.get("/payment", getPaymentDetails);
router.put(
  "/payment",
  auth,
  validate(updatePaymentDetailsSchema),
  updatePaymentDetails,
);

module.exports = router;
