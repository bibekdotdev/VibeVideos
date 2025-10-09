import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import manageChannelStore from "../store/manageChannelStore";
import useVideoStore from "../store/videoStore";

const ChannelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getChannelDetails, getChannelVideos } = manageChannelStore();
  const { toggleSubscribe } = useVideoStore();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const channelRes = await getChannelDetails(id);
        const videosRes = await getChannelVideos(id);

        setChannel(channelRes?.channel || null);
        setVideos(videosRes || []);
        setSubscribed(channelRes?.channel?.isSubscribed || false);
      } catch (err) {
        console.error("Error fetching channel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id, getChannelDetails, getChannelVideos]);

  const handleSubscribeClick = async () => {
    if (!channel?._id) return;

    try {
      const res = await toggleSubscribe(channel._id);

      // Toggle subscribed state
      setSubscribed(res.isSubscribed);

      // Update subscriber count
      setChannel((prev) => ({
        ...prev,
        subscriberCount: res.isSubscribed
          ? prev.subscriberCount + 1
          : prev.subscriberCount - 1,
      }));
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading Channel...
      </div>
    );

  if (!channel)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-xl">
        Channel not found.
      </div>
    );

  return (
    <Box className="bg-black min-h-screen text-white">
      {/* Banner Section */}
      <Box
        className="relative w-full bg-gray-900"
        sx={{ height: { xs: 60, sm: 120, md: 240 } }}
      >
        {channel.bannerUrl ? (
          <img
            src={channel.bannerUrl}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Banner Available
          </div>
        )}
      </Box>

      {/* Channel Header */}
      <Box className="flex flex-col sm:flex-row items-start sm:items-end justify-between px-6 py-6 border-b border-gray-800 space-y-4 sm:space-y-0 sm:space-x-6">
        <Box className="flex items-center space-x-4 w-full">
          <Avatar
            src={channel.logoUrl}
            alt={channel.name}
            sx={{ width: 100, height: 100, border: "3px solid white" }}
          />
          <Box className="flex-1 min-w-0">
            {/* Channel Name */}
            <Typography
              variant="h6"
              className="text-base sm:text-lg md:text-xl font-semibold truncate"
              style={{ maxWidth: "700px" }}
              title={channel.name}
            >
              {channel.name}
            </Typography>

            {/* Channel Description */}
            <Typography
              variant="body2"
              className="text-gray-400 text-sm sm:text-base line-clamp-2"
              style={{ maxWidth: "800px" }}
              title={channel.desc}
            >
              {channel.desc || "No description provided"}
            </Typography>

            {/* Subscriber Count */}
            <Typography variant="body2" className="text-gray-500 mt-1">
              {channel.subscriberCount || 0} subscribers
            </Typography>

            {/* Subscribe Button (works on all screen sizes) */}
            <button
              onClick={handleSubscribeClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`mt-2 px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm md:text-sm ${
                subscribed
                  ? hovered
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {subscribed
                ? hovered
                  ? "Unsubscribe"
                  : "Subscribed"
                : "Subscribe"}
            </button>
          </Box>
        </Box>
      </Box>

      {/* Videos Section */}
      <Box className="px-6 py-8">
        <Typography variant="h6" className="text-white mb-6 font-semibold">
          Videos
        </Typography>

        {videos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-900 overflow-hidden group cursor-pointer hover:shadow-red-500/40 transition"
                onClick={() => navigate(`/video/${video._id}`)}
              >
                {/* Thumbnail with hover video */}
                <div className="relative w-full h-48">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <video
                    src={video.videoUrl}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    muted
                    loop
                    autoPlay
                  />
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-bold text-sm sm:text-base truncate text-gray-200 group-hover:text-white transition">
                    {video.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No videos available.</p>
        )}
      </Box>
    </Box>
  );
};

export default ChannelDetails;
