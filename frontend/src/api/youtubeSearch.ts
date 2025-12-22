// frontend/src/api/youtubeSearch.ts

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function searchYouTubeVideo(query: string) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
      query
    )}&key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.items?.length) return null;

  return {
    videoId: data.items[0].id.videoId,
    title: data.items[0].snippet.title,
  };
}
