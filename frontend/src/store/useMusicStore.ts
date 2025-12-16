import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  // ✅ NEW (required for next/prev)
  queue: Song[];
  currentIndex: number;

  libraries: Library[];
  currentLibrary: Library | null;

  searchQuery: string;
  searchResults: Song[];

  moodBlocks: MoodBlock[];
  isLoading: boolean;

  setCurrentSong: (song: Song, queue?: Song[], index?: number) => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;
  toggleLike: (song: Song) => void;

  playNext: () => void;
  playPrevious: () => void;

  setCurrentLibrary: (library: Library) => void;
  createLibrary: (name: string) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  loadMoodBlocks: () => Promise<void>;
}

/* 🔑 Normalize song safely */
const normalizeSong = (song: Song): Song => ({
  id: song.id,
  title: song.title ?? song.name ?? "Unknown title",
  artist:
    song.artist ??
    song.artists?.map((a) => a.name).join(", ") ??
    "Unknown artist",
  cover: song.cover ?? song.albumData?.images?.[0]?.url ?? "",
  audioUrl: song.audioUrl ?? null,
  duration: song.duration,
  isLiked: true,
});

export const useMusicStore = create<MusicStore>((set, get) => {
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

    // ✅ NEW
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
        isPlaying: true,
        progress: 0,
      }),

    togglePlayPause: () =>
      set((state) => ({ isPlaying: !state.isPlaying })),

    setProgress: (progress) => set({ progress }),

    /* ================= NEXT / PREVIOUS ================= */

    playNext: () =>
      set((state) => {
        if (state.queue.length === 0) return state;

        const nextIndex =
          state.currentIndex + 1 < state.queue.length
            ? state.currentIndex + 1
            : 0;

        return {
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          isPlaying: true,
          progress: 0,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (state.queue.length === 0) return state;

        const prevIndex =
          state.currentIndex > 0
            ? state.currentIndex - 1
            : state.queue.length - 1;

        return {
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
          isPlaying: true,
          progress: 0,
        };
      }),

    /* ================= LIBRARIES ================= */

    setCurrentLibrary: (library) => set({ currentLibrary: library }),

    createLibrary: (name) =>
      set((state) => ({
        libraries: [
          ...state.libraries,
          {
            id: crypto.randomUUID(),
            name,
            songs: [],
            createdAt: new Date(),
          },
        ],
      })),

    /* ================= LIKE / FAVORITES ================= */

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
              : { ...lib, songs: lib.songs.filter((s) => s.id !== song.id) }
          ),
        };
      }),

    /* ================= SEARCH ================= */

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
