import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, PlusCircle, Image, Camera, Loader2 } from "lucide-react"; 
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

const CreateChannel = ({ onCreated = () => {} }) => {
  const { createChannel } = manageChannelStore();
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); 

      const formData = new FormData();
      formData.append("name", channelName);
      formData.append("desc", channelDesc);
      formData.append("logo", channelLogo);
      formData.append("banner", channelBanner);

      const res = await createChannel(formData);
      console.log("CreateChannel Response:", res);

      if (res.success) {
        onCreated({
          id: res.channel._id,
          name: res.channel.name,
          desc: res.channel.desc,
          logo: res.channel.logoUrl,
          banner: res.channel.bannerUrl,
        });

       
        setTimeout(() => navigate("/my-channel"), 800);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      setLoading(false);
    }
  };

  return (
    <Box className="relative flex justify-center items-center py-10 px-4 bg-black min-h-screen p-4">
    
      {loading && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
          <Typography variant="h6" className="text-white font-semibold">
            Creating your channel...
          </Typography>
        </div>
      )}

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
          opacity: loading ? 0.5 : 1, 
          pointerEvents: loading ? "none" : "auto", 
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
                src={channelLogo ? URL.createObjectURL(channelLogo) : ""}
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: "#222",
                  fontSize: 40,
                }}
              >
                {!channelLogo && <Image size={32} />}
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
            <PlusCircle size={26} className="text-red-500" />
            <Typography variant="h5" fontWeight="bold">
              Create Your Channel
            </Typography>
          </Box>

          <form onSubmit={handleCreateChannel} className="space-y-5">
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
            <br />
            <br />
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
              startIcon={<Upload />}
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
            >
              Create Channel
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateChannel;
