import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="block">
      <div className="rounded-lg shadow-md overflow-hidden bg-white hover:scale-105 transition">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-40 object-cover"
        />
        <div className="p-3">
          <h3 className="font-bold line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.channel}</p>
          <p className="text-xs text-gray-500">
            {video.views} views • {video.date}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
