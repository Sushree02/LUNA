import axios from "axios";

const API_BASE = "https://luna-zd51.onrender.com/api/spotify";

export const searchSpotify = async (query: string) => {
  const res = await axios.get(`${API_BASE}/search?q=${query}`);
  return res.data;
};
