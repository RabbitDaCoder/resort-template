const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  loginSchema,
  refreshTokenSchema,
} = require("../validators/auth.validator");
const {
  login,
  refresh,
  logout,
  checkAuth,
  dashboard,
  seed,
} = require("../controllers/authController");

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.post("/logout", logout);
router.get("/me", auth, checkAuth);
router.get("/dashboard", auth, dashboard);
router.post("/seed", seed);

module.exports = router;
