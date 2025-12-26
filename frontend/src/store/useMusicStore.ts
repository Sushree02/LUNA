import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

/* ================= TYPES ================= */

interface MusicStore {
  // Playback
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  // Queue
  queue: Song[];
  currentIndex: number;

  // YouTube cache
  songVideoIds: Record<string, string>;
  setSongVideoId: (songId: string, videoId: string) => void;

  // Libraries
  libraries: Library[];
  currentLibrary: Library | null;

  // Search
  searchQuery: string;
  searchResults: Song[];

  // Mood
  moodBlocks: MoodBlock[];
  isLoading: boolean;

  // Player actions
  setCurrentSong: (song: Song, queue?: Song[], index?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;

  // Like
  toggleLike: (song: Song) => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;

  // Mood actions
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
  isLiked: song.isLiked ?? false,
});

/* ================= STORE ================= */

export const useMusicStore = create<MusicStore>((set, get) => {
  const favoritesLibrary: Library = {
    id: "favorites",
    name: "Favorites",
    songs: [],
    createdAt: new Date(),
  };

  return {
    /* ===== STATE ===== */

    currentSong: null,
    isPlaying: false,
    progress: 0,

    queue: [],
    currentIndex: 0,

    songVideoIds: {},

    libraries: [favoritesLibrary],
    currentLibrary: favoritesLibrary,

    searchQuery: "",
    searchResults: [],

    moodBlocks: [],
    isLoading: false,

    /* ===== PLAYER (FIXED) ===== */

    setCurrentSong: (song, queue, index) => {
      set((state) => {
        // If queue + index provided (Search / Mood click)
        if (queue && typeof index === "number") {
          return {
            currentSong: song,
            queue,
            currentIndex: index,
            progress: 0,
            isPlaying: true,
          };
        }

        // Otherwise keep existing queue (Next / Previous safety)
        const existingIndex = state.queue.findIndex(
          (s) => s.id === song.id
        );

        return {
          currentSong: song,
          currentIndex:
            existingIndex !== -1 ? existingIndex : state.currentIndex,
          progress: 0,
          isPlaying: true,
        };
      });
    },

    playNext: () =>
      set((state) => {
        if (!state.queue.length) return state;

        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.queue.length) return state;

        return {
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          progress: 0,
          isPlaying: true,
        };
      }),

    playPrevious: () =>
      set((state) => {
        if (!state.queue.length) return state;

        const prevIndex = state.currentIndex - 1;
        if (prevIndex < 0) return state;

        return {
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
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

    /* ===== LIKE ===== */

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
