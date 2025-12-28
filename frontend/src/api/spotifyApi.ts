import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/spotify`;

export const searchSpotify = async (query: string) => {
  const res = await axios.get(`${API_BASE}/search?q=${query}`);
  return res.data;
};
