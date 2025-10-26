import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  X,
  Copy,
  Facebook,
  Twitter,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import RecommendedVideos from "../components/RecommendedVideos";
import CommentSection from "../components/CommentSection";
import useVideoStore from "../store/videoStore";

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getVideoDetailsById,
    toggleReaction,
    toggleSubscribe,
    toggleSaveVideo,
  } = useVideoStore();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [subCount, setSubCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      const fetchedVideo = await getVideoDetailsById(id);
      setVideo(fetchedVideo);

      if (fetchedVideo?.isSubscribed !== undefined)
        setSubscribed(fetchedVideo.isSubscribed);
      if (fetchedVideo?.userReaction)
        setUserReaction(fetchedVideo.userReaction);

      setSubCount(
        fetchedVideo?.detailsOfChannel?.[0]?.subscribers?.length ?? 0
      );
      console.log("is saved", fetchedVideo.istrue);
      setIsSaved(fetchedVideo?.istrue);

      setLoading(false);
    };
    fetchVideo();
  }, [id, getVideoDetailsById]);

  const handleSubscribeClick = async () => {
    if (!video?.detailsOfChannel?.[0]?._id) return;
    const channelId = video.detailsOfChannel[0]._id;

    setSubscribed(!subscribed);
    setSubCount((prev) => (subscribed ? Math.max(prev - 1, 0) : prev + 1));

    try {
      await toggleSubscribe(channelId);
    } catch (err) {
      console.error("Subscription error:", err);
      setSubscribed(subscribed);
      setSubCount((prev) => (subscribed ? prev + 1 : prev - 1));
    }
  };

  const handleReaction = async (type) => {
    if (!video) return;

    let newLikes = video.likes ?? 0;
    let newDislikes = video.dislikes ?? 0;

    if (userReaction === type) {
      if (type === "like") newLikes = Math.max(newLikes - 1, 0);
      else newDislikes = Math.max(newDislikes - 1, 0);
      setUserReaction(null);
    } else {
      if (type === "like") {
        newLikes += 1;
        if (userReaction === "dislike")
          newDislikes = Math.max(newDislikes - 1, 0);
      } else {
        newDislikes += 1;
        if (userReaction === "like") newLikes = Math.max(newLikes - 1, 0);
      }
      setUserReaction(type);
    }

    video.likes = newLikes;
    video.dislikes = newDislikes;

    try {
      await toggleReaction(video._id, type);
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleSaveVideo = async () => {
    if (!video?._id) return;
    setIsSaved(!isSaved);
    try {
      await toggleSaveVideo(video._id);
      toast.success(
        !isSaved
          ? "Video saved to your list!"
          : "Video removed from saved list!"
      );
    } catch (err) {
      console.error("Save video error:", err);
      setIsSaved(isSaved); // revert on error
      toast.error("Something went wrong while saving video!");
    }
  };

  const handleShareVideo = () => {
    setShareOpen((prev) => !prev);
  };

  const handleCopyLink = () => {
    const videoLink = `${window.location.origin}/video/${video._id}`;
    navigator.clipboard.writeText(videoLink);
    toast.info("Video link copied to clipboard!");
  };

  if (loading || !video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse text-lg">Loading video...</p>
      </div>
    );
  }

  const channel = video.detailsOfChannel?.[0] || {};

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-12 py-4 bg-black min-h-screen text-white relative">
      <div className="flex-1 flex flex-col gap-6 bg-black">
        <CustomVideoPlayer video={video} className="w-full" />

        <div className="flex flex-col gap-1">
          <h1 className="text-sm sm:text-sm md:text-base font-bold break-words break-all whitespace-normal">
            {video.title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-sm md:text-base mt-1 break-words break-all whitespace-normal">
            {video.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <button
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium ${
              userReaction === "like"
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <ThumbsUp size={16} /> {video.likes ?? 0}
          </button>

          <button
            onClick={() => handleReaction("dislike")}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium ${
              userReaction === "dislike"
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <ThumbsDown size={16} /> {video.dislikes ?? 0}
          </button>

          <button
            onClick={handleSaveVideo}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium ${
              isSaved
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Bookmark size={16} />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {channel && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-gray-900 rounded-xl">
            <img
              src={channel.logoUrl}
              alt={channel.name}
              onClick={() => navigate(`/channel/${channel._id}`)}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-700 cursor-pointer hover:opacity-80 transition"
            />
            <div className="flex-1 flex flex-col min-w-0 max-w-190">
              <p
                className="font-semibold text-sm sm:text-base md:text-lg truncate"
                style={{ maxWidth: "100%" }}
                title={channel.name}
              >
                {channel.name}
              </p>

              <p
                className="text-gray-400 text-xs sm:text-sm md:text-base truncate"
                style={{ maxWidth: "100%" }}
                title={`${subCount} subscribers`}
              >
                {subCount} subscribers
              </p>
            </div>

            <button
              onClick={handleSubscribeClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`px-4 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm md:text-sm ${
                subscribed
                  ? hovered
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {subscribed
                ? hovered
                  ? "Unsubscribe"
                  : "Subscribed"
                : "Subscribe"}
            </button>
          </div>
        )}

        <CommentSection videoId={video._id} />
      </div>

      <RecommendedVideos videoId={video._id} />
    </div>
  );
};

export default VideoDetails;
