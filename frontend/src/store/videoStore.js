// store/videoStore.js
import { create } from "zustand";
import axiosInstance from "../lib/asios";

const useVideoStore = create((set, get) => ({
  video: null,
  allvideos: null,
  loding: false,
  isvideosaved: false,

  getVideoDetailsById: async (id) => {
    try {
      const res = await axiosInstance.get(`/video/getVideo/${id}`);
      const video = res.data;
      console.log("ho ", video.istrue);
      set({
        video: {
          ...video,
          likes: video.likes?.length || 0,
          dislikes: video.dislikes?.length || 0,
        },
      });
      set({ isvideosaved: video.istrue });
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

      if (!value || value.trim() === "") {
        return get().fetchallvideos();
      }
      const res = await axiosInstance.get(
        `/video/searchvideos/${encodeURIComponent(value)}`
      );
      console.log("Search results:", res.data.videos);
      set({ allvideos: res.data.videos });
    } catch (err) {
      console.error(
        "Error searching videos:",
        err.response?.data || err.message
      );
    }
  },
  fetchSavedVideos: async () => {
    try {
      const res = await axiosInstance.get("/video/saved/fetchvideos");
      return res.data.savedVideos;
    } catch (err) {
      console.error(err);
    }
  },
  toggleSaveVideo: async (videoId) => {
    try {
      await axiosInstance.put(`/video/save/${videoId}`);
      await get().fetchSavedVideos(); // update saved videos after saving
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useVideoStore;
