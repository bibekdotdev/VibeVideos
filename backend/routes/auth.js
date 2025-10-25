const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; 

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

    res.cookie("token", token, {
    signed: true,
  httpOnly: true,
  secure: true, 
  sameSite: "none", 
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
    const token = req.cookies.token; 
    console.log("Token before clearing:", token);

   
    res.clearCookie("token", {
     
        signed: true,
  httpOnly: true,
  secure: true, 
  sameSite: "none", 
  maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
