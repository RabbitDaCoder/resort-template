const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");
const auditService = require("../services/auditService");

exports.login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body.email, req.body.password);
  auditService.log({
    action: "LOGIN",
    entity: "Admin",
    entityId: data.admin.id,
    adminId: data.admin.id,
    req,
  });
  res.json({ success: true, data });
});

exports.refresh = catchAsync(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken);
  res.json({ success: true, data });
});

exports.logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.json({ success: true, message: "Logged out" });
});

exports.checkAuth = catchAsync(async (req, res) => {
  const admin = await authService.checkAuth(req.admin.id);
  res.json({ success: true, data: admin });
});

exports.dashboard = catchAsync(async (req, res) => {
  const data = await authService.dashboard();
  res.json({ success: true, data });
});

exports.seed = catchAsync(async (req, res) => {
  const admin = await authService.seed(req.body || {});
  res.json({
    success: true,
    message: `Seed complete. Email: ${admin.email}`,
    data: admin,
  });
});
