import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vibe-videos-c53m.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
