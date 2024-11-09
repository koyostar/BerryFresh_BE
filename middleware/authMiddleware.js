const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = { protect, admin };

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Error in token verification:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}

async function admin(req, res, next) {
  if (req.user && req.user.userType === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
}
