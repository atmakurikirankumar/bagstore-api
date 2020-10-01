const express = require("express");
const {
  getCurrentUser,
  validateUserId,
  getUser,
  updateUser,
  purchaseHistory,
} = require("../controllers/user");
const router = express.Router();

const { requireSignin } = require("../middlewares");

router.get("/", requireSignin, getCurrentUser);
router.get("/:userId", requireSignin, validateUserId, getUser);
router.put("/:userId", requireSignin, validateUserId, updateUser);
router.get("/orders/:userId", requireSignin, validateUserId, purchaseHistory);
module.exports = router;
