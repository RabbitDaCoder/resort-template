const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const RefreshToken = require("../models/RefreshToken");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const AppError = require("../utils/AppError");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function signAccessToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

const authService = {
  async login(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new AppError("Invalid credentials", 401);

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const accessToken = signAccessToken(admin._id);

    const refreshTokenValue = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );
    await RefreshToken.create({
      token: refreshTokenValue,
      admin: admin._id,
      expiresAt,
    });

    return {
      token: accessToken,
      refreshToken: refreshTokenValue,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    };
  },

  async refresh(refreshTokenValue) {
    const stored = await RefreshToken.findOne({ token: refreshTokenValue });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await stored.deleteOne();
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Rotate: delete old, issue new
    await stored.deleteOne();

    const newAccessToken = signAccessToken(stored.admin);
    const newRefreshTokenValue = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );
    await RefreshToken.create({
      token: newRefreshTokenValue,
      admin: stored.admin,
      expiresAt,
    });

    return { token: newAccessToken, refreshToken: newRefreshTokenValue };
  },

  async logout(refreshTokenValue) {
    await RefreshToken.deleteOne({ token: refreshTokenValue });
  },

  async checkAuth(adminId) {
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) throw new AppError("Not authorized", 401);
    return admin;
  },

  async dashboard() {
    const [
      totalRooms,
      availableRooms,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      pendingPayments,
      revenueAgg,
      recentBookings,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ available: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ paymentStatus: "pending" }),
      Booking.aggregate([
        { $match: { paymentStatus: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.find()
        .populate("room", "name category")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return {
      totalRooms,
      availableRooms,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      pendingPayments,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentBookings,
    };
  },

  async seed({
    email = "reservations@discoverysamal-resort.org",
    password = "Passw0rd!",
    name = "Resort Owner",
  } = {}) {
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await Admin.findOne({
      email: normalizedEmail,
    });
    if (existing) throw new AppError("Admin already exists", 400);

    const admin = await Admin.create({
      email: normalizedEmail,
      password,
      name,
    });

    const PaymentDetails = require("../models/PaymentSettings");
    const existingPayment = await PaymentDetails.findOne();
    if (!existingPayment) {
      await PaymentDetails.create({
        bankName: "BDO",
        accountName: "Discovery Samal Resort",
        accountNumber: "1234567890",
        instructions:
          "Please upload a clear screenshot of the payment receipt.",
      });
    }

    return {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    };
  },
};

module.exports = authService;
