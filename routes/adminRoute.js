const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userCtrl");
const { getAllOrders, updateOrderStatus } = require("../controllers/orderCtrl");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/allusers", protect, admin, getAllUsers);
router.get("/allorders", protect, admin, getAllOrders);

router.put("/order-status/:id", protect, admin, updateOrderStatus);

module.exports = router;
