const catchAsync = require("../utils/catchAsync");
const roomService = require("../services/roomService");
const auditService = require("../services/auditService");

exports.getRooms = catchAsync(async (req, res) => {
  const rooms = await roomService.getAll(req.query);
  res.json({ success: true, data: rooms });
});

exports.getPromos = catchAsync(async (req, res) => {
  const rooms = await roomService.getPromos();
  res.json({ success: true, data: rooms });
});

exports.getRoomBySlug = catchAsync(async (req, res) => {
  const room = await roomService.getBySlug(req.params.slug);
  res.json({ success: true, data: room });
});

exports.createRoom = catchAsync(async (req, res) => {
  const room = await roomService.create(req.body, req.files);
  auditService.log({
    action: "CREATE_ROOM",
    entity: "Room",
    entityId: room._id,
    adminId: req.admin?.id,
    changes: { name: room.name },
    req,
  });
  res.status(201).json({ success: true, data: room });
});

exports.updateRoom = catchAsync(async (req, res) => {
  const room = await roomService.update(req.params.id, req.body, req.files);
  auditService.log({
    action: "UPDATE_ROOM",
    entity: "Room",
    entityId: room._id,
    adminId: req.admin?.id,
    req,
  });
  res.json({ success: true, data: room });
});

exports.updatePrice = catchAsync(async (req, res) => {
  const room = await roomService.updatePrice(req.params.id, req.body);
  res.json({ success: true, data: room });
});

exports.deleteRoom = catchAsync(async (req, res) => {
  await roomService.delete(req.params.id);
  auditService.log({
    action: "DELETE_ROOM",
    entity: "Room",
    entityId: req.params.id,
    adminId: req.admin?.id,
    req,
  });
  res.json({ success: true, message: "Room deleted" });
});
