import axios from "axios";
import https from "https";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

/* 🔑 keep sockets alive */
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 5,
});

/* 🔑 axios instance with protection */
const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_URL,
  timeout: 10000, // ⛑ prevents ECONNRESET
  httpsAgent,
});

let accessToken = null;
let tokenExpiry = 0;

/* ================= TOKEN ================= */

async function getSpotifyAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
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
        timeout: 10000, // ⛑ token safety
        httpsAgent,
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error("❌ Spotify token error:", error.code || error.message);
    throw error;
  }
}

/* ================= SEARCH ================= */

export async function searchTracks(query) {
  try {
    const token = await getSpotifyAccessToken();

    const res = await spotifyApi.get("/search", {
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
  } catch (error) {
    console.error("❌ Spotify search error:", error.code || error.message);
    return []; // ⛑ never crash frontend
  }
}

/* ================= MOOD ================= */

export async function getMoodSongs(mood) {
  try {
    const token = await getSpotifyAccessToken();

    const moodQueries = {
      chill: "chill vibe",
      happy: "happy upbeat",
      sad: "sad acoustic",
      focus: "lofi focus",
    };

    const query = moodQueries[mood];
    if (!query) return [];

    const res = await spotifyApi.get("/search", {
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
  } catch (error) {
    console.error(`❌ Mood error (${mood}):`, error.code || error.message);
    return []; // ⛑ NEVER ECONNRESET CRASH
  }
}
