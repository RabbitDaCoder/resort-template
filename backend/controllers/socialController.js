const catchAsync = require("../utils/catchAsync");
const SocialLinks = require("../models/SocialLinks");

// GET — public, no auth required
exports.getSocialLinks = catchAsync(async (req, res) => {
  let links = await SocialLinks.findOne();
  if (!links) {
    // Auto-seed defaults from env on first request
    links = await SocialLinks.create({
      phone: process.env.RESORT_PHONE || "",
      whatsapp: process.env.RESORT_WHATSAPP || "",
      email: process.env.RESORT_EMAIL || "",
      facebookUrl: process.env.FACEBOOK_PAGE_URL || "",
      maxGuestsPerBooking: 50,
    });
  }
  res.json({ success: true, data: links });
});

// PUT — admin only
exports.updateSocialLinks = catchAsync(async (req, res) => {
  const { facebookUrl, phone, whatsapp, email, maxGuestsPerBooking } = req.body;

  let links = await SocialLinks.findOne();
  if (!links) {
    links = await SocialLinks.create({
      facebookUrl,
      phone,
      whatsapp,
      email,
      maxGuestsPerBooking,
    });
  } else {
    // Use .save() to avoid silent field-ignore bugs with partial updates
    links.facebookUrl = facebookUrl;
    links.phone = phone;
    links.whatsapp = whatsapp;
    links.email = email;
    links.maxGuestsPerBooking = maxGuestsPerBooking;
    await links.save();
  }

  res.json({ success: true, data: links, message: "Contact details updated" });
});
