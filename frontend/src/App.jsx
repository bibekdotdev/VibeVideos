import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useState } from "react";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MainRoute from "./routes/MainRoute";
import { Drawer, IconButton } from "@mui/material";
import { Menu, Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import useVideoStore from "./store/videoStore";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

  const { searchVideos } = useVideoStore();

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const isHome = location.pathname === "/" || location.pathname === "/home";

 
  const handleSearchOrFilter = (value) => {
    if (value) {
      
      searchVideos(value);
    } else {
     
      searchVideos("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Nav />

    
      <div className="flex flex-col px-4 py-3 bg-black shadow-md sticky top-0 z-40 border-b border-gray-700 gap-3">
        <div className="flex items-center gap-3 ">
          <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
            <Menu size={24} />
          </IconButton>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {isHome && (
              <div className="flex gap-2 flex-nowrap">
                {[
                  "All",
                  "Music",
                  "Gaming",
                  "Coding",
                  "News",
                  "Sports",
                  "Movies",
                  "Technology",
                  "Education",
                  "Travel",
                  "Food",
                  "Health",
                  "Science",
                  "Finance",
                  "Fashion",
                ].map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchOrFilter(cat)}
                    className="px-4 py-1 bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-700 whitespace-nowrap text-white"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

       
        {isHome && (
          <div className="flex items-center bg-[#111] border border-red-600 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-red-500 transition w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value),
                  handleSearchOrFilter(e.target.value);
              }}
              className="w-full bg-transparent text-white px-4 py-2 outline-none placeholder-gray-400 text-sm"
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearchOrFilter(e.target.value)
              } 
            />
            <button
              onClick={() => handleSearchOrFilter(searchText)}
              className="bg-red-600 px-4 py-2 flex items-center justify-center hover:bg-red-700 transition"
            >
              <Search className="text-white" size={20} />
            </button>
          </div>
        )}
      </div>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { backgroundColor: "#000", color: "#fff", width: 240 },
        }}
      >
        <Sidebar />
      </Drawer>

      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto p-4 bg-black text-white">
          <MainRoute />
        </main>
      </div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </Router>
  );
};

export default App;
