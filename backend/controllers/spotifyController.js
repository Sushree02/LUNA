import { searchTracks, getMoodSongs } from "../services/spotifyService.js";

/* 🔍 SEARCH */
export const searchSpotify = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const tracks = await searchTracks(q);
    res.json(tracks);
  } catch (error) {
    console.error(
      "❌ Spotify search error:",
      error.code || error.message
    );

    // frontend expects array
    res.status(500).json([]);
  }
};

/* 🎭 MOOD */
export const getMoodSongsController = async (req, res) => {
  try {
    const { mood } = req.params;
    if (!mood) return res.json([]);

    const songs = await getMoodSongs(mood);
    res.json(songs);
  } catch (error) {
    console.error(
      `❌ Mood error (${req.params.mood}):`,
      error.code || error.message
    );

    // IMPORTANT: always return array
    res.status(500).json([]);
  }
};
