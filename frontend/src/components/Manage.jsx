import React from "react";

const Manage = () => {
  return (
    <div className="p-4">
     
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-4">
        {["All", "Music", "Gaming", "Coding", "News", "Sports"].map(
          (cat, i) => (
            <button
              key={i}
              className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
            >
              {cat}
            </button>
          )
        )}
      </div>

     
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Upload a Video</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            className="w-full border p-2 rounded-md"
          />
          <textarea
            placeholder="Video Description"
            className="w-full border p-2 rounded-md"
          />
          <input type="file" className="w-full border p-2 rounded-md" />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Upload
          </button>
        </form>
      </div>

    
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Your Videos</h3>
        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
          <span>My First Video</span>
          <button className="p-2 hover:bg-gray-200 rounded-full">⋮</button>
        </div>
      </div>
    </div>
  );
};

export default Manage;
