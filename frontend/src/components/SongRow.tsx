import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Music } from "lucide-react";
import type { Song } from "@/types";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMusicStore } from "@/store/useMusicStore";

interface SongRowProps {
  song: Song;
  onSelect: (song: Song) => void;
  onLikeToggle: (song: Song) => void;
}

export function SongRow({ song, onSelect, onLikeToggle }: SongRowProps) {
  const title = song.title ?? song.name ?? "Unknown title";
  const artist =
    song.artist ??
    song.artists?.map((a) => a.name).join(", ") ??
    "Unknown artist";

  const cover =
    song.cover ?? song.albumData?.images?.[0]?.url;

  /* 🔥 Store state */
  const { currentSong, isPlaying } = useMusicStore();

  /* 🎯 Is this song playing? */
  const isCurrentPlaying =
    isPlaying && currentSong?.id === song.id;

  /* 🔥 Swipe motion */
  const x = useMotionValue(0);

  /* 🎨 Swipe background feedback */
  const bgColor = useTransform(
    x,
    [-80, 0, 80],
    [
      "rgba(79,70,229,0.15)",
      "rgba(0,0,0,0)",
      "rgba(236,72,153,0.15)",
    ]
  );

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 70) {
      onLikeToggle(song);
    }
    if (info.offset.x < -70 && !song.isLiked) {
      onLikeToggle(song);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -80, right: 80 }}
      dragElastic={0.2}
      style={{ x, backgroundColor: bgColor }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(song)}
      className={`
        group relative
        flex items-center gap-3
        px-4 pr-6 py-2
        w-full
        cursor-pointer
        border-b border-white/10
        transition
        ${isCurrentPlaying ? "bg-white/5" : ""}
      `}
    >
      {/* 🎵 Active left accent (Spotify style) */}
      {isCurrentPlaying && (
        <div className="absolute left-0 top-0 h-full w-[3px] bg-indigo-400 rounded-r-full" />
      )}

      {/* 🌫 Hover glow */}
      <div
        className="
          absolute inset-0
          opacity-0
          group-hover:opacity-100
          transition
          bg-gradient-to-r
          from-indigo-500/10
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      {/* 🎵 Album */}
      <Avatar className="w-10 h-10 rounded-md flex-shrink-0">
        <AvatarImage src={cover} alt={title} />
        <AvatarFallback className="bg-indigo-velvet rounded-md">
          <Music size={14} className="text-periwinkle" />
        </AvatarFallback>
      </Avatar>

      {/* 🎶 Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate ${
            isCurrentPlaying
              ? "text-indigo-300 font-semibold"
              : "text-periwinkle"
          }`}
        >
          {title}
        </p>
        <p className="text-lavender text-xs truncate">
          {artist}
        </p>
      </div>

      {/* ❤️ Like */}
      <div className="flex-shrink-0 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(song);
          }}
          className="p-1 rounded-full hover:bg-white/10 transition"
        >
          <Heart
            size={16}
            className={
              song.isLiked
                ? "text-soft-pink fill-soft-pink"
                : "text-lavender"
            }
          />
        </button>
      </div>
    </motion.div>
  );
}