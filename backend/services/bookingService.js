const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const AppError = require("../utils/AppError");
const emailService = require("./emailService");
const discountService = require("./discountService");

const CLIENT_URL = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim();

const TOKEN_TTL_HOURS = 72;

const bookingService = {
  async create(data) {
    const roomDoc = await Room.findById(data.room);
    if (!roomDoc) throw new AppError("Room not found", 404);

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );
    if (nights < 1) throw new AppError("Check-out must be after check-in", 400);

    const pricing = await discountService.getRoomPricing(roomDoc, {
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
    const pricePerNight = pricing.effectivePrice;
    const totalAmount = nights * pricePerNight;

    // Create booking within a transaction
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const bookingData = {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        numberOfGuests: data.numberOfGuests,
        specialRequests: data.specialRequests,
        room: data.room,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        totalAmount,
        paymentOption: data.paymentOption || "full",
      };

      if (bookingData.paymentOption === "installment") {
        const firstHalf = Math.ceil(totalAmount / 2);
        bookingData.installment = {
          firstPaymentAmount: firstHalf,
          secondPaymentAmount: totalAmount - firstHalf,
          firstPaymentStatus: "unpaid",
          secondPaymentStatus: "unpaid",
          secondPaymentDueDate: checkInDate,
        };
      }

      const [booking] = await Booking.create([bookingData], { session });

      await session.commitTransaction();

      const populated = await booking.populate(
        "room",
        "name pricePerNight images",
      );
      emailService.sendBookingNotification(populated);
      emailService.sendBookingConfirmationToGuest(populated);

      return populated;
    } catch (err) {
      if (session.inTransaction()) await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async checkAvailability({ checkIn, checkOut, roomId }) {
    const filter = {
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    };
    if (roomId) filter.room = roomId;

    const conflicts = await Booking.find(filter).select("room");
    const bookedRoomIds = conflicts.map((b) => b.room.toString());
    return { bookedRoomIds };
  },

  async getAll(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.search) {
      filter.$or = [
        { guestName: { $regex: query.search, $options: "i" } },
        { bookingRef: { $regex: query.search, $options: "i" } },
      ];
    }

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("room", "name pricePerNight category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id) {
    const booking = await Booking.findById(id).populate(
      "room",
      "name pricePerNight images category",
    );
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
  },

  async updateStatus(id, status) {
    const update = { status };
    if (status === "confirmed") update.paymentStatus = "confirmed";
    if (status === "cancelled") update.paymentStatus = "unpaid";

    const booking = await Booking.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("room", "name pricePerNight");
    if (!booking) throw new AppError("Booking not found", 404);

    if (status === "confirmed") {
      emailService.sendGuestConfirmation(booking);
    }

    return booking;
  },

  async confirmInstallment(id, installmentNumber) {
    const booking = await Booking.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.paymentOption !== "installment") {
      throw new AppError("This booking does not use installment payment", 400);
    }

    const now = new Date();
    if (installmentNumber === 1) {
      booking.installment.firstPaymentStatus = "confirmed";
      booking.installment.firstPaymentConfirmedAt = now;
      booking.paymentStatus = "partial";
      booking.amountPaid = booking.installment.firstPaymentAmount || 0;
    } else if (installmentNumber === 2) {
      booking.installment.secondPaymentStatus = "confirmed";
      booking.installment.secondPaymentConfirmedAt = now;
      // Both confirmed → full confirmation
      if (booking.installment.firstPaymentStatus === "confirmed") {
        booking.paymentStatus = "confirmed";
        booking.status = "confirmed";
      }
    } else {
      throw new AppError("Invalid installment number", 400);
    }

    await booking.save();
    const populated = await booking.populate("room", "name pricePerNight");

    if (booking.status === "confirmed") {
      emailService.sendGuestConfirmation(populated);
    } else if (installmentNumber === 1) {
      // First installment confirmed — generate continuation link and email guest
      try {
        const continuationUrl = await bookingService.generateContinuationUrl(
          populated._id,
        );
        emailService.sendPartialPaymentEmail(populated, continuationUrl);
      } catch (err) {
        // Non-fatal; log but don't break the response
        console.error("Failed to send partial payment email:", err.message);
      }
    }

    return populated;
  },

  async delete(id) {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
  },

  async sendInstallmentReminder(id) {
    const booking = await Booking.findById(id).populate(
      "room",
      "name pricePerNight",
    );
    if (!booking) throw new AppError("Booking not found", 404);

    // Block if fully paid / cancelled
    if (booking.paymentStatus === "confirmed") {
      throw new AppError("Booking already fully paid", 400);
    }
    if (booking.status === "cancelled") {
      throw new AppError("Booking is cancelled", 400);
    }

    const continuationUrl = await bookingService.generateContinuationUrl(
      booking._id,
    );

    // Branch by payment state:
    //  - installment + 1st paid (partial)  → remaining balance reminder
    //  - installment + nothing paid yet    → standard payment reminder
    //  - full + unpaid                     → standard payment reminder
    if (
      booking.paymentOption === "installment" &&
      booking.paymentStatus === "partial"
    ) {
      if (booking.installment?.secondPaymentStatus === "confirmed") {
        throw new AppError("Second payment already confirmed", 400);
      }
      await emailService.sendRemainingBalanceReminder(booking, continuationUrl);
      booking.installment.secondPaymentReminderSent = true;
    } else {
      await emailService.sendPaymentReminder(booking, 1, continuationUrl);
      booking.reminderEmails = booking.reminderEmails || {};
      booking.reminderEmails.firstSent = true;
    }

    await booking.save();
    return { booking, continuationUrl };
  },

  /**
   * Generate a signed JWT continuation token and store a hash of it on the booking.
   * Returns the full public URL the guest should visit.
   */
  async generateContinuationUrl(bookingId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
      { bookingId: bookingId.toString(), purpose: "payment_continuation" },
      secret,
      { expiresIn: `${TOKEN_TTL_HOURS}h` },
    );

    // Store a hash so we can invalidate without storing the raw token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiry = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await Booking.findByIdAndUpdate(bookingId, {
      continuationToken: tokenHash,
      continuationTokenExpiry: expiry,
    });

    return `${CLIENT_URL()}/booking/continue/${token}`;
  },

  /**
   * Verify a continuation token from a public URL.
   * Returns the populated booking if valid.
   */
  async verifyContinuationToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("Server misconfiguration", 500);

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      throw new AppError("Payment link is invalid or has expired", 401);
    }

    if (payload.purpose !== "payment_continuation") {
      throw new AppError("Invalid token purpose", 401);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const booking = await Booking.findOne({
      _id: payload.bookingId,
      continuationToken: tokenHash,
      continuationTokenExpiry: { $gt: new Date() },
    }).populate("room", "name pricePerNight images category");

    if (!booking) {
      throw new AppError(
        "Payment link is invalid or has already been used",
        401,
      );
    }

    return booking;
  },

  async getBookedDates({ roomId, year, month }) {
    // If year+month provided, scope to that month; otherwise return all future
    let dateFilter;
    let filterMonth = null;
    let filterYear = null;

    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month) - 1;
      filterYear = y;
      filterMonth = m;
      const startOfMonth = new Date(y, m, 1);
      const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);

      dateFilter = {
        $or: [
          { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
          { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
          { checkIn: { $lte: startOfMonth }, checkOut: { $gte: endOfMonth } },
        ],
      };
    } else {
      dateFilter = { checkOut: { $gte: new Date() } };
    }

    const query = {
      ...(roomId && { room: roomId }),
      status: { $in: ["pending", "confirmed"] },
      ...dateFilter,
    };

    const bookings = await Booking.find(query)
      .select("checkIn checkOut room status")
      .lean();

    const bookedDates = new Set();

    for (const b of bookings) {
      const d = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      d.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(0, 0, 0, 0);

      const current = new Date(d);
      while (current <= end) {
        if (
          filterMonth === null ||
          (current.getUTCMonth() === filterMonth &&
            current.getUTCFullYear() === filterYear)
        ) {
          const yy = current.getUTCFullYear();
          const mm = String(current.getUTCMonth() + 1).padStart(2, "0");
          const dd = String(current.getUTCDate()).padStart(2, "0");
          bookedDates.add(`${yy}-${mm}-${dd}`);
        }
        current.setUTCDate(current.getUTCDate() + 1);
      }
    }

    return {
      dates: [...bookedDates],
      count: bookedDates.size,
    };
  },
};

module.exports = bookingService;
