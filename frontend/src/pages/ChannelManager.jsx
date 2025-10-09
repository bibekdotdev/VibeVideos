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

  // Fetch my channel on mount
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await myChannel();
        console.log("MyChannel Response:", res);

        if (res.success && res.channel) {
          // ✅ Channel exists → show MyChannel
          setChannel({
            id: res.channel._id,
            name: res.channel.name,
            desc: res.channel.desc,
            logo: res.channel.logoUrl,
            banner: res.channel.bannerUrl,
            subscriberCount: res.channel.subscriberCount,
          });
        } else {
          // ❌ No channel → redirect to CreateChannel
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
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div >
      {channel ? <MyChannel channel={channel} /> : <CreateChannel />}
    </div>
  );
};

export default ChannelManager;
