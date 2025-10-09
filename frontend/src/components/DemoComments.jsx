import React, { useState } from "react";

const DemoComments = () => {
  const [comments, setComments] = useState([
    { id: 1, user: "Alice", text: "Great video!", date: "2025-09-21" },
    { id: 2, user: "Bob", text: "Nice work!", date: "2025-09-22" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: "Demo User",
      text: newComment,
      date: new Date().toLocaleDateString(),
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-3">Comments</h2>

      {/* Add Comment */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-gray-800 px-3 py-2 rounded-lg outline-none text-white placeholder-gray-400"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1 text-sm"
        >
          Post
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 bg-gray-900 p-3 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
              {c.user[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{c.user}</p>
              <p className="text-gray-300 text-sm">{c.text}</p>
              <p className="text-gray-500 text-xs">{c.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoComments;
