const AuditLog = require("../models/AuditLog");
const logger = require("../config/logger");

const auditService = {
  async log({ action, entity, entityId, adminId, changes, req }) {
    try {
      await AuditLog.create({
        action,
        entity,
        entityId,
        adminId,
        changes,
        ip: req?.ip,
        userAgent: req?.get("user-agent"),
      });
    } catch (err) {
      logger.error({ message: "Audit log failed", err });
    }
  },
};

module.exports = auditService;
