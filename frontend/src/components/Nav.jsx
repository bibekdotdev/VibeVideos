import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import manageChannelStore from "../store/manageChannelStore";

const Nav = () => {
  const { myChannel } = manageChannelStore();
  const [channelData, setChannelData] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channeldata = await myChannel();
        setChannelData(channeldata.channel);
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };
    fetchChannel();
  }, []);


  const handleRedirect = () => {
    if (channelData?._id) {
      navigate(`/channelmanager`);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-black shadow-lg sticky top-0 z-50 border-b border-red-600/40">
      
      <h1 className="text-xl md:text-2xl font-extrabold text-red-600 tracking-wide hover:scale-105 transition-transform cursor-pointer">
        YouTube
      </h1>

      
      <div className="flex items-center gap-4">
        {channelData?.logoUrl ? (
          <img
            src={channelData.logoUrl}
            alt="profile"
            onClick={handleRedirect}
            className="w-9 h-9 rounded-full border-2 border-red-600 cursor-pointer hover:scale-105 transition"
          />
        ) : (
          <User
            onClick={handleRedirect}
            className="w-9 h-9 text-red-600 border-2 border-red-600 rounded-full p-1 cursor-pointer hover:scale-105 transition"
          />
        )}
      </div>
    </div>
  );
};

export default Nav;
