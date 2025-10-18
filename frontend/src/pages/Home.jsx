import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useVideoStore from "../store/videoStore";

const Home = () => {
  const { fetchallvideos, allvideos } = useVideoStore();
  const [videos, setVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null); // Track hovered video
  const navigate = useNavigate();

  useEffect(() => {
    const getVideos = async () => {
      try {
        await fetchallvideos();

        console.log(allvideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    getVideos();
  }, []);

  useEffect(() => {
    setVideos(allvideos || []);
  }, [allvideos]);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.length > 0 ? (
        videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            onMouseEnter={() => setHoveredVideo(video._id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            {/* Thumbnail / Hover Video */}
            <div className="h-48 bg-gray-200 overflow-hidden relative">
              {hoveredVideo === video._id ? (
                <video
                  src={video.videoUrl}
                  autoPlay
                  muted
                  loop
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Video Info */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 truncate">
                {video.title}
              </h3>
              <p className="text-sm text-gray-700 line-clamp-2">
                {video.description}
              </p>

              {/* Channel Info */}
              {video.detailsOfChannel && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={video.detailsOfChannel.logoUrl}
                    alt="Channel Logo"
                    className="h-8 w-8 rounded-full cursor-pointer hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleChannelClick(video.detailsOfChannel._id);
                    }}
                  />
                  <p
                    className="text-xs text-gray-600 truncate cursor-pointer hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChannelClick(video.detailsOfChannel._id);
                    }}
                  >
                    {video.detailsOfChannel.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3 text-gray-500">
          No videos available
        </p>
      )}
    </div>
  );
};

export default Home;
