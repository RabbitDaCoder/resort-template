const IdempotencyKey = require("../models/IdempotencyKey");
const logger = require("../config/logger");

const idempotency = async (req, res, next) => {
  const key = req.headers["idempotency-key"];
  if (!key) return next();

  try {
    const existing = await IdempotencyKey.findOne({ key });
    if (existing) {
      logger.info({ message: "Idempotent replay", key });
      return res.status(existing.statusCode).json(existing.response);
    }

    // Intercept res.json to capture the response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      try {
        await IdempotencyKey.create({
          key,
          response: body,
          statusCode: res.statusCode,
        });
      } catch (err) {
        // Duplicate key race condition — another request stored it first, that's fine
        if (err.code !== 11000) {
          logger.error({ message: "Failed to store idempotency key", err });
        }
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    logger.error({ message: "Idempotency middleware error", err });
    next();
  }
};

module.exports = idempotency;
