// Enums
export type MoodType = "chill" | "focus" | "late-night" | "dreamy" | "peaceful" | "cozy";
export type ScreenType = "loading" | "home" | "search" | "player" | "library";

// Song data
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audioUrl?: string | null;
  duration?: number; // ms (Spotify)
  isLiked: boolean;
}


// Mood block data
export interface MoodBlock {
  mood: string;
  title: string;
  songs: Song[];
}

// Library data
export interface Library {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
}

// Props
export interface SongRowProps {
  song: Song;
  onSelect: (song: Song) => void;
  onLikeToggle: (songId: string) => void;
}

export interface MoodBlockProps {
  moodBlock: MoodBlock;
  onSelect: (mood: MoodType) => void;
}

export interface PlayerProps {
  song: Song | null;
  isPlaying: boolean;
  progress: number; // 0-100
  onPlayPause: () => void;
  onSeek: (progress: number) => void;
  onLikeToggle: () => void;
  onClose: () => void;
}