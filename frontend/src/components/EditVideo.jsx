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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import manageChannelStore from "../store/manageChannelStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { myVideo, updateVideoInfo } = manageChannelStore();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const video = await myVideo(id);
        if (video) {
          setTitle(video.title);
          setDesc(video.description);
          setVisibility(video.visibility);
          setExistingVideoUrl(video.videoUrl);
          setExistingThumbnailUrl(video.thumbnailUrl || "");
          setThumbnailPreview(video.thumbnailUrl || "");
        } else {
          toast.error("Video not found.");
          navigate("/channel-manager");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch video data.");
        navigate("/channel-manager");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, myVideo, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleUpdate = async () => {
    if (!title) return toast.error("Title is required");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("visibility", visibility);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      await updateVideoInfo(id, formData, (percent) => setProgress(percent));

      toast.success("Video updated successfully!");
      navigate("/channelmanager");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update video.");
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <CircularProgress style={{ color: "red" }} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Video</h1>

      <Card className="w-full max-w-2xl bg-black border border-gray-800 rounded-xl shadow-lg">
        <CardContent className="flex flex-col gap-4 bg-black">
          {/* Video Preview */}
          {existingVideoUrl && (
            <div className="bg-gray-900 p-4 rounded-lg">
              <video
                src={existingVideoUrl}
                controls
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="text-sm mt-2 text-gray-300 text-center">
                Current video
              </p>
            </div>
          )}

          {thumbnailPreview && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-gray-300 mb-1">Thumbnail Preview:</p>
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-40 h-24 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mt-4 flex flex-col items-center">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
              <p className="text-gray-400 mb-2 text-center">Update Thumbnail</p>
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
            </div>
          </div>

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
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={uploading || !title}
            onClick={handleUpdate}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                Updating...
              </>
            ) : (
              "Update Video"
            )}
          </Button>

          {uploading && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                "& .MuiLinearProgress-bar": { backgroundColor: "red" },
                backgroundColor: "gray",
                mt: 2,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVideo;
