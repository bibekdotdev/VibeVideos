import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import manageChannelStore from "../store/manageChannelStore";
import MyChannel from "./MyChannel";
import CreateChannel from "./CreateChannel";

const ChannelManager = () => {
  const { myChannel } = manageChannelStore();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await myChannel();
        console.log("MyChannel Response:", res);

        if (res.success && res.channel) {
      
          setChannel({
            id: res.channel._id,
            name: res.channel.name,
            desc: res.channel.desc,
            logo: res.channel.logoUrl,
            banner: res.channel.bannerUrl,
            subscriberCount: res.channel.subscriberCount,
          });
        } else {
          
          navigate("/create-channel");
        }
      } catch (error) {
        console.error("Error fetching channel:", error);
        navigate("/create-channel");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [myChannel, navigate]);

  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-ping"></div>
        </div>
        <p className="mt-6 text-lg font-semibold tracking-widest animate-pulse">
          Loading your channel...
        </p>
      </div>
    );
  }

  return (
    <div>{channel ? <MyChannel channel={channel} /> : <CreateChannel />}</div>
  );
};

export default ChannelManager;
