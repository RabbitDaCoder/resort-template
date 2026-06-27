const logger = require("../config/logger");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;

  // Log all errors
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res
      .status(409)
      .json({ success: false, message: `Duplicate value for: ${field}` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired" });
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum 5MB allowed.",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Too many files. You can upload up to 15 images at once.",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "Too many images selected. Maximum is 15.",
    });
  }

  if (err.message?.includes("Only image files")) {
    return res.status(400).json({
      success: false,
      message: "Only image files (jpeg, jpg, png, webp) are allowed.",
    });
  }

  // Operational errors we trust
  if (err instanceof AppError && err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Unknown errors: don't leak details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message;

  res.status(err.statusCode).json({ success: false, message });
};

module.exports = errorHandler;
