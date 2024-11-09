const Order = require("../models/orderModel");
const User = require("../models/userModel");

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
};

async function createOrder(req, res) {
  try {
    const { items, totalAmount, guestDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    let user = null;

    if (req.user) {
      user = req.user;
    } else if (guestDetails && guestDetails.email) {
      user = await User.findOne({ email: guestDetails.email });

      if (!user) {
        user = await User.create({
          name: guestDetails.name,
          email: guestDetails.email,
          address: guestDetails.address,
          phoneNumber: guestDetails.phoneNumber,
          userType: "Guest",
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Guest details are required for guest orders" });
    }

    const order = new Order({
      user: user._id,
      guestDetails: req.user ? null : guestDetails,
      items,
      totalAmount,
    });

    const savedOrder = await order.save();

    if (user && user.userType !== "Admin") {
      await User.findByIdAndUpdate(user._id, {
        $push: { orderHistory: savedOrder._id },
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.userType !== "Admin" &&
      (!order.user || order.user.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.productId"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllOrders(req, res) {
  try {
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    const orders = await Order.find().populate("items.productId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
