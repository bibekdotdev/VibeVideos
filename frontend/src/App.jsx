import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import MainRoute from "./routes/MainRoute";
import { Drawer, IconButton } from "@mui/material";
import { Menu } from "lucide-react"; // ✅ Updated icon
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Navbar */}
        <Nav />

        {/* 🔹 Filters + 3-line hamburger icon */}
        <div className="flex items-center justify-between px-4 py-2 bg-black shadow-md sticky top-0 z-40 border-b border-gray-700">
          {/* Left: Hamburger button */}
          <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
            <Menu size={24} />
          </IconButton>

          {/* Center: Filters */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {["All", "Music", "Gaming", "Coding", "News", "Sports"].map(
              (cat, i) => (
                <button
                  key={i}
                  className="px-4 py-1 bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-700 whitespace-nowrap text-white"
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* 🔹 Sidebar Drawer */}
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

        {/* Content area */}
        <div className="flex flex-1">
          <main className="flex-1 overflow-y-auto p-4 bg-black text-white">
            <MainRoute />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toasts */}
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </Router>
  );
};

export default App;
