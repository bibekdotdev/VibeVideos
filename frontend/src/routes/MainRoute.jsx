import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import VideoPage from "../pages/VideoPage";
import ChannelManager from "../pages/ChannelManager";
import Authentication from "../components/Authentication";
import useAuthStore from "../store/authStore";
import CreateChannel from "../pages/CreateChannel";
import MyChannel from "../pages/MyChannel";
import UploadVideo from "../components/UploadVideo";
import ManageChannel from "../pages/ManageChannel";
import VideoDetails from "../pages/VideoDetails";
import EditVideo from "../components/EditVideo";
import Subscriptions from "../pages/Subscriptions";
import ChannelPage from "../pages/ChannelDetails";
import ChannelDetails from "../pages/ChannelDetails";
import SavedVideos from "../pages/SavedVideos";

function MainRoute() {
  const { issingin } = useAuthStore();
  const isSignin = issingin();
  console.log(isSignin);

  return (
    <Routes>
      {isSignin ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/channelmanager" element={<ChannelManager />} />
          <Route path="/create-channel" element={<CreateChannel />} />
          <Route path="my-channel" element={<MyChannel />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/manage-channel" element={<ManageChannel />} />
          <Route path="/video/:id" element={<VideoDetails />} />
          <Route path="/edit-video/:id" element={<EditVideo />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/channel/:id" element={<ChannelDetails />} />
          <Route path="/saved" element={<SavedVideos />} />
        </>
      ) : (
        <Route path="*" element={<Authentication />} />
      )}
    </Routes>
  );
}

export default MainRoute;
