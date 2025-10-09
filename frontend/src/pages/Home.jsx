import React from "react";

const Home = () => {
  const videos = [
    {
      id: 1,
      title: "My First Video",
      channel: "Demo Channel",
      views: "10K views",
      time: "2 days ago",
    },
    {
      id: 2,
      title: "React Tutorial",
      channel: "Code World",
      views: "55K views",
      time: "1 week ago",
    },
    {
      id: 3,
      title: "Tailwind UI Clone",
      channel: "UI Master",
      views: "20K views",
      time: "3 days ago",
    },
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform"
        >
          <div className="h-48 bg-gray-300 flex items-center justify-center">
            🎬 Video
          </div>
          <div className="p-3">
            <h3 className="font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-600">{video.channel}</p>
            <p className="text-xs text-gray-500">
              {video.views} • {video.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
