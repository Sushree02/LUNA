import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Music } from "lucide-react";
import type { Song } from "@/types";
import { motion, useMotionValue, useTransform } from "framer-motion";

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
    song.cover ??
    song.albumData?.images?.[0]?.url;

  /* 🔥 Swipe motion */
  const x = useMotionValue(0);

  /* 🎨 Background feedback */
  const bgColor = useTransform(
    x,
    [-100, 0, 100],
    [
      "rgba(79,70,229,0.25)",
      "rgba(255,255,255,0)",
      "rgba(236,72,153,0.25)",
    ]
  );

  /* 🧠 Swipe logic */
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
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.25}
      style={{ x, backgroundColor: bgColor }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(song)}
      className="
        flex items-center gap-3
        px-4 py-3        /* ⬅️ ROW MADE BIGGER HERE */
        w-full
        rounded-2xl
        glass-card
        cursor-pointer
        overflow-hidden
      "
    >
      {/* 🎵 Album */}
      <Avatar className="w-11 h-11 rounded-xl flex-shrink-0">
        <AvatarImage src={cover} alt={title} />
        <AvatarFallback className="bg-indigo-velvet rounded-xl">
          <Music size={16} className="text-periwinkle" />
        </AvatarFallback>
      </Avatar>

      {/* 🎶 Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-periwinkle font-medium truncate text-sm">
          {title}
        </h3>
        <p className="text-lavender truncate text-xs">
          {artist}
        </p>
      </div>

      {/* ❤️ Like icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle(song);
        }}
        className="flex-shrink-0 p-1"
      >
        <Heart
          size={18}
          className={
            song.isLiked
              ? "text-soft-pink fill-soft-pink"
              : "text-lavender"
          }
        />
      </button>
    </motion.div>
  );
}