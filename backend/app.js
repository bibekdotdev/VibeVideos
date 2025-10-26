const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const Auth = require("./routes/auth");
const videoRoutes = require("./routes/videoRoutes");
const channelRouter = require("./routes/channelRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(
  cors({
    origin: ["https://vibevideos.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const MONGO_URI =
  "mongodb+srv://bibekjana68_db_user:jTIQGt3lk6XIKUWy@cluster0.l3xjsqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use("/api/auth", Auth);
app.use("/api/channel", channelRouter);
app.use("/api/video", videoRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
