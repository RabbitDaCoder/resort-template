const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscount,
  getActiveDiscountForRoom,
} = require("../controllers/discountController");
const {
  createDiscountSchema,
  updateDiscountSchema,
} = require("../validators/discount.validator");

// Public — rooms page uses this to show badges
router.get("/active-for-room/:roomId", getActiveDiscountForRoom);

// Admin only
router.get("/", auth, getAllDiscounts);
router.post("/", auth, validate(createDiscountSchema), createDiscount);
router.put("/:id", auth, validate(updateDiscountSchema), updateDiscount);
router.delete("/:id", auth, deleteDiscount);
router.patch("/:id/toggle", auth, toggleDiscount);

module.exports = router;
