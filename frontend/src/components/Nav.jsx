import { useEffect, useState } from "react";
import { Search, X, User } from "lucide-react"; // ✅ Imported User icon
import manageChannelStore from "../store/manageChannelStore";

const Nav = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { channelData } = manageChannelStore();
  useEffect(() => {
    console.log("HI", channelData);
  });
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-black shadow-lg sticky top-0 z-50 border-b border-red-600/40">
      {/* Logo */}
      <h1 className="text-xl md:text-2xl font-extrabold text-red-600 tracking-wide hover:scale-105 transition-transform cursor-pointer">
        YouTube
      </h1>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center w-1/2 bg-[#111] border border-red-600 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition group">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-transparent text-white px-4 py-2 outline-none placeholder-gray-400 group-hover:placeholder-red-400"
        />
        <button className="bg-red-600 px-5 py-2 flex items-center justify-center hover:bg-red-700 transition">
          <Search className="text-white" size={20} />
        </button>
      </div>

      {/* Mobile Search */}
      <div className="flex items-center gap-3 md:hidden">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="text-red-600 hover:text-red-500 transition"
          >
            <Search size={24} />
          </button>
        ) : (
          <div className="flex items-center bg-[#111] border border-red-600 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition w-52 sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-white px-3 py-2 outline-none placeholder-gray-400 text-sm"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="bg-red-600 px-3 py-2 flex items-center justify-center hover:bg-red-700 transition"
            >
              <X className="text-white" size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Profile / Logo */}
      <div className="hidden md:flex items-center gap-4">
        {channelData?.logoUrl ? (
          <img
            src={channelData.logoUrl}
            alt="profile"
            className="w-9 h-9 rounded-full border-2 border-red-600 cursor-pointer hover:scale-105 transition"
          />
        ) : (
          <User className="w-9 h-9 text-red-600 border-2 border-red-600 rounded-full p-1 cursor-pointer hover:scale-105 transition" />
        )}
      </div>
    </div>
  );
};

export default Nav;
