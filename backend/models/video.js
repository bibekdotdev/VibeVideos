const mongoose = require("mongoose");
const Comment = require("./comments");
const Savedvideos = require("./savedvideo");
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  visibility: {
    type: String,
    enum: ["public", "private", "unlisted"],
    default: "public",
  },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  vector: { type: [Number], default: [] },
});

videoSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    try {
      await Savedvideos.updateMany(
        { savedVideos: doc._id },
        { $pull: { savedVideos: doc._id } }
      );
      await Comment.deleteMany({ commentFor: doc._id });
      console.log(`Deleted video "${doc.title}" and cleaned up related data.`);
    } catch (error) {
      console.error("Error during post-delete cleanup:", error);
    }
  } else {
    console.log("No video found to delete.");
  }
});

module.exports = mongoose.model("Video", videoSchema);
