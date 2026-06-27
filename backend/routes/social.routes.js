const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSocialLinks,
  updateSocialLinks,
} = require("../controllers/socialController");

router.get("/links", getSocialLinks); // public
router.put("/links/update", auth, updateSocialLinks); // admin only

module.exports = router;
