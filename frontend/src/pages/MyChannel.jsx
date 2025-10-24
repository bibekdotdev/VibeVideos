import {
  Upload,
  Settings,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useEffect, useState, useRef } from "react";
import manageChannelStore from "../store/manageChannelStore";
import { useNavigate } from "react-router-dom";

const MyChannel = () => {
  const [tab, setTab] = useState(0);
  const { myChannel, myVideos, deleteVideo } = manageChannelStore();
  const [channelData, setChannelData] = useState(null);
  const [myvideos, setmyvideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await myChannel();
      setChannelData(data);
    };
    fetchData();
  }, [myChannel]);

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await myVideos();
      setmyvideos(data);
    };
    fetchVideos();
  }, [myVideos]);

  const handleTabChange = (e, newValue) => setTab(newValue);
  const redirectUploadPage = () => navigate("/upload");
  const channel = channelData?.channel;

  const VideoCard = ({ video }) => {
    const videoRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (e) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleEdit = (e) => {
      e.stopPropagation();
      navigate(`/edit-video/${video._id}`);
      handleMenuClose();
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      setOpenDeleteDialog(true);
      handleMenuClose();
    };

    const confirmDelete = async () => {
      try {
        await deleteVideo(video._id);
        setmyvideos(myvideos.filter((v) => v._id !== video._id));
      } catch (err) {
        console.error("Error deleting video:", err);
        alert("Failed to delete the video. Please try again.");
      } finally {
        setOpenDeleteDialog(false);
      }
    };

    const cancelDelete = () => setOpenDeleteDialog(false);

    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    };
    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    const handleCardClick = () => navigate(`/video/${video._id}`);

    return (
      <>
        <Card
          className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden
                     hover:scale-105 hover:shadow-red-900/40 transition-all duration-300 cursor-pointer
                     w-full sm:w-full md:w-auto"
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group w-full">
            <img
              src={video.thumbnailUrl || ""}
              alt={video.title}
              className="w-full h-48 sm:h-48 md:h-52 lg:h-56 object-cover group-hover:opacity-0 transition duration-300"
            />
            <video
              ref={videoRef}
              src={video.videoUrl}
              muted
              playsInline
              className="w-full h-48 sm:h-48 md:h-52 lg:h-56 object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-300"
            />

            <Chip
              label={new Date(video.uploadedAt).toLocaleDateString()}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "white",
                fontSize: "0.7rem",
                borderRadius: "6px",
              }}
            />

            <Button
              onClick={handleMenuClick}
              onMouseDown={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                minWidth: 0,
                padding: "4px",
                color: "white",
                zIndex: 20,
              }}
            >
              <MoreVertical />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  backgroundColor: "#111",
                  color: "white",
                  minWidth: 120,
                  "& .MuiMenuItem-root": {
                    "&:hover": { backgroundColor: "#222" },
                  },
                },
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </div>

          <CardContent className="space-y-2 bg-gray-900">
            <h3 className="font-bold text-sm sm:text-base truncate text-gray-200 group-hover:text-white transition">
              {video.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
              {video.description}
            </p>

            <div className="flex items-center justify-between text-gray-400 text-xs sm:text-sm pt-2 border-t border-gray-800">
              <div className="flex items-center space-x-4">
                <Tooltip title="Likes">
                  <div className="flex items-center space-x-1 hover:text-white transition cursor-pointer">
                    <ThumbsUp size={14} />
                    <span>{video?.likes?.length ?? 0}</span>
                  </div>
                </Tooltip>
                <Tooltip title="Dislikes">
                  <div className="flex items-center space-x-1 hover:text-white transition cursor-pointer">
                    <ThumbsDown size={14} />
                    <span>{video?.dislikes?.length ?? 0}</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <DialogTitle>Delete Video</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>{video.title}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="inherit">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center">

      <div className="w-full relative">
        <img
          src={channel?.bannerUrl || ""}
          alt="Channel Banner"
          className="w-full h-40 sm:h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 flex items-end space-x-3 sm:space-x-4 w-[90%] sm:w-[80%] md:w-[70%] overflow-hidden">
          <Avatar
            src={channel?.logoUrl || ""}
            alt="Channel Logo"
            sx={{
              width: { xs: 56, sm: 72, md: 100 },
              height: { xs: 56, sm: 72, md: 100 },
              border: "3px solid white",
              boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
            }}
          />
          <div className="pb-2 w-full overflow-hidden">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold truncate">
              {channel?.name || "Unnamed Channel"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 truncate">
              {channel?.desc || "No description available"}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {channel?.subscriberCount ?? 0} subscribers • {myvideos.length}{" "}
              videos
            </p>
          </div>
        </div>
      </div>

      
      <div className="w-full px-4 sm:px-6 md:px-10 mt-20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          TabIndicatorProps={{ style: { background: "red" } }}
          sx={{
            "& .MuiTab-root": {
              color: "white",
              fontWeight: "bold",
              fontSize: "0.8rem",
            },
            "& .Mui-selected": { color: "red" },
          }}
        >
          <Tab label="Videos" />
          <Tab label="About" />
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
          <Button
            variant="contained"
            startIcon={<Upload size={16} />}
            onClick={redirectUploadPage}
            sx={{
              background: "linear-gradient(90deg, #ef4444, #b91c1c)",
              "&:hover": {
                background: "linear-gradient(90deg, #dc2626, #991b1b)",
              },
              borderRadius: "9999px",
              textTransform: "none",
              fontWeight: "bold",
              px: 2,
              py: 1,
              fontSize: "0.8rem",
            }}
          >
            Upload Video
          </Button>

          <Button
            variant="outlined"
            startIcon={<Settings size={16} />}
            onClick={() => navigate("/manage-channel")}
            sx={{
              color: "white",
              borderColor: "gray",
              textTransform: "none",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              "&:hover": { borderColor: "white" },
            }}
          >
            Manage Channel
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 0 && (
        <div className="w-full px-4 sm:px-6 md:px-10 mt-8 sm:mt-10">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            All Videos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {myvideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="w-full px-4 sm:px-6 md:px-10 mt-8 sm:mt-10 text-gray-400">
          <h3 className="text-base sm:text-lg font-semibold mb-4">About</h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed break-words line-clamp-4 md:line-clamp-none">
            {channel?.desc || "No description available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyChannel;
