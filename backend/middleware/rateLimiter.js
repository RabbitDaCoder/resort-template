const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

// General API limiter
const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests, please try again later.",
);

// Strict limiter for auth routes
const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts, please try again later.",
);

// Booking creation limiter
const bookingLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many booking requests, please try again later.",
);

module.exports = { apiLimiter, authLimiter, bookingLimiter };
