import { useEffect, useState } from "react";
import useVideoStore from "../store/videoStore";
import { useNavigate } from "react-router-dom";

const SavedVideos = () => {
  const { fetchSavedVideos } = useVideoStore();
  const navigate = useNavigate();
  const [savedVideos, setSavedVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const videos = await fetchSavedVideos();
      setSavedVideos(videos);
    };
    fetchData();
  }, [fetchSavedVideos]);

  if (!savedVideos)
    return <p className="text-white p-4">Loading saved videos...</p>;
  if (savedVideos.length === 0)
    return <p className="text-white p-4">No saved videos yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {savedVideos.map((video) => (
        <div
          key={video._id}
          className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer relative"
          onMouseEnter={() => setHoveredVideo(video._id)}
          onMouseLeave={() => setHoveredVideo(null)}
        >
          {/* Video Thumbnail / Hover */}
          <div onClick={() => navigate(`/video/${video._id}`)}>
            {hoveredVideo === video._id ? (
              <video
                src={video.videoUrl}
                autoPlay
                muted
                loop
                className="w-full h-40 object-cover"
              />
            ) : (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
            )}
          </div>

          {/* Video Info */}
          <div className="p-2 flex gap-2 items-start">
            {/* Channel Logo */}
            <img
              src={video.detailsOfChannel?.logoUrl || "/default-logo.png"}
              alt={video.detailsOfChannel?.name || "Channel Logo"}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              onClick={() =>
                navigate(`/channel/${video.detailsOfChannel?._id}`)
              }
            />

            {/* Title + Channel Name + Views */}
            <div className="flex flex-col">
              <h3
                className="text-white font-semibold text-sm truncate cursor-pointer"
                onClick={() => navigate(`/video/${video._id}`)}
              >
                {video.title}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {video.detailsOfChannel?.name || "Unknown Channel"}
              </p>
              <p className="text-gray-500 text-xs">
                {video.views.toLocaleString()} views
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedVideos;
