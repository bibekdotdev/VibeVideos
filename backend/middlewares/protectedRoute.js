const jwt = require("jsonwebtoken");
require("dotenv").config();
const protectedRoute = (req, res, next) => {
  try {
    const token = req.signedCookies?.token || req.cookies?.token;
    console.log("Token:", token);

    if (!token) {
      return res.status(400).json({ message: "Signin first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protectedRoute;
