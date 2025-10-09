const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Channel", channelSchema);
