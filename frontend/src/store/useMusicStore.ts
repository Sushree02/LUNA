import { create } from 'zustand';
import type { Song, MoodBlock, Library } from '@/types';
import { mockSongs, mockMoodBlocks, mockLibraries } from '@/data/mockData';

interface MusicStore {
  // Current playback state
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  
  // Library state
  libraries: Library[];
  currentLibrary: Library | null;
  
  // Search state
  searchQuery: string;
  searchResults: Song[];
  
  // Mood blocks
  moodBlocks: MoodBlock[];
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  setProgress: (progress: number) => void;
  toggleLike: (songId: string) => void;
  
  // Library actions
  createLibrary: (name: string) => void;
  deleteLibrary: (libraryId: string) => void;
  addSongToLibrary: (libraryId: string, song: Song) => void;
  removeSongFromLibrary: (libraryId: string, songId: string) => void;
  setCurrentLibrary: (library: Library | null) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  performSearch: () => void;
  
  // Mood actions
  loadMoodBlocks: () => void;
  
  // Loading actions
  setIsLoading: (isLoading: boolean) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  // Initial state
  currentSong: null,
  isPlaying: false,
  progress: 0,
  libraries: mockLibraries,
  currentLibrary: mockLibraries[0],
  searchQuery: '',
  searchResults: [],
  moodBlocks: mockMoodBlocks,
  isLoading: true,
  
  // Playback actions
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setProgress: (progress) => set({ progress }),
  
  toggleLike: (songId) => set((state) => {
    // Update song in all places
    const updateSong = (song: Song) => 
      song.id === songId ? { ...song, isLiked: !song.isLiked } : song;
    
    return {
      currentSong: state.currentSong?.id === songId 
        ? { ...state.currentSong, isLiked: !state.currentSong.isLiked }
        : state.currentSong,
      searchResults: state.searchResults.map(updateSong),
      moodBlocks: state.moodBlocks.map(block => ({
        ...block,
        songs: block.songs.map(updateSong),
      })),
      libraries: state.libraries.map(lib => ({
        ...lib,
        songs: lib.songs.map(updateSong),
      })),
    };
  }),
  
  // Library actions
  createLibrary: (name) => set((state) => ({
    libraries: [
      ...state.libraries,
      {
        id: `library-${Date.now()}`,
        name,
        songs: [],
        createdAt: new Date(),
      },
    ],
  })),
  
  deleteLibrary: (libraryId) => set((state) => ({
    libraries: state.libraries.filter(lib => lib.id !== libraryId),
    currentLibrary: state.currentLibrary?.id === libraryId ? state.libraries[0] : state.currentLibrary,
  })),
  
  addSongToLibrary: (libraryId, song) => set((state) => ({
    libraries: state.libraries.map(lib =>
      lib.id === libraryId
        ? { ...lib, songs: [...lib.songs, song] }
        : lib
    ),
  })),
  
  removeSongFromLibrary: (libraryId, songId) => set((state) => ({
    libraries: state.libraries.map(lib =>
      lib.id === libraryId
        ? { ...lib, songs: lib.songs.filter(s => s.id !== songId) }
        : lib
    ),
  })),
  
  setCurrentLibrary: (library) => set({ currentLibrary: library }),
  
  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  performSearch: () => set((state) => {
    const query = state.searchQuery.toLowerCase();
    if (!query) {
      return { searchResults: [] };
    }
    
    const results = mockSongs.filter(
      song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
    );
    
    return { searchResults: results };
  }),
  
  // Mood actions
  loadMoodBlocks: () => set({ moodBlocks: mockMoodBlocks }),
  
  // Loading actions
  setIsLoading: (isLoading) => set({ isLoading }),
}));