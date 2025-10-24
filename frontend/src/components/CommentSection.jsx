import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import useVideoStore from "../store/videoStore";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { addcomment, fetchcomment } = useVideoStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await fetchcomment(videoId);
        setComments(fetchedComments.comments || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setLoading(false);
      }
    };

    if (videoId) loadComments();
  }, [videoId, fetchcomment]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      author: { _id: "temp", name: "You", logoUrl: "" },
    };

    const tempComment = {
      _id: Date.now(),
      ...commentData,
      createdAt: new Date(),
    };
    setComments([...comments, tempComment]);
    setNewComment("");

    try {
      setLoading(true);
      await addcomment(videoId, { text: commentData.text });
      setLoading(false);
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Try again.");
      setLoading(false);
    }
  };

  const handleAvatarClick = (authorId) => {
    if (!authorId) return;
    navigate(`/channel/${authorId}`);
  };

  return (
    <div className="mt-6 w-full mx-auto px-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Comments ({comments.length})</h3>

        <button
          className="lg:hidden flex items-center gap-1 text-red-600 font-semibold"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? (
            <>
              Hide <ChevronUp size={18} />
            </>
          ) : (
            <>
              Show <ChevronDown size={18} />
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border px-3 py-2 rounded-lg w-full break-words overflow-wrap-anywhere focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-full sm:w-auto mt-2 sm:mt-0"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      <ul
        className={`space-y-4 transition-all duration-300 ease-in-out ${
          showComments
            ? "max-h-screen opacity-100"
            : "max-h-0 overflow-hidden opacity-0 lg:max-h-screen lg:overflow-visible lg:opacity-100"
        }`}
      >
        {comments.length > 0 ? (
          comments.map((c) => (
            <li
              key={c._id}
              className="flex gap-3 border-b pb-3 last:border-b-0 break-words"
              style={{ overflowWrap: "anywhere" }}
            >
              {c.author.logoUrl ? (
                <img
                  src={c.author.logoUrl}
                  alt={c.author.name}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => handleAvatarClick(c.author._id)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              )}

              <div className="flex-1">
                <p className="font-semibold">{c.author.name}</p>
                <p
                  className="text-gray-300 break-words"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {c.text}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </ul>
    </div>
  );
};

export default CommentSection;
