const Order = require("../models/orderModel");
const User = require("../models/userModel");

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};

async function createOrder(req, res) {
  console.log("createOrder triggered");
  console.log("Request body:", req.body);

  try {
    const { items, totalAmount, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    console.log("Items:", items);
    console.log("Total Amount:", totalAmount);
    console.log("Shipping Info:", shippingInfo);

    let user = null;

    if (req.user) {
      user = req.user;
    } else if (shippingInfo && shippingInfo.email) {
      user = await User.findOne({ email: shippingInfo.email });

      if (!user) {
        user = await User.create({
          name: shippingInfo.recipientName,
          email: shippingInfo.email,
          address: shippingInfo.address,
          postalCode: shippingInfo.postalCode,
          phoneNumber: shippingInfo.phoneNumber,
          userType: "Guest",
        });

        console.log("User Info:", user);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Guest details are required for guest orders" });
    }

    const order = new Order({
      user: user._id,
      shippingInfo: shippingInfo,
      items,
      totalAmount,
    });

    console.log("new order:", order);

    const savedOrder = await order.save();

    console.log("Order saved:", savedOrder);

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

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);

    res.status(500).json({ message: error.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate("items.productId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}
