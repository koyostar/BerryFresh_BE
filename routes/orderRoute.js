const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderCtrl");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/user", protect, getUserOrders);
router.post("/create", createOrder);
router.get("/admin", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
