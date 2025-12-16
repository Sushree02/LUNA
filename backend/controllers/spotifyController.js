import { searchTracks, getMoodSongs } from "../services/spotifyService.js";

// 🔍 SEARCH
export const searchSpotify = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const tracks = await searchTracks(q);
    res.json(tracks);
  } catch (error) {
    console.error("❌ Spotify search error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
};

// 🎭 MOOD
export const getMoodSongsController = async (req, res) => {
  try {
    const { mood } = req.params;
    const songs = await getMoodSongs(mood);
    res.json(songs);
  } catch (error) {
    console.error("❌ Mood error:", error.message);
    res.status(500).json({ error: "Mood fetch failed" });
  }
};




