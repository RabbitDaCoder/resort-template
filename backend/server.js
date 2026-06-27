require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const { v2: cloudinary } = require("cloudinary");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const { startReminderJob } = require("./jobs/reminderJob");

const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");
const settingsRoutes = require("./routes/settings.routes");
const discountRoutes = require("./routes/discount.routes");
const socialRoutes = require("./routes/social.routes");

const app = express();

// Trust first proxy (Render, etc.) so express-rate-limit reads real client IP
app.set("trust proxy", 1);

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// express-mongo-sanitize sets req.query which is read-only in Express 5,
// so only sanitize body (params/query are read-only in Express 5)
app.use((req, _res, next) => {
  const { sanitize } = require("express-mongo-sanitize");
  const opts = { allowDots: true, replaceWith: "_" };
  if (req.body) req.body = sanitize(req.body, opts);
  next();
});
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));

// Logging — stream morgan into winston
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }),
);

// Global rate limit
app.use("/api/", apiLimiter);

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", uptime: process.uptime() }),
);

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/social", socialRoutes);

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
  startReminderJob();
});
