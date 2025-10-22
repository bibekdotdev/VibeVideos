const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
require("dotenv").config();
const Comment = require("../models/comments");
const router = express.Router();
const Channel = require("../models/channnel");
const Video = require("../models/video");
const User = require("../models/user");
const protectedRoute = require("../middlewares/protectedRoute");
const SavedVideo = require("../models/savedvideo");
const { video } = require("../config/cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "video")
      return { folder: "videos", resource_type: "video" };
    if (file.fieldname === "thumbnail")
      return { folder: "thumbnails", allowed_formats: ["jpg", "jpeg", "png"] };
  },
});
const parser = multer({ storage });

router.post(
  "/upload",
  protectedRoute,
  parser.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, visibility } = req.body;

      if (!title || !visibility || !req.files?.video?.[0])
        return res
          .status(400)
          .json({ error: "Title, visibility and video required." });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found." });

      const video = new Video({
        title: title.trim(),
        description: description?.trim() || "",
        visibility,
        videoUrl: req.files.video[0].path,
        thumbnailUrl: req.files.thumbnail ? req.files.thumbnail[0].path : "",
        uploadedBy: user._id,
      });

      await video.save();
      res.status(201).json({ message: "Video uploaded!", video });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  }
);

router.get("/myvideos", protectedRoute, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      clerkId: req.user.clerkId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const videos = await Video.find({ uploadedBy: user._id });

    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Fetch error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the videos." });
  }
});

