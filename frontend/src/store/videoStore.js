// store/videoStore.js
import { create } from "zustand";
import axiosInstance from "../lib/asios";

const useVideoStore = create((set, get) => ({
  video: null,
  allvideos: null,
  loding: false,
  getVideoDetailsById: async (id) => {
    try {
      const res = await axiosInstance.get(`/video/getVideo/${id}`);
      const video = res.data;
      set({
        video: {
          ...video,
          likes: video.likes?.length || 0,
          dislikes: video.dislikes?.length || 0,
        },
      });

      return get().video;
    } catch (err) {
      console.error("Error fetching video details:", err);
    }
  },

  toggleReaction: async (id, reaction) => {
    try {
      const res = await axiosInstance.put(`/video/${id}/reaction`, {
        reaction,
      });

      // update state with new counts
      set((state) => ({
        video: {
          ...state.video,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        },
      }));
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  },
  addcomment: async (videoId, commentData) => {
    const res = await axiosInstance.post(`/video/${videoId}/addcomment`, {
      text: commentData.text,
    });
    return res.data;
  },
  fetchcomment: async (videoId) => {
    const res = await axiosInstance.get(`/video/${videoId}/fetchcomment`);
    return res.data;
  },

  toggleSubscribe: async (channelId) => {
    const res = await axiosInstance.post(`/video/${channelId}/subscribe`);
    return res.data;
  },
  callrecommendedvideos: async (videoId) => {
    const res = await axiosInstance.get(
      `/video/${videoId}/callrecommendedvideos`
    );
    return res.data;
  },
  fetchallvideos: async () => {
    const res = await axiosInstance.get("/video/home/fetchallvideos");
    set({ allvideos: res.data.videos });
    return true;
  },

  searchVideos: async (value) => {
    try {
      console.log("Searching videos…");

      // 1️⃣ If no value, fetch all videos
      if (!value || value.trim() === "") {
        return get().fetchallvideos();
      }

      // 2️⃣ Call backend search route
      const res = await axiosInstance.get(
        `/video/searchvideos/${encodeURIComponent(value)}`
      );

      // 3️⃣ Log and update state
      console.log("Search results:", res.data.videos);
      set({ allvideos: res.data.videos });
    } catch (err) {
      console.error(
        "Error searching videos:",
        err.response?.data || err.message
      );
    }
  },
}));

export default useVideoStore;
