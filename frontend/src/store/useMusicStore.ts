import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

/* ================= LOCAL STORAGE ================= */

const FAVORITES_KEY = "luna_favorites";
const LAST_PLAYED_KEY = "luna_last_played";
export const PLAYBACK_POSITION_KEY = "luna_playback_position";

/* ---------- Favorites ---------- */

const loadFavorites = (): Song[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (songs: Song[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(songs));
};

/* ---------- Last Played ---------- */

const loadLastPlayed = (): Song | null => {
  try {
    const raw = localStorage.getItem(LAST_PLAYED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveLastPlayed = (song: Song) => {
  localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(song));
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

/* ================= HELPERS ================= */

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
  const favoriteSongs = loadFavorites();
  const lastPlayed = loadLastPlayed();

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
    progress: 0,

    queue: lastPlayed ? [lastPlayed] : [],
    currentIndex: 0,

    songVideoIds: {},

    libraries: [favoritesLibrary],
    currentLibrary: favoritesLibrary,

    searchQuery: "",
    searchResults: [],

    moodBlocks: [],
    isLoading: false,

    /* ===== PLAYER ===== */

    setCurrentSong: (song, queue, index) => {
      saveLastPlayed(song);

      set((state) => {
        if (queue && typeof index === "number") {
          return {
            currentSong: song,
            queue,
            currentIndex: index,
            progress: 0,
            isPlaying: true,
          };
        }

        const existingIndex = state.queue.findIndex(
          (s) => s.id === song.id
        );

        return {
          currentSong: song,
          currentIndex: existingIndex !== -1 ? existingIndex : 0,
          queue: existingIndex !== -1 ? state.queue : [song],
          progress: 0,
          isPlaying: true,
        };
      });
    },

    playNext: () =>
      set((state) => {
        if (!state.queue.length) return state;
        if (state.currentIndex + 1 >= state.queue.length) return state;

        const nextSong = state.queue[state.currentIndex + 1];
        saveLastPlayed(nextSong);

        return {
          currentIndex: state.currentIndex + 1,
          currentSong: nextSong,
          progress: 0,
          isPlaying: true,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (!state.queue.length) return state;
        if (state.currentIndex - 1 < 0) return state;

        const prevSong = state.queue[state.currentIndex - 1];
        saveLastPlayed(prevSong);

        return {
          currentIndex: state.currentIndex - 1,
          currentSong: prevSong,
          progress: 0,
          isPlaying: true,
        };
      }),

    togglePlayPause: () =>
      set((state) => ({ isPlaying: !state.isPlaying })),

    setProgress: (progress) => set({ progress }),

    /* ===== YOUTUBE CACHE ===== */

    setSongVideoId: (songId, videoId) =>
      set((state) => ({
        songVideoIds: {
          ...state.songVideoIds,
          [songId]: videoId,
        },
      })),

    /* ===== ❤️ LIKE (PERSISTENT) ===== */

    toggleLike: (song) =>
      set((state) => {
        const favLib = state.libraries.find(
          (l) => l.id === "favorites"
        )!;
        const isLiked = favLib.songs.some((s) => s.id === song.id);

        const updatedSongs = isLiked
          ? favLib.songs.filter((s) => s.id !== song.id)
          : [...favLib.songs, normalizeSong(song)];

        saveFavorites(updatedSongs);

        return {
          currentSong:
            state.currentSong?.id === song.id
              ? { ...state.currentSong, isLiked: !isLiked }
              : state.currentSong,

          searchResults: state.searchResults.map((s) =>
            s.id === song.id ? { ...s, isLiked: !isLiked } : s
          ),

          moodBlocks: state.moodBlocks.map((block) => ({
            ...block,
            songs: block.songs.map((s) =>
              s.id === song.id ? { ...s, isLiked: !isLiked } : s
            ),
          })),

          libraries: state.libraries.map((lib) =>
            lib.id === "favorites"
              ? { ...lib, songs: updatedSongs }
              : lib
          ),
        };
      }),

    /* ===== SEARCH ===== */

    setSearchQuery: (query) => set({ searchQuery: query }),

    performSearch: async () => {
      const query = get().searchQuery.trim();
      if (!query) {
        set({ searchResults: [] });
        return;
      }

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
