const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Auth = require("./routes/auth");
const PORT = 5000;
const cookieParser = require("cookie-parser");
const videoRoutes = require("./routes/videoRoutes");
const path = require("path");
const channnelRouter = require("./routes/channelRoutes");
app.use(cookieParser());
const __dirname = path.resolve();
app.use(cors({
  origin: "https://vibevideos.onrender.com", 
  credentials: true
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const MONGO_URI =
  "mongodb+srv://bibekjana68_db_user:jTIQGt3lk6XIKUWy@cluster0.l3xjsqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.use("/api/auth", Auth);
app.use("/api/channel", channnelRouter);
app.use("/api/video", videoRoutes);
app.get("/", (req, res) => {
  res.send("Hello, Express + Mongoose is working!");
});
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
