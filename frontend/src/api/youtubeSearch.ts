const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function searchYouTubeVideo(query: string): Promise<string | null> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  return data.items[0].id.videoId; // ✅ STRING ONLY
}
