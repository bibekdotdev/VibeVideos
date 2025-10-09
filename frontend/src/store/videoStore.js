// store/videoStore.js
import { create } from "zustand";
import axiosInstance from "../lib/asios";

const useVideoStore = create((set, get) => ({
  video: null,

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
}));

export default useVideoStore;
