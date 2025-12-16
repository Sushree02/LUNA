import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  libraries: Library[];
  currentLibrary: Library | null;

  searchQuery: string;
  searchResults: Song[];

  moodBlocks: MoodBlock[];
  isLoading: boolean;

  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;
  toggleLike: (song: Song) => void;

  setCurrentLibrary: (library: Library) => void;
  createLibrary: (name: string) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  loadMoodBlocks: () => Promise<void>;
}

/* 🔑 helper: normalize any song to APP format */
const normalizeSong = (song: Song): Song => ({
  id: song.id,
  title: song.title ?? song.name ?? "Unknown title",
  artist:
    song.artist ??
    song.artists?.map((a) => a.name).join(", ") ??
    "Unknown artist",
  cover:
    song.cover ??
    song.albumData?.images?.[0]?.url ??
    "",
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

    libraries: [favoritesLibrary],
    currentLibrary: favoritesLibrary,

    searchQuery: "",
    searchResults: [],

    moodBlocks: [],
    isLoading: false,

    /* ================= PLAYER ================= */

    setCurrentSong: (song) =>
      set({
        currentSong: song,
        isPlaying: true,
        progress: 0,
      }),

    togglePlayPause: () =>
      set((state) => ({ isPlaying: !state.isPlaying })),

    setProgress: (progress) => set({ progress }),

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

          libraries: state.libraries.map((lib) => {
            if (lib.id !== "favorites") return lib;

            if (willLike) {
              if (lib.songs.some((s) => s.id === song.id)) return lib;
              return {
                ...lib,
                songs: [...lib.songs, normalized],
              };
            }

            return {
              ...lib,
              songs: lib.songs.filter((s) => s.id !== song.id),
            };
          }),

          currentLibrary:
            state.currentLibrary?.id === "favorites"
              ? {
                  ...state.currentLibrary,
                  songs: willLike
                    ? [...state.currentLibrary.songs, normalized]
                    : state.currentLibrary.songs.filter(
                        (s) => s.id !== song.id
                      ),
                }
              : state.currentLibrary,
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
