import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

/* ================= LOCAL STORAGE KEYS ================= */

const FAVORITES_KEY = "luna_favorites";
const LAST_PLAYED_KEY = "luna_last_played";
const VIDEO_IDS_KEY = "luna_song_video_ids";
export const PLAYBACK_POSITION_KEY = "luna_playback_position";

/* ================= HELPERS ================= */

const loadJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/* ================= TYPES ================= */

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  queue: Song[];
  currentIndex: number;

  songVideoIds: Record<string, string>;
  setSongVideoId: (songId: string, videoId: string) => void;

  libraries: Library[];
  currentLibrary: Library | null;

  searchQuery: string;
  searchResults: Song[];

  moodBlocks: MoodBlock[];
  isLoading: boolean;

  setCurrentSong: (song: Song, queue?: Song[], index?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;

  toggleLike: (song: Song) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;

  loadMoodBlocks: () => Promise<void>;
}

/* ================= NORMALIZER ================= */

const normalizeSong = (song: Song): Song => ({
  ...song,
  id: song.id ?? crypto.randomUUID(),
  title: song.title ?? song.name ?? "Unknown title",
  artist:
    typeof song.artist === "string"
      ? song.artist
      : song.artists?.map((a) => a.name).join(", ") ?? "Unknown artist",
  cover: song.cover ?? song.albumData?.images?.[0]?.url ?? "",
  duration: song.duration ?? 0,
  isLiked: true,
});

/* ================= STORE ================= */

export const useMusicStore = create<MusicStore>((set, get) => {
  /* 🔁 Restore persisted data */
  const favoriteSongs = loadJSON<Song[]>(FAVORITES_KEY, []);
  const lastPlayed = loadJSON<Song | null>(LAST_PLAYED_KEY, null);
  const savedProgress = loadJSON<number>(PLAYBACK_POSITION_KEY, 0);
  const videoIdCache = loadJSON<Record<string, string>>(VIDEO_IDS_KEY, {});

  const favoritesLibrary: Library = {
    id: "favorites",
    name: "Favorites",
    songs: favoriteSongs,
    createdAt: new Date(),
  };

  return {
    /* ===== STATE ===== */

    currentSong: lastPlayed,
    isPlaying: false,
    progress: savedProgress,

    queue: lastPlayed ? [lastPlayed] : [],
    currentIndex: 0,

    songVideoIds: videoIdCache,

    libraries: [favoritesLibrary],
    currentLibrary: favoritesLibrary,

    searchQuery: "",
    searchResults: [],

    moodBlocks: [],
    isLoading: false,

    /* ===== PLAYER ===== */

    setCurrentSong: (song, queue, index) => {
      saveJSON(LAST_PLAYED_KEY, song);
      saveJSON(PLAYBACK_POSITION_KEY, 0);

      set(() => {
        if (queue && typeof index === "number") {
          return {
            currentSong: song,
            queue,
            currentIndex: index,
            progress: 0,
            isPlaying: true,
          };
        }

        return {
          currentSong: song,
          queue: [song],
          currentIndex: 0,
          progress: 0,
          isPlaying: true,
        };
      });
    },

    playNext: () =>
      set((state) => {
        if (state.currentIndex + 1 >= state.queue.length) return state;

        const nextSong = state.queue[state.currentIndex + 1];
        saveJSON(LAST_PLAYED_KEY, nextSong);
        saveJSON(PLAYBACK_POSITION_KEY, 0);

        return {
          currentIndex: state.currentIndex + 1,
          currentSong: nextSong,
          progress: 0,
          isPlaying: true,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (state.currentIndex - 1 < 0) return state;

        const prevSong = state.queue[state.currentIndex - 1];
        saveJSON(LAST_PLAYED_KEY, prevSong);
        saveJSON(PLAYBACK_POSITION_KEY, 0);

        return {
          currentIndex: state.currentIndex - 1,
          currentSong: prevSong,
          progress: 0,
          isPlaying: true,
        };
      }),

    togglePlayPause: () =>
      set((state) => ({ isPlaying: !state.isPlaying })),

    setProgress: (progress) => {
      saveJSON(PLAYBACK_POSITION_KEY, progress);
      set({ progress });
    },

    /* ===== 🎥 YOUTUBE VIDEO CACHE (FIXED) ===== */

    setSongVideoId: (songId, videoId) =>
      set((state) => {
        const updated = {
          ...state.songVideoIds,
          [songId]: videoId,
        };

        saveJSON(VIDEO_IDS_KEY, updated);

        return { songVideoIds: updated };
      }),

    /* ===== ❤️ LIKES ===== */

    toggleLike: (song) =>
      set((state) => {
        const favLib = state.libraries[0];
        const isLiked = favLib.songs.some((s) => s.id === song.id);

        const updatedSongs = isLiked
          ? favLib.songs.filter((s) => s.id !== song.id)
          : [...favLib.songs, normalizeSong(song)];

        saveJSON(FAVORITES_KEY, updatedSongs);

        return {
          libraries: [
            { ...favLib, songs: updatedSongs },
          ],
          currentSong:
            state.currentSong?.id === song.id
              ? { ...state.currentSong, isLiked: !isLiked }
              : state.currentSong,
        };
      }),

    /* ===== SEARCH ===== */

    setSearchQuery: (query) => set({ searchQuery: query }),

    performSearch: async () => {
      const query = get().searchQuery.trim();
      if (!query) return set({ searchResults: [] });

      try {
        const songs = await searchSpotify(query);
        set({ searchResults: songs });
      } catch {
        set({ searchResults: [] });
      }
    },

    /* ===== MOODS ===== */

    loadMoodBlocks: async () => {
      try {
        set({ isLoading: true });

        const moods = ["chill", "happy", "sad", "focus"];

        const moodBlocks = await Promise.all(
          moods.map(async (mood) => {
            const res = await fetch(
              `http://localhost:5000/api/spotify/mood/${mood}`
            );
            const songs = await res.json();
            return { mood, title: mood.toUpperCase(), songs };
          })
        );

        set({ moodBlocks, isLoading: false });
      } catch {
        set({ moodBlocks: [], isLoading: false });
      }
    },
  };
});
