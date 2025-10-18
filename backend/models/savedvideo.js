const mongoose = require("mongoose");

const savedVideosSchema = new mongoose.Schema(
  {
    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    savedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Savedvideos", savedVideosSchema);
