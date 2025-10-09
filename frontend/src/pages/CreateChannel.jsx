import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import { Upload, PlusCircle, Image, Camera } from "lucide-react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import manageChannelStore from "../store/manageChannelStore";

const CreateChannel = ({ onCreated = () => {} }) => {
  // ✅ Default function to avoid error
  const { createChannel } = manageChannelStore();
  const navigate = useNavigate(); // ✅ Initialized navigate

  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [channelLogo, setChannelLogo] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
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

        navigate("/my-channel"); // ✅ Redirect after success
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Box className="flex justify-center items-center py-10 px-4 bg-black min-h-screen">
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
        {/* 🔹 Banner Upload */}
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

          {/* Hover overlay */}
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
          {/* 🔹 Logo Upload */}
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

              {/* Hover overlay */}
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

          {/* 🔹 Title */}
          <Box display="flex" alignItems="center" gap={1} mt={4} mb={3}>
            <PlusCircle size={26} className="text-red-500" />
            <Typography variant="h5" fontWeight="bold">
              Create Your Channel
            </Typography>
          </Box>

          {/* 🔹 Form */}
          <form onSubmit={handleCreateChannel} className="space-y-5">
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
            <br />
            <br />

            {/* Channel Description */}
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

            {/* Submit Button */}
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
