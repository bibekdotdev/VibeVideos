import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useVideoStore from "../store/videoStore";

const Home = () => {
  const { fetchallvideos, allvideos } = useVideoStore();
  const [videos, setVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getVideos = async () => {
      try {
        setIsLoading(true);
        await fetchallvideos();

        if (Array.isArray(allvideos)) {
          setVideos(allvideos);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setIsLoading(false);
      }
    };
    getVideos();
  }, []);

  useEffect(() => {
    if (Array.isArray(allvideos)) {
      setVideos(allvideos);
      setIsLoading(false);
    }
  }, [allvideos]);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="bg-black min-h-screen text-white w-full">
      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-red-500 text-lg font-semibold">
              Loading videos...
            </p>
          </div>
        </div>
      ) : videos.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-center`}
        >
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden hover:scale-[1.03] transition-transform cursor-pointer border border-red-600/30 w-full"
              onMouseEnter={() => setHoveredVideo(video._id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => handleVideoClick(video._id)}
            >
              {/* Thumbnail / Hover Video */}
              <div className="h-48 sm:h-52 lg:h-56 bg-gray-800 overflow-hidden relative w-full">
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
                <h3 className="font-semibold text-lg truncate text-white">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {video.description}
                </p>

                {/* Channel Info */}
                {video.detailsOfChannel && (
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={video.detailsOfChannel.logoUrl}
                      alt="Channel Logo"
                      className="h-8 w-8 rounded-full border-2 border-red-600 cursor-pointer hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChannelClick(video.detailsOfChannel._id);
                      }}
                    />
                    <p
                      className="text-sm text-gray-400 hover:text-red-500 truncate cursor-pointer"
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
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen w-full">
          <p className="text-center text-red-500 text-xl font-semibold">
            No videos found
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
