import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Image, Camera, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import manageChannelStore from "../store/manageChannelStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageChannel = () => {
  const { myChannel, updateChannel, getChannelVideos } = manageChannelStore();
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);
  const [existingLogo, setExistingLogo] = useState("");
  const [existingBanner, setExistingBanner] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await myChannel();
        if (data?.channel) {
          setChannelName(data.channel.name);
          setChannelDesc(data.channel.desc);
          setExistingLogo(data.channel.logoUrl);
          setExistingBanner(data.channel.bannerUrl);

          // Fetch channel videos
          const channelVideos = await getChannelVideos(data.channel._id);
          setVideos(channelVideos || []);
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
        toast.error("Failed to fetch channel data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [myChannel, getChannelVideos]);


  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", channelName);
      formData.append("desc", channelDesc);
      if (channelLogo) formData.append("logo", channelLogo);
      if (channelBanner) formData.append("banner", channelBanner);

      const res = await updateChannel(formData);
      if (res.success) {
        toast.success("Channel updated successfully!");
        navigate("/channelmanager");
      } else {
        toast.error("Failed to update channel");
        setUpdating(false);
      }
    } catch (error) {
      console.error("Error updating channel:", error);
      toast.error("Error updating channel");
      setUpdating(false);
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
    <Box className="flex flex-col items-center py-10 px-4 bg-black min-h-screen">
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          borderRadius: "20px",
          background:
            "linear-gradient(145deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%)",
          color: "white",
          boxShadow: "0 8px 28px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}
      >
        
        <Box
          component="label"
          sx={{
            position: "relative",
            height: 220,
            backgroundColor: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            "&:hover .overlay": { opacity: 1 },
          }}
        >
          {channelBanner ? (
            <img
              src={URL.createObjectURL(channelBanner)}
              alt="Banner Preview"
              className="w-full h-full object-cover"
            />
          ) : existingBanner ? (
            <img
              src={existingBanner}
              alt="Current Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <Box className="flex flex-col items-center text-gray-400">
              <Upload size={34} />
              <Typography variant="body2">Click to upload banner</Typography>
            </Box>
          )}

          <Box className="overlay absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity opacity-0">
            <Camera size={40} />
          </Box>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setChannelBanner(e.target.files[0])}
          />
        </Box>

        <CardContent>
         
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={-10}
          >
            <Box
              component="label"
              sx={{
                position: "relative",
                cursor: "pointer",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid white",
                "&:hover .overlay": { opacity: 1 },
              }}
            >
              <Avatar
                src={
                  channelLogo
                    ? URL.createObjectURL(channelLogo)
                    : existingLogo || ""
                }
                sx={{ width: 110, height: 110, bgcolor: "#222", fontSize: 40 }}
              >
                {!channelLogo && !existingLogo && <Image size={32} />}
              </Avatar>

              <Box className="overlay absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity opacity-0">
                <Camera size={28} />
              </Box>

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setChannelLogo(e.target.files[0])}
              />
            </Box>
          </Box>

          
          <Box display="flex" alignItems="center" gap={1} mt={4} mb={3}>
            <Settings size={26} className="text-red-500" />
            <Typography variant="h5" fontWeight="bold">
              Manage Your Channel
            </Typography>
          </Box>

         
          <form onSubmit={handleUpdateChannel} className="space-y-5">
            {/* Channel Name */}
            <TextField
              fullWidth
              label="Channel Name"
              variant="outlined"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#f87171" },
                  "&.Mui-focused fieldset": { borderColor: "#ef4444" },
                },
              }}
            />

           <br/><br/>
            <TextField
              fullWidth
              label="Channel Description"
              variant="outlined"
              multiline
              rows={3}
              value={channelDesc}
              onChange={(e) => setChannelDesc(e.target.value)}
              required
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#f87171" },
                  "&.Mui-focused fieldset": { borderColor: "#ef4444" },
                },
              }}
            />

          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={
                updating ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <Upload />
                )
              }
              sx={{
                mt: 3,
                background:
                  "linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(185,28,28,1) 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, rgba(220,38,38,1) 0%, rgba(153,27,27,1) 100%)",
                },
                borderRadius: "9999px",
                fontWeight: "bold",
                py: 1.5,
              }}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Channel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageChannel;
