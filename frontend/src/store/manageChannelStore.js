import { create } from "zustand";
import axiosInstance from "../lib/asios";

const manageChannelStore = create((set, get) => ({
  isChannel: false,
  channelData: null,

 
  createChannel: async (formData) => {
    try {
      const response = await axiosInstance.post("/channel/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ isChannel: true, channelData: response.data.channel });
      return response.data;
    } catch (error) {
      console.error("Channel creation failed:", error);
      throw error;
    }
  },


  myChannel: async () => {
    try {
      const response = await axiosInstance.get("/channel/my");
      set({ isChannel: true, channelData: response.data.channel });
      return response.data;
    } catch (error) {
      console.error("Fetching my channel failed:", error);
      throw error;
    }
  },
  updateChannel: async (formData) => {
    try {
      const response = await axiosInstance.put(
        "/channel/updatechannel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set({ isChannel: true, channelData: response.data.channel });
      return response.data;
    } catch (error) {
      console.error("Channel creation failed:", error);
      throw error;
    }
  },
  myVideos: async () => {
    console.log("hi i am bibek jana");
    const data = await axiosInstance.get("/video/myvideos");
    return data.data.videos;
  },

  deleteVideo: async (_id) => {
    const data = await axiosInstance.delete(`/video/deletevideo/${_id}`);
  },

  myVideo: async (id) => {
    try {
      const res = await axiosInstance.get(`/video/my-video/${id}`);
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      return [];
    }
  },
  updateVideoInfo: async (id, formData, onUploadProgress) => {
    try {
      await axiosInstance.put(`/video/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percent = Math.round(progressEvent.loaded * 100);
            onUploadProgress(percent);
          }
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getsubscriptionsdetails: async () => {
    const data = await axiosInstance.get("/channel/subscriptions");
    return data.data;
  },
  getChannelDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/channel/${id}`);
      set({ isChannel: true, channelData: response.data.channel });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Fetching my channel failed:", error);
      throw error;
    }
  },

  getChannelVideos: async (id) => {
    console.log("hi i am bibek jana", id);
    const data = await axiosInstance.get(`/video/${id}`);
    console.log("hi ", data.data.videos);
    return data.data.videos;
  },
}));

export default manageChannelStore;
