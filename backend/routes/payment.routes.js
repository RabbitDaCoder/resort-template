const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const idempotency = require("../middleware/idempotency");
const {
  updatePaymentDetailsSchema,
} = require("../validators/payment.validator");
const {
  uploadProof,
  getPaymentDetails,
  updatePaymentDetails,
} = require("../controllers/paymentController");

router.get("/details", getPaymentDetails);
router.put(
  "/details",
  auth,
  validate(updatePaymentDetailsSchema),
  updatePaymentDetails,
);
router.patch(
  "/:id/proof",
  idempotency,
  upload.single("paymentScreenshot"),
  uploadProof,
);

module.exports = router;
