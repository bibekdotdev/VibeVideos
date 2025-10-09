const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; // move to process.env

router.post("/signin", async (req, res) => {
  try {
    const { clerkId, name, email } = req.body;
    console.log("hi");

    if (!clerkId || !email) {
      return res
        .status(400)
        .json({ message: "clerkId and email are required" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = new User({ clerkId, name, email });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, clerkId: user.clerkId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ store in cookie named "token"
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Signin successful",
      user,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signout", (req, res) => {
  try {
    const token = req.cookies.token; // ✅ now matches signin
    console.log("Token before clearing:", token);

    // ✅ clear the correct cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
