const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  visibility: {
    type: String,
    enum: ["public", "private", "unlisted"],
    default: "public",
  },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String }, // <-- new field for thumbnail image
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

module.exports = mongoose.model("Video", videoSchema);
