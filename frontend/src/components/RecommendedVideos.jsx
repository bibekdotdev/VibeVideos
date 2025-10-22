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
        console.log(data);
        setRecommendedVideos(data);
      } catch (err) {
        console.error("Error fetching recommended videos:", err);
      }
    };

    if (videoId) fetchData();
  }, [videoId, callrecommendedvideos]);

  return (
    <div className="w-full lg:w-96 flex-shrink-0 text-white">
      <h2 className="font-semibold mb-4 text-lg">Up Next</h2>

      {recommendedVideos.length === 0 ? (
        <p className="text-gray-400 text-sm">No recommendations available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recommendedVideos.map((video) => {
            const channel = video.detailsOfChannel?.[0];
            return (
              <div
                key={video._id}
                onClick={() => navigate(`/video/${video._id}`)}
                className="flex flex-col lg:flex-row gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition"
              >
                {/* Video Thumbnail */}
                <div className="w-full lg:w-40 h-[250px] sm:h-[250px] lg:h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Video Info */}
                <div className="flex flex-col  overflow-hidden flex-1">
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={channel?.logoUrl || "/default-logo.png"}
                      alt={channel?.name || "Channel"}
                      className="w-6 h-6 rounded-full object-cover cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening video
                        navigate(`/channel/${channel?._id}`);
                      }}
                    />
                    <p className="text-sm font-semibold line-clamp-2 break-words">
                      {video.title}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 break-words mt-1">
                    {video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedVideos;
