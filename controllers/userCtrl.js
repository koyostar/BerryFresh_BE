const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUserCart,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

async function registerUser(req, res) {
  const { name, email, password, address, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (user.userType === "Guest") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.name = name;
        user.password = hashedPassword;
        user.address = address;
        user.phoneNumber = phoneNumber;
        user.userType = "Member";

        const updatedUser = await user.save();

        return res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          userType: updatedUser.userType,
          token: generateToken(updatedUser._id),
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      userType: "Member",
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        error: "No user found",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({
        error: "Password incorrect",
      });
    }

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        address: user.address,
        phoneNumber: user.phoneNumber,
        orderHistory: user.orderHistory,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phoneNumber: updatedUser.phoneNumber,
      userType: updatedUser.userType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordCheck = await bcrypt.compare(currentPassword, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUserCart(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = req.body.cart;
    await user.save();

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
}
