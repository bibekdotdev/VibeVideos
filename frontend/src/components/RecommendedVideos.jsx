import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useVideoStore from "../store/videoStore";

const RecommendedVideos = ({ videoId }) => {
  const { callrecommendedvideos } = useVideoStore();
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await callrecommendedvideos(videoId);
        setRecommendedVideos(data);
      } catch (err) {
        console.error("Error fetching recommended videos:", err);
      }
    };

    if (videoId) fetchData();
  }, [videoId, callrecommendedvideos]);

  return (
    <div className="w-full lg:w-96 flex-shrink-0">
      <h2 className="font-semibold mb-4 text-lg">Up Next</h2>

      {recommendedVideos.length === 0 ? (
        <p className="text-gray-400 text-sm">No recommendations available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recommendedVideos.map((video) => (
            <div
              key={video._id}
              onClick={() => navigate(`/video/${video._id}`)}
              className="flex flex-col lg:flex-row gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition"
            >
              {/* Video Thumbnail */}
              <div className="w-full lg:w-40 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnailUrl} // Use thumbnailUrl from backend
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Video Info */}
              <div className="flex flex-col justify-between overflow-hidden">
                <p className="text-sm font-semibold line-clamp-2 break-words">
                  {video.title}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 break-words">
                  {video.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {video.views?.length || 0} views
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedVideos;
