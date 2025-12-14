import type { Song, MoodBlock, Library } from '@/types';

// Mock songs data
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Waves',
    album: 'Night Stories',
    duration: 234,
    coverUrl: 'https://picsum.photos/200/200?random=1',
    isLiked: true,
  },
  {
    id: '2',
    title: 'Starlight Serenade',
    artist: 'Cosmic Cafe',
    album: 'Celestial Sounds',
    duration: 198,
    coverUrl: 'https://picsum.photos/200/200?random=2',
    isLiked: false,
  },
  {
    id: '3',
    title: 'Peaceful Nights',
    artist: 'Dreamy Echo',
    album: 'Calm Collection',
    duration: 267,
    coverUrl: 'https://picsum.photos/200/200?random=3',
    isLiked: true,
  },
  {
    id: '4',
    title: 'Soft Whispers',
    artist: 'Silent Moon',
    album: 'Quiet Hours',
    duration: 189,
    coverUrl: 'https://picsum.photos/200/200?random=4',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Twilight Melody',
    artist: 'Evening Breeze',
    album: 'Dusk Sessions',
    duration: 245,
    coverUrl: 'https://picsum.photos/200/200?random=5',
    isLiked: true,
  },
  {
    id: '6',
    title: 'Cozy Corner',
    artist: 'Warm Vibes',
    album: 'Comfort Zone',
    duration: 212,
    coverUrl: 'https://picsum.photos/200/200?random=6',
    isLiked: false,
  },
];

// Mock mood blocks
export const mockMoodBlocks: MoodBlock[] = [
  {
    id: 'chill',
    mood: 'chill',
    title: 'Chill Vibes',
    description: 'Relax and unwind',
    songs: [mockSongs[0], mockSongs[1], mockSongs[2]],
  },
  {
    id: 'focus',
    mood: 'focus',
    title: 'Focus Mode',
    description: 'Stay concentrated',
    songs: [mockSongs[1], mockSongs[3], mockSongs[4]],
  },
  {
    id: 'late-night',
    mood: 'late-night',
    title: 'Late Night',
    description: 'For quiet hours',
    songs: [mockSongs[0], mockSongs[2], mockSongs[5]],
  },
  {
    id: 'dreamy',
    mood: 'dreamy',
    title: 'Dreamy',
    description: 'Float away',
    songs: [mockSongs[2], mockSongs[4], mockSongs[5]],
  },
  {
    id: 'peaceful',
    mood: 'peaceful',
    title: 'Peaceful',
    description: 'Find your calm',
    songs: [mockSongs[0], mockSongs[3], mockSongs[5]],
  },
  {
    id: 'cozy',
    mood: 'cozy',
    title: 'Cozy Corner',
    description: 'Warm and comfortable',
    songs: [mockSongs[1], mockSongs[2], mockSongs[5]],
  },
];

// Mock libraries
export const mockLibraries: Library[] = [
  {
    id: 'favorites',
    name: 'My Favorites',
    songs: mockSongs.filter(song => song.isLiked),
    createdAt: new Date('2024-01-01'),
  },
];