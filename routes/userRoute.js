const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUserCart,
} = require("../controllers/userCtrl");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.put("/cart", protect, updateUserCart);

module.exports = router;
