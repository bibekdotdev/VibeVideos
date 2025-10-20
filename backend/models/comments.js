// models/Comment.js
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
   
    commentFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    commentsData: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
