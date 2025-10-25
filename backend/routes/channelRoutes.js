const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Channel = require("../models/channnel");
const protectedRoute = require("../middlewares/protectedRoute");
const User = require("../models/user");
const mongoose = require("mongoose");
const Video = require("../models/video");
const { video } = require("../config/cloudinary");

router.post(
  "/create",
  protectedRoute,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, desc } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const isChannel = await Channel.findOne({ owner: req.user.id });
      if (isChannel) {
        return res
          .status(400)
          .json({ success: false, message: "You already created a channel" });
      }

      if (!req.files?.logo || !req.files?.banner) {
        return res
          .status(400)
          .json({ success: false, message: "Logo and Banner are required" });
      }

      const channel = await Channel.create({
        name,
        desc,
        logoUrl: req.files.logo[0].path,
        bannerUrl: req.files.banner[0].path,
        owner: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Channel created successfully",
        channel,
      });
    } catch (err) {
      console.error("Channel creation error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error creating channel" });
    }
  }
);

router.get("/my", protectedRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    let channel = await Channel.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          subscriberCount: { $size: "$subscribers" },
        },
      },
    ]);
    channel = channel[0];

    if (!channel) {
      return res.json({ success: true, channel: null });
    }
    res.json({ success: true, channel });
  } catch (err) {
    console.error("Fetch my channel error:", err);
    res.status(500).json({ success: false, message: "Error fetching channel" });
  }
});

router.put(
  "/updatechannel",
  protectedRoute,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, desc } = req.body;
      console.log("bibek jana is :",name,desc);
      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const isChannel = await Channel.findOne({ owner: req.user.id });
      if (!isChannel) {
        return res.status(400).json({
          success: false,
          message: "You need to create a channel first",
        });
      }

      if (name) isChannel.name = name;
      if (desc) isChannel.desc = desc;
      if (req.files?.logo) isChannel.logoUrl = req.files.logo[0].path;
      if (req.files?.banner) isChannel.bannerUrl = req.files.banner[0].path;

      await isChannel.save();

      return res.status(200).json({
        success: true,
        message: "Channel updated successfully",
        channel: isChannel,
      });
    } catch (err) {
      console.error("Channel update error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error updating channel" });
    }
  }
);

router.get("/subscriptions", protectedRoute, async (req, res) => {
  try {
    const subscriptions = await Channel.find({
      subscribers: { $in: [req.user.id] },
    }).select("_id name logoUrl bannerUrl owner");

    if (!subscriptions || subscriptions.length === 0) {
      return res
        .status(200)
        .json({ message: "No subscriptions found", data: [] });
    }

    const ownerIds = subscriptions.map((channel) => channel.owner);

    const videos = await Video.find({ uploadedBy: { $in: ownerIds } })
      .sort({ createdAt: -1 })
      .limit(20);
    const v = videos.map((video) => {
      const channel = subscriptions.find((subscribe) =>
        subscribe.owner.equals(video.uploadedBy._id)
      );

      return {
        ...video.toObject(),
        channel: channel
          ? {
              _id: channel._id,
              name: channel.name,
              logoUrl: channel.logoUrl,
            }
          : null,
      };
    });

    res.status(200).json({ subscriptions: subscriptions, videos: v });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    let channel = await Channel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          subscriberCount: { $size: "$subscribers" },
        },
      },
    ]);
    channel = channel[0];
    channel.isSubscribed = false;
    let isChannel = await Channel.findOne({
      subscribers: { $in: req.user.id },
    });
    if (isChannel) {
      channel.isSubscribed = true;
    }
    if (!channel) {
      return res.json({ success: true, channel: null });
    }
    res.json({ success: true, channel });
  } catch (err) {
    console.error("Fetch my channel error:", err);
    res.status(500).json({ success: false, message: "Error fetching channel" });
  }
});

module.exports = router;
