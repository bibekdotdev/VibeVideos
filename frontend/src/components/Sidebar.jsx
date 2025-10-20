import {
  Home,
  Compass,
  Film,
  Filter,
  MoreHorizontal,
  Users,
  Bookmark, // add Bookmark icon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const { signOut, redirectToSignIn } = useClerk();
  const { signoutRequest } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      await signoutRequest();
      redirectToSignIn();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },

    {
      name: "Channel Manager",
      path: "/channelmanager",
      icon: <Film size={20} />,
    },

    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: <Users size={20} />,
    },
    {
      name: "Saved Videos", // new menu item
      path: "/saved",
      icon: <Bookmark size={20} />,
    },
  ];

  return (
    <div className="w-56 p-4 border-r border-gray-800 bg-black shadow-lg h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h2 className="text-xl font-extrabold mb-6 text-red-500 tracking-wide">
          MyTube
        </h2>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-red-600 text-white font-semibold shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-red-500"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section */}
      <button
        onClick={handleSignOut}
        className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 shadow-md hover:shadow-red-600/50 transition text-sm sm:text-base"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;
