const AppError = require("../utils/AppError");

/**
 * Zod validation middleware factory.
 * @param {import("zod").ZodSchema} schema
 * @param {"body"|"query"|"params"} source - where to read data from
 */
const validate =
  (schema, source = "body") =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const issues = result.error.issues || [];
      const messages = issues.map((e) => e.message).join(", ");
      return next(new AppError(messages || "Validation failed", 400));
    }
    // In Express 5 req.query is read-only, so merge into req instead
    if (source === "body") {
      req.body = result.data;
    } else if (source === "params") {
      Object.assign(req.params, result.data);
    }
    // For query, just let it pass — already validated
    next();
  };

module.exports = validate;
