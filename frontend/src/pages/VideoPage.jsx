import { useParams } from "react-router-dom";
import { useState } from "react";
import CommentSection from "../components/CommentSection";

const demoVideos = {
  1: {
    title: "Learn React in 10 Minutes",
    channel: "CodeMaster",
    views: "1.2M",
    date: "1 year ago",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  2: {
    title: "Tailwind CSS Crash Course",
    channel: "DesignPro",
    views: "950K",
    date: "6 months ago",
    src: "https://www.w3schools.com/html/movie.mp4",
  },
};

const VideoPage = () => {
  const { id } = useParams();
  const video = demoVideos[id];
  const [subscribed, setSubscribed] = useState(false);
  const [likes, setLikes] = useState(123);

  return (
    <div>
      <video controls className="w-full rounded-lg shadow-md mb-4">
        <source src={video.src} type="video/mp4" />
      </video>
      <h2 className="text-2xl font-bold">{video.title}</h2>
      <p className="text-gray-600">
        {video.views} views • {video.date}
      </p>

      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={() => setLikes(likes + 1)}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          👍 {likes}
        </button>
        <button
          onClick={() => setSubscribed(!subscribed)}
          className={`px-4 py-2 rounded-lg ${
            subscribed ? "bg-gray-500" : "bg-red-600 text-white"
          }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <CommentSection />
    </div>
  );
};

export default VideoPage;
