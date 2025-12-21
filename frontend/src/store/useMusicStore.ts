import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  queue: Song[];
  currentIndex: number;

  libraries: Library[];
  currentLibrary: Library | null;

  searchQuery: string;
  searchResults: Song[];

  moodBlocks: MoodBlock[];
  isLoading: boolean;

  setCurrentSong: (song: Song, queue?: Song[], index?: number) => void;
  setProgress: (progress: number) => void;

  playNext: () => void;
  playPrevious: () => void;

  toggleLike: (song: Song) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  loadMoodBlocks: () => Promise<void>;
}

/* 🔑 Normalize song */
const normalizeSong = (song: Song): Song => ({
  id: song.id,
  title: song.title ?? song.name ?? "Unknown title",
  artist:
    song.artist ??
    song.artists?.map((a) => a.name).join(", ") ??
    "Unknown artist",
  cover: song.cover ?? song.albumData?.images?.[0]?.url ?? "",
  duration: song.duration ?? 0,
  isLiked: true,
});

/* ✅ CREATE STORE */
export const musicStore = create<MusicStore>((set, get) => {
  const favoritesLibrary: Library = {
    id: "favorites",
    name: "Favorites",
    songs: [],
    createdAt: new Date(),
  };

  return {
    /* ================= STATE ================= */

    currentSong: null,
    isPlaying: false,
    progress: 0,

    queue: [],
    currentIndex: 0,

    libraries: [favoritesLibrary],
    currentLibrary: favoritesLibrary,

    searchQuery: "",
    searchResults: [],

    moodBlocks: [],
    isLoading: false,

    /* ================= PLAYER ================= */

    setCurrentSong: (song, queue = [song], index = 0) =>
      set({
        currentSong: song,
        queue,
        currentIndex: index,
        progress: 0,
      }),

    setProgress: (progress) => set({ progress }),

    /* ================= NEXT / PREVIOUS ================= */

    playNext: () =>
      set((state) => {
        if (!state.queue.length) return state;

        const nextIndex =
          state.currentIndex + 1 < state.queue.length
            ? state.currentIndex + 1
            : 0;

        return {
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          progress: 0,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (!state.queue.length) return state;

        const prevIndex =
          state.currentIndex > 0
            ? state.currentIndex - 1
            : state.queue.length - 1;

        return {
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
          progress: 0,
        };
      }),

    /* ================= LIKE ================= */

    toggleLike: (song) =>
      set((state) => {
        const willLike = !song.isLiked;
        const normalized = normalizeSong(song);

        const toggle = (s: Song) =>
          s.id === song.id ? { ...s, isLiked: willLike } : s;

        return {
          currentSong:
            state.currentSong?.id === song.id
              ? toggle(state.currentSong)
              : state.currentSong,

          searchResults: state.searchResults.map(toggle),

          moodBlocks: state.moodBlocks.map((block) => ({
            ...block,
            songs: block.songs.map(toggle),
          })),

          libraries: state.libraries.map((lib) =>
            lib.id !== "favorites"
              ? lib
              : willLike
              ? lib.songs.some((s) => s.id === song.id)
                ? lib
                : { ...lib, songs: [...lib.songs, normalized] }
              : {
                  ...lib,
                  songs: lib.songs.filter((s) => s.id !== song.id),
                }
          ),
        };
      }),

    /* ================= SEARCH ================= */

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

    /* ================= MOODS ================= */

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

/* ✅ EXPORT HOOK */
export const useMusicStore = musicStore;

/* 🔥 EXPOSE STORE INSTANCE (CRITICAL) */
if (typeof window !== "undefined") {
  (window as any).__musicStore = musicStore;
}
