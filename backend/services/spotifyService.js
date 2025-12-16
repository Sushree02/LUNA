import axios from "axios";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

let accessToken = null;
let tokenExpiry = 0;

async function getSpotifyAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await axios.post(
    SPOTIFY_TOKEN_URL,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return accessToken;
}

// 🔍 SEARCH
export async function searchTracks(query) {
  const token = await getSpotifyAccessToken();

  const res = await axios.get(`${SPOTIFY_API_URL}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: query,
      type: "track",
      limit: 20,
    },
  });

  return res.data.tracks.items.map((t) => ({
    id: t.id,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    cover: t.album.images[0]?.url || "",
    duration: Math.floor(t.duration_ms / 1000),
    isLiked: false,
  }));
}

// 🎭 MOOD
export async function getMoodSongs(mood) {
  const token = await getSpotifyAccessToken();

  const moodQueries = {
    chill: "chill vibe",
    happy: "happy upbeat",
    sad: "sad acoustic",
    focus: "lofi focus",
  };

  const query = moodQueries[mood];
  if (!query) return [];

  const res = await axios.get(`${SPOTIFY_API_URL}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: query,
      type: "track",
      limit: 20,
    },
  });

  return res.data.tracks.items.map((t) => ({
    id: t.id,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    cover: t.album.images[0]?.url || "",
    duration: Math.floor(t.duration_ms / 1000),
    isLiked: false,
  }));
}