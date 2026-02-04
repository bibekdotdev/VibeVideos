const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const Auth = require("./routes/auth");
const videoRoutes = require("./routes/videoRoutes");
const channelRouter = require("./routes/channelRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://vibevideos.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- API ROUTES --------------------
app.use("/api/auth", Auth);
app.use("/api/channel", channelRouter);
app.use("/api/video", videoRoutes);

// -------------------- SERVE REACT --------------------
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
