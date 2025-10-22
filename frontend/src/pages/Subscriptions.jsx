import React, { useEffect, useState } from "react";
import manageChannelStore from "../store/manageChannelStore";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Subscriptions = () => {
  const { getsubscriptionsdetails } = manageChannelStore();
  const [subscriptions, setSubscriptions] = useState({
    subscriptions: [],
    videos: [],
  });
  const [hoveredVideo, setHoveredVideo] = useState(null); // Track which video is hovered
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getsubscriptionsdetails();
        setSubscriptions(data || { subscriptions: [], videos: [] });
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getsubscriptionsdetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <CircularProgress style={{ color: "red" }} />
      </div>
    );
  }

  // Collect all videos from all subscribed channels
  const allVideos = subscriptions.videos || [];

  return (
    <div className="flex-1 bg-black text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-red-500">
        Your Subscriptions
      </h1>

      {/* Top Bar — Channel Logos */}
      {subscriptions.subscriptions && subscriptions.subscriptions.length > 0 ? (
        <>
          <div className="flex overflow-x-auto space-x-6 mb-10 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {subscriptions.subscriptions.map((channel) => (
              <div
                key={channel._id}
                className="flex flex-col items-center cursor-pointer min-w-[70px]"
                onClick={() => navigate(`/channel/${channel._id}`)}
              >
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  className="w-16 h-16 rounded-full object-cover hover:scale-110 transition"
                />
                <p className="text-sm text-gray-300 mt-2 truncate w-16 text-center">
                  {channel.name}
                </p>
              </div>
            ))}
          </div>

          {/* All Videos from Subscribed Channels */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.length > 0 ? (
              allVideos.map((video) => {
                const channel =
                  subscriptions.subscriptions.find(
                    (ch) =>
                      ch.owner === video.uploadedBy ||
                      ch._id === video.channelId?._id
                  ) || {};

                return (
                  <div
                    key={video._id}
                    className="bg-gray-900 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-red-600/50 transition"
                    onClick={() => navigate(`/video/${video._id}`)}
                    onMouseEnter={() => setHoveredVideo(video._id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                  >
                    {/* Thumbnail or Preview Video */}
                    <div className="relative w-full h-48 bg-black">
                      {hoveredVideo === video._id ? (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 flex gap-3">
                      <img
                        src={channel.logoUrl}
                        alt={channel.name}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent video click
                          navigate(`/channel/${channel._id}`);
                        }}
                      />

                      <div className="flex-1 overflow-hidden">
                        {/* Title */}
                        <h3
                          className="text-md font-semibold text-white 
                          line-clamp-1 overflow-hidden text-ellipsis"
                          title={video.title}
                        >
                          {video.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-gray-400 text-sm mt-1 
                          line-clamp-2 overflow-hidden text-ellipsis"
                          title={video.description}
                        >
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 col-span-full text-center">
                No videos available from your subscribed channels.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-400">
          You haven’t subscribed to any channels yet.
        </p>
      )}
    </div>
  );
};

export default Subscriptions;
