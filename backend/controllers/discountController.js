const catchAsync = require("../utils/catchAsync");
const Discount = require("../models/Discount");
const Room = require("../models/Room");
const discountService = require("../services/discountService");

exports.getAllDiscounts = catchAsync(async (req, res) => {
  const discounts = await Discount.find()
    .populate("rooms", "name slug")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: discounts });
});

exports.createDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.create({
    ...req.body,
    createdBy: "admin",
  });
  res
    .status(201)
    .json({ success: true, data: discount, message: "Discount created" });
});

exports.updateDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: discount });
});

exports.deleteDiscount = catchAsync(async (req, res) => {
  await Discount.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Discount deleted" });
});

exports.toggleDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  discount.active = !discount.active;
  await discount.save();
  res.json({
    success: true,
    data: discount,
    message: `Discount ${discount.active ? "activated" : "deactivated"}`,
  });
});

exports.getActiveDiscountForRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { checkIn, checkOut } = req.query;
  const room = await Room.findById(roomId)
    .select("category pricePerNight")
    .lean();

  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }

  const discount = await discountService.getActiveDiscount(
    roomId,
    room.category,
    checkIn || new Date(),
    checkOut || new Date(),
    room.pricePerNight,
  );

  res.json({ success: true, data: discount });
});
