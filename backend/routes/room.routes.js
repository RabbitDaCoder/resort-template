const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const {
  createRoomSchema,
  updatePriceSchema,
} = require("../validators/room.validator");
const {
  getRooms,
  getPromos,
  getRoomBySlug,
  createRoom,
  updateRoom,
  updatePrice,
  deleteRoom,
} = require("../controllers/roomController");

router.get("/", getRooms);
router.get("/promos", getPromos);
router.get("/:slug", getRoomBySlug);
router.post(
  "/",
  auth,
  upload.array("images", 15),
  validate(createRoomSchema),
  createRoom,
);
router.put("/:id", auth, upload.array("images", 15), updateRoom);
router.patch("/:id/price", auth, validate(updatePriceSchema), updatePrice);
router.delete("/:id", auth, deleteRoom);

module.exports = router;
