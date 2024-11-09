const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderCtrl");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);

router.get("/user", protect, getUserOrders);

router.get("/admin", protect, admin, getAllOrders);

module.exports = router;
