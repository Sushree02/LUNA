import { create } from "zustand";
import type { Song, MoodBlock, Library } from "@/types";
import { searchSpotify } from "@/api/spotifyApi";

interface MusicStore {
  // Playback
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;

  // Libraries (kept simple for now)
  libraries: Library[];
  currentLibrary: Library | null;

  // Search
  searchQuery: string;
  searchResults: Song[];

  // Mood
  moodBlocks: MoodBlock[];

  // Loading
  isLoading: boolean;

  // Actions
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;
  toggleLike: (songId: string) => void;

  setSearchQuery: (query: string) => void;
  performSearch: () => Promise<void>;

  loadMoodBlocks: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  // ───────────────── INITIAL STATE ─────────────────
  currentSong: null,
  isPlaying: false,
  progress: 0,

  libraries: [],
  currentLibrary: null,

  searchQuery: "",
  searchResults: [],

  moodBlocks: [],
  isLoading: true,

  // ───────────────── PLAYBACK ─────────────────
  setCurrentSong: (song) =>
    set({ currentSong: song, isPlaying: true, progress: 0 }),

  togglePlayPause: () =>
    set((state) => ({ isPlaying: !state.isPlaying })),

  setProgress: (progress) => set({ progress }),

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
    };
  }),


  // ───────────────── SEARCH ─────────────────
  setSearchQuery: (query) => set({ searchQuery: query }),

  performSearch: async () => {
    const query = get().searchQuery.trim();

    if (!query) {
      set({ searchResults: [] });
      return;
    }

    try {
      // backend already returns Song[]
      const songs: Song[] = await searchSpotify(query);
      set({ searchResults: songs });
    } catch (error) {
      console.error("❌ Search failed:", error);
      set({ searchResults: [] });
    }
  },

  /// -------------------- MOOD --------------------
loadMoodBlocks: async () => {
  try {
    set({ isLoading: true });

    const moods = ["chill", "happy", "sad", "focus"];

    const moodBlocks: MoodBlock[] = await Promise.all(
      moods.map(async (mood) => {
        const res = await fetch(
          `http://localhost:5000/api/spotify/mood/${mood}`
        );

        const songs: Song[] = await res.json();

        return {
          mood,
          title: mood.toUpperCase(),
          songs,
        };
      })
    );

    set({ moodBlocks, isLoading: false });
  } catch (error) {
    console.error("Failed to load mood blocks", error);
    set({ moodBlocks: [], isLoading: false });
  }
},


}));
