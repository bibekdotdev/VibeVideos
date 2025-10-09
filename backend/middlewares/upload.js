const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();
// Setup storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "channels";
    if (file.fieldname === "logo") folder = "channel_logos";
    if (file.fieldname === "banner") folder = "channel_banners";

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