router.get("/getVideo/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    let istrue = false;
    const isSaved = await SavedVideo.findOne({
      savedBy: req.user.id,
      savedVideos: { $in: [id] },
    });
    console.log("bibek jana ", isSaved);

    if (isSaved) {
      istrue = true;
    }
    const videoData = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "channels",
          localField: "uploadedBy",
          foreignField: "owner",
          as: "detailsOfChannel",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,

          likes: 1,
          dislikes: 1,
          uploadedAt: 1,
          uploadedBy: 1,
          detailsOfChannel: 1,
          thumbnailUrl: 1,
        },
      },
    ]);

    if (!videoData || videoData.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    const video = videoData[0];

    let userReaction = null;
    const userId = req.user.id.toString();

    if (video.likes.map((id) => id.toString()).includes(userId)) {
      userReaction = "like";
    } else if (video.dislikes.map((id) => id.toString()).includes(userId)) {
      userReaction = "dislike";
    }

    let isSubscribed = false;
    const channel = video.detailsOfChannel?.[0];
    if (channel) {
      isSubscribed = channel.subscribers
        .map((id) => id.toString())
        .includes(userId);
    }

    res.status(200).json({
      ...video,
      userReaction,
      isSubscribed,
      istrue,
    });
  } catch (err) {
    console.error("Error fetching video:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/update/:id",
  protectedRoute,
  parser.single("thumbnail"),
  async (req, res) => {
    try {
      const videoId = req.params.id;
      const { title, description, visibility } = req.body;

      const user = await User.findOne({
        _id: req.user.id,
        clerkId: req.user.clerkId,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const video = await Video.findById(videoId);
      if (!video) return res.status(404).json({ error: "Video not found" });

      if (video.uploadedBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Not authorized" });
      }

      if (title) video.title = title;
      if (description) video.description = description;
      if (visibility) video.visibility = visibility;

      if (req.file && req.file.path) {
        video.thumbnailUrl = req.file.path;
      }

      await video.save();
      res.status(200).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);
router.delete("/deletevideo/:_id", protectedRoute, async (req, res) => {
  try {
    const videoId = req.params._id;

    const user = await User.findOne({
      _id: req.user.id,
      clerkId: req.user.clerkId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    if (video.uploadedBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this video." });
    }

    await Video.findByIdAndDelete(videoId);

    res.status(200).json({ message: "Video deleted successfully." });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});
router.put("/:id/reaction", protectedRoute, async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;
  const userId = req.user.id;

  if (!["like", "dislike"].includes(reaction)) {
    return res.status(400).json({ error: "Invalid reaction type." });
  }

  try {
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found." });

    video.likes = video.likes.filter((uid) => uid.toString() !== userId);
    video.dislikes = video.dislikes.filter((uid) => uid.toString() !== userId);

    if (reaction === "like") video.likes.push(userId);
    if (reaction === "dislike") video.dislikes.push(userId);

    await video.save();

    res.status(200).json({
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/my-video/:id", protectedRoute, async (req, res) => {
  try {
    const videoId = req.params.id;

    const user = await User.findOne({
      _id: req.user.id,
      clerkId: req.user.clerkId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const video = await Video.findOne({ _id: videoId, uploadedBy: user._id });
    console.log(video);
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});
router.put("/update/:id", protectedRoute, async (req, res) => {
  try {
    const videoId = req.params.id;
    const { title, description, visibility } = req.body;

    const user = await User.findOne({
      _id: req.user.id,
      clerkId: req.user.clerkId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.uploadedBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (title) video.title = title;
    if (description) video.description = description;
    if (visibility) video.visibility = visibility;

    await video.save();
    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/:videoId/addcomment", protectedRoute, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    const id = videoId;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    const user = await User.findOne({
      _id: req.user.id,
      clerkId: req.user.clerkId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Check if comment doc already exists for this video
    let commentDoc = await Comment.findOne({ commentFor: id });
    if (commentDoc) {
      commentDoc.commentsData.push({ user, text });
      commentDoc.save();
    } else {
      commentDoc = new Comment({
        commentFor: videoId,
        commentsData: [{ user, text }],
      });
      commentDoc.save();
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment: commentDoc,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/:videoId/fetchcomment", protectedRoute, async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find the comment document for the video
    const commentDoc = await Comment.findOne({ commentFor: videoId });

    if (!commentDoc || !commentDoc.commentsData.length) {
      return res.status(200).json({ comments: [] });
    }

    const commentsWithAuthor = await Promise.all(
      commentDoc.commentsData.map(async (comment) => {
        let authorInfo = {};

        if (comment.user) {
          // First, try to find the channel
          const channel = await Channel.findOne({ owner: comment.user });

          if (channel) {
            authorInfo = {
              _id: channel._id,
              name: channel.name,
              logoUrl: channel.logoUrl,
            };
          } else {
            const user = await User.findById(req.user.id);

            authorInfo = {
              name: user ? user.name : "Unknown",
            };
          }
        } else {
          authorInfo = { name: "Anonymous" };
        }

        return {
          _id: comment._id,
          text: comment.text,
          createdAt: comment.createdAt,
          author: authorInfo,
        };
      })
    );

    res.status(200).json({ comments: commentsWithAuthor });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Server error fetching comments" });
  }
});
router.post("/:channelId/subscribe", protectedRoute, async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const userId = req.user.id;

    if (channel.subscribers.includes(userId)) {
      channel.subscribers = channel.subscribers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      channel.subscribers.push(userId);
    }

    await channel.save();

    res.status(200).json({
      isSubscribed: channel.subscribers.includes(userId),
      subscribersCount: channel.subscribers.length,
    });
  } catch (err) {
    console.error("Error subscribing to channel:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/:videoId/callrecommendedvideos",
  protectedRoute,
  async (req, res) => {
    try {
      const { videoId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }

      // Find the current video
      const currentVideo = await Video.findById(videoId);
      if (!currentVideo) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Get recommended videos based on title/description, excluding current video
      const recommendedVideos = await Video.aggregate([
        { $match: { _id: { $ne: currentVideo._id }, visibility: "public" } },
        {
          $match: {
            $or: [
              { title: { $regex: currentVideo.title, $options: "i" } },
              {
                description: {
                  $regex: currentVideo.description,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "channels",
            localField: "uploadedBy",
            foreignField: "owner",
            as: "detailsOfChannel",
          },
        },
        { $sort: { uploadedAt: -1 } },
      ]);

      // Fallback: all public videos (excluding current video)
      const otherVideos = await Video.aggregate([
        { $match: { _id: { $ne: currentVideo._id }, visibility: "public" } },
        {
          $lookup: {
            from: "channels",
            localField: "uploadedBy",
            foreignField: "owner",
            as: "detailsOfChannel",
          },
        },
        { $sort: { uploadedAt: -1 } },
      ]);

      const combinedVideos = [...recommendedVideos, ...otherVideos];

      // Add user-specific data
      const userId = req.user.id.toString();
      const videosWithUserData = combinedVideos.map((video) => {
        // isSaved
        const isSaved = video.savedBy?.includes(userId) || false;

        // userReaction
        let userReaction = null;
        if (video.likes?.map((id) => id.toString()).includes(userId)) {
          userReaction = "like";
        } else if (
          video.dislikes?.map((id) => id.toString()).includes(userId)
        ) {
          userReaction = "dislike";
        }

        // isSubscribed
        const channel = video.detailsOfChannel?.[0];
        let isSubscribed = false;
        if (channel) {
          isSubscribed = channel.subscribers
            ?.map((id) => id.toString())
            .includes(userId);
        }

        return {
          ...video,
          isSaved,
          userReaction,
          isSubscribed,
        };
      });

      res.status(200).json(videosWithUserData);
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/:id", protectedRoute, async (req, res) => {
  try {
    console.log(req.params.id);
    const channel = await Channel.findOne({ _id: req.params.id });

    if (!channel) {
      return res.status(404).json({ error: "channel not found." });
    }
    console.log("hi");
    const videos = await Video.find({ uploadedBy: channel.owner });
    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Fetch error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the videos." });
  }
});

router.get("/home/fetchallvideos", protectedRoute, async (req, res) => {
  try {
    console.log("bibek");
    const videos = await Video.aggregate([
      { $sample: { size: await Video.countDocuments() } },

      {
        $lookup: {
          from: "channels",
          localField: "uploadedBy",
          foreignField: "owner",
          as: "detailsOfChannel",
        },
      },

      {
        $unwind: {
          path: "$detailsOfChannel",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          thumbnailUrl: 1,

          likes: 1,
          dislikes: 1,
          uploadedAt: 1,
          uploadedBy: 1,
          "detailsOfChannel._id": 1,
          "detailsOfChannel.name": 1,
          "detailsOfChannel.logoUrl": 1,
          "detailsOfChannel.subscribers": 1,
        },
      },
    ]);

    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Fetch error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching videos." });
  }
});

router.get("/searchvideos/:value", protectedRoute, async (req, res) => {
  try {
    const { value } = req.params;

    if (!value) {
      return res.status(400).json({ error: "Search value is required." });
    }

    const videos = await Video.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: value,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $lookup: {
          from: "channels",
          localField: "uploadedBy",
          foreignField: "owner",
          as: "detailsOfChannel",
        },
      },
      {
        $unwind: {
          path: "$detailsOfChannel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          thumbnailUrl: 1,

          likes: 1,
          dislikes: 1,
          uploadedAt: 1,
          uploadedBy: 1,
          "detailsOfChannel._id": 1,
          "detailsOfChannel.name": 1,
          "detailsOfChannel.logoUrl": 1,
          "detailsOfChannel.subscribers": 1,
        },
      },
    ]);
    console.log(videos);
    res.status(200).json({ videos });
  } catch (err) {
    console.error("Search error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while performing text search." });
  }
});

router.put("/save/:video_id", protectedRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.video_id;

    let savedDoc = await SavedVideo.findOne({ savedBy: userId });

    if (!savedDoc) {
      savedDoc = new SavedVideo({ savedBy: userId, savedVideos: [videoId] });
      await savedDoc.save();
      return res.json({
        success: true,
        message: "Video saved successfully",
        isSaved: true,
      });
    }

    const isAlreadySaved = savedDoc.savedVideos.includes(videoId);

    if (isAlreadySaved) {
      savedDoc.savedVideos = savedDoc.savedVideos.filter(
        (id) => id.toString() !== videoId
      );
      await savedDoc.save();
      return res.json({
        success: true,
        message: "Video removed from saved list",
        isSaved: false,
      });
    } else {
      savedDoc.savedVideos.push(videoId);
      await savedDoc.save();
      return res.json({
        success: true,
        message: "Video saved successfully",
        isSaved: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/saved/fetchvideos", protectedRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const savedDocs = await SavedVideo.find({ savedBy: userId });
    console.log("Saved videors are", savedDocs);
    if (!savedDocs || savedDocs.length === 0) {
      return res.json({ success: true, savedVideos: [] });
    }

    const allSavedVideoIds = savedDocs
      .flatMap((doc) => doc.savedVideos)
      .filter(Boolean);

    if (allSavedVideoIds.length === 0) {
      return res.json({ success: true, savedVideos: [] });
    }

    const videos = await Video.aggregate([
      { $match: { _id: { $in: allSavedVideoIds } } },
      {
        $lookup: {
          from: "channels",
          localField: "uploadedBy",
          foreignField: "owner",
          as: "detailsOfChannel",
        },
      },
      {
        $unwind: {
          path: "$detailsOfChannel",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          thumbnailUrl: 1,

          likes: 1,
          dislikes: 1,
          uploadedAt: 1,
          uploadedBy: 1,
          "detailsOfChannel._id": 1,
          "detailsOfChannel.name": 1,
          "detailsOfChannel.logoUrl": 1,
          "detailsOfChannel.subscribers": 1,
        },
      },
    ]);
    console.log("Saved videors are", videos);
    res.json({ success: true, savedVideos: videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
