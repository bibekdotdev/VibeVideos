import { useEffect, useState } from "react";
import useVideoStore from "../store/videoStore";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Play } from "lucide-react";

const SavedVideos = () => {
  const { fetchSavedVideos } = useVideoStore();
  const navigate = useNavigate();
  const [savedVideos, setSavedVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videos = await fetchSavedVideos();
        setSavedVideos(videos || []);
      } catch (error) {
        console.error("Error fetching saved videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchSavedVideos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <CircularProgress style={{ color: "red" }} />
      </div>
    );
  }

  if (!savedVideos || savedVideos.length === 0) {
    return (
      <p className="text-white p-4 text-center text-lg">No saved videos yet.</p>
    );
  }

  return (
    <div className="bg-black min-h-screen p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Saved Videos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedVideos.map((video) => (
          <div
            key={video._id}
            className="group bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-red-600 transition-all"
            onMouseEnter={() => setHoveredVideo(video._id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => navigate(`/video/${video._id}`)}
          >
         
            <div className="relative w-full h-60">
              {hoveredVideo === video._id ? (
                <>
                  <video
                    src={video.videoUrl}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={48} className="text-white opacity-80" />
                  </div>
                </>
              ) : (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            
            <div className="flex p-3 gap-3">
         
              <img
                src={video.detailsOfChannel?.logoUrl || "/default-logo.png"}
                alt={video.detailsOfChannel?.name || "Channel Logo"}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); 
                  navigate(`/channel/${video.detailsOfChannel?._id}`);
                }}
              />

              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <h3
                  className="text-white font-semibold text-base truncate hover:underline"
                  title={video.title}
                >
                  {video.title}
                </h3>
                <p
                  className="text-gray-400 text-sm truncate"
                  title={video.detailsOfChannel?.name || "Unknown Channel"}
                >
                  {video.detailsOfChannel?.name || "Unknown Channel"}
                </p>
                <p className="text-gray-500 text-sm">
                  {(video.views || 0).toLocaleString()} views
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedVideos;
