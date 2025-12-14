import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Music } from 'lucide-react';
import type { Song } from '@/types';
import { formatDuration } from '@/utils/formatters';
import { motion } from 'framer-motion';

interface SongRowProps {
  song: Song;
  onSelect: (song: Song) => void;
  onLikeToggle: (songId: string) => void;
}

export function SongRow({ song, onSelect, onLikeToggle }: SongRowProps) {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl glass-card hover:bg-violet-twilight/20 transition-all cursor-pointer group"
      onClick={() => onSelect(song)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Album Cover */}
      <Avatar className="w-14 h-14 rounded-xl">
        <AvatarImage src={song.coverUrl} alt={song.album} />
        <AvatarFallback className="bg-indigo-velvet rounded-xl">
          <Music style={{ width: 24, height: 24 }} className="text-periwinkle" />
        </AvatarFallback>
      </Avatar>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3 className="body-lg text-periwinkle font-medium truncate">
          {song.title}
        </h3>
        <p className="body-sm text-lavender truncate">{song.artist}</p>
      </div>

      {/* Duration */}
      <span className="body-sm text-lavender">{formatDuration(song.duration)}</span>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle(song.id);
        }}
        className="p-2 rounded-full hover:bg-soft-pink/20 transition-colors"
      >
        <Heart
          style={{ width: 20, height: 20 }}
          className={song.isLiked ? 'text-soft-pink fill-soft-pink' : 'text-lavender'}
        />
      </button>
    </motion.div>
  );
}