import axios from "axios";

const API_BASE = "http://localhost:5000/api/spotify";

export const searchSpotify = async (query: string) => {
  const res = await axios.get(`${API_BASE}/search?q=${query}`);
  return res.data;
};

