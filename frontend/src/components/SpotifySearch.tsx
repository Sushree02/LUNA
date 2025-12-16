import { useState } from "react";
import { searchSpotify } from "../api/spotifyApi";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
};

const SpotifySearch = () => {
  const [query, setQuery] = useState<string>("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchSpotify(query);

      // 🔥 IMPORTANT: extract correct Spotify response
      const items: SpotifyTrack[] = data?.tracks?.items || [];

      setTracks(items);
    } catch (err) {
      setError("Failed to fetch Spotify results");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎧 Spotify Search</h2>

      <input
        placeholder="Search song or artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && tracks.length === 0 && query && (
        <p>No results found</p>
      )}

      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <b>{track.name}</b> — {track.artists[0]?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifySearch;