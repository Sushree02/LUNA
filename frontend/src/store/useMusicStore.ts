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
  toggleLike: (songId: string) => void;

  setCurrentLibrary: (library: Library) => void;
  createLibrary: (name: string) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  loadMoodBlocks: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,

  libraries: [
    {
      id: "favorites",
      name: "Favorites",
      songs: [],
      createdAt: new Date()
    },
  ],
  currentLibrary: null,

  searchQuery: "",
  searchResults: [],

  moodBlocks: [],
  isLoading: false,

  setCurrentSong: (song) =>
    set({ currentSong: song, isPlaying: true, progress: 0 }),

  togglePlayPause: () =>
    set((state) => ({ isPlaying: !state.isPlaying })),

  setProgress: (progress) => set({ progress }),

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

  toggleLike: (songId) =>
    set((state) => {
      const toggle = (song: Song) =>
        song.id === songId
          ? { ...song, isLiked: !song.isLiked }
          : song;

      return {
        currentSong:
          state.currentSong?.id === songId
            ? toggle(state.currentSong)
            : state.currentSong,

        searchResults: state.searchResults.map(toggle),

        moodBlocks: state.moodBlocks.map((block) => ({
          ...block,
          songs: block.songs.map(toggle),
        })),

        libraries: state.libraries.map((lib) => ({
          ...lib,
          songs: lib.songs.map(toggle),
        })),
      };
    }),

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
}));
