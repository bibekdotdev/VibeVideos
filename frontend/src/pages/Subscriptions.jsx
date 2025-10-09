import React, { useEffect, useState } from "react";
import manageChannelStore from "../store/manageChannelStore";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const { getsubscriptionsdetails } = manageChannelStore();
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getsubscriptionsdetails();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-black text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-red-500">
        Your Subscriptions
      </h1>

      {subscriptions.subscriptions && subscriptions.subscriptions.length > 0 ? (
        <div className="space-y-10">
          {subscriptions.subscriptions.map((channel) => {
            // Filter videos for this channel
            const channelVideos =
              subscriptions.videos?.filter(
                (video) =>
                  video.uploadedBy === channel.owner ||
                  video.channelId?._id === channel._id
              ) || [];

            return (
              <div key={channel._id}>
                {/* Channel Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={channel.logoUrl}
                    alt={channel.name}
                    className="w-16 h-16 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/channel/${channel._id}`)}
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{channel.name}</h2>
                  </div>
                </div>

                {/* Channel Videos */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {channelVideos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-gray-900 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-red-600/50 transition"
                      onClick={() => navigate(`/video/${video._id}`)}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
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
                        <div className="flex-1">
                          <h3 className="text-md font-semibold line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-3">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">
          You haven’t subscribed to any channels yet.
        </p>
      )}
    </div>
  );
};

export default Subscriptions;
