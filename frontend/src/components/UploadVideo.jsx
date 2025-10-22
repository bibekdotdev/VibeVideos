import { Upload } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  LinearProgress,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/asios";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => setVideoFile(e.target.files[0]);
  const handleThumbnailChange = (e) => setThumbnailFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!videoFile) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("video", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("visibility", visibility);

    try {
      const response = await axiosInstance.post("/video/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
        withCredentials: true,
      });

      console.log("Video uploaded:", response.data);

      // ✅ Show success animation for 1s, then redirect
      setTimeout(() => {
        navigate("/channelmanager");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      <Card className="w-full max-w-2xl bg-black border border-gray-800 rounded-xl shadow-lg">
        <CardContent className="flex flex-col gap-4 bg-black">
          {/* Video Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
            <Upload size={48} className="text-red-500 mb-2" />
            <p className="text-gray-400 mb-2 text-center">
              Drag and drop your video here or
            </p>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "white",
                borderColor: "gray",
                textTransform: "none",
                borderRadius: "9999px",
                "&:hover": { borderColor: "red" },
              }}
            >
              Browse Video
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="video/*"
              />
            </Button>
            {videoFile && (
              <p className="text-sm mt-2 text-gray-300 truncate text-center">
                {videoFile.name}
              </p>
            )}
          </div>

          {/* Video Preview */}
          {videoFile && (
            <div className="bg-gray-900 p-4 rounded-lg">
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}

          {/* Thumbnail Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
            <p className="text-gray-400 mb-2 text-center">Upload Thumbnail</p>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "white",
                borderColor: "gray",
                textTransform: "none",
                borderRadius: "9999px",
                "&:hover": { borderColor: "red" },
              }}
            >
              Browse Thumbnail
              <input
                type="file"
                hidden
                onChange={handleThumbnailChange}
                accept="image/*"
              />
            </Button>
            {thumbnailFile && (
              <div className="mt-2 flex flex-col items-center">
                <p className="text-sm text-gray-300 truncate text-center">
                  {thumbnailFile.name}
                </p>
                <div className="mt-2 w-40 h-24 overflow-hidden rounded-lg">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "gray" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "gray" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
            }}
          />

          {/* Visibility */}
          <FormControl fullWidth>
            <InputLabel sx={{ color: "gray" }}>Visibility</InputLabel>
            <Select
              value={visibility}
              label="Visibility"
              onChange={(e) => setVisibility(e.target.value)}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "red",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "red",
                },
                "& .MuiSelect-icon": { color: "gray" },
              }}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="unlisted">Unlisted</MenuItem>
            </Select>
          </FormControl>

          {/* Upload Button */}
          <Button
            variant="contained"
            disabled={uploading || !videoFile}
            onClick={handleUpload}
            startIcon={<Upload size={16} />}
            sx={{
              background: "linear-gradient(90deg, #ef4444, #b91c1c)",
              "&:hover": {
                background: "linear-gradient(90deg, #dc2626, #991b1b)",
              },
              borderRadius: "9999px",
              textTransform: "none",
              fontWeight: "bold",
              py: 1,
              fontSize: "0.8rem",
            }}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>

          {/* Progress Bar */}
          {uploading && (
            <Box className="mt-2 w-full">
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  "& .MuiLinearProgress-bar": { backgroundColor: "red" },
                  backgroundColor: "gray",
                  height: 8,
                  borderRadius: 4,
                }}
              />

              {/* Optional Spinner Overlay */}
              <Box className="absolute inset-0 flex items-center justify-center">
                <CircularProgress style={{ color: "red" }} />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadVideo;
