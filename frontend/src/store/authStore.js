import { create } from "zustand";
import axiosInstance from "../lib/asios";

const useAuthStore = create((set, get) => ({
  isSignin: false,

  signupRequest: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/signin", userData);
      set({ isSignin: true });
      return response.data;
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
    }
  },

  issingin: () => get().isSignin,

  signoutRequest: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ isSignin: false });
    } catch (error) {
      console.error("Signout failed:", error);
      throw error;
    }
  },
}));

export default useAuthStore;
