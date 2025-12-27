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
      "rgba(79,70,229,0.25)", // swipe left → add
      "rgba(255,255,255,0)",
      "rgba(236,72,153,0.25)", // swipe right → like
    ]
  );

  /* 🧠 Swipe logic */
  const handleDragEnd = (_: any, info: any) => {
    // 👉 Swipe RIGHT → toggle like
    if (info.offset.x > 70) {
      onLikeToggle(song);
    }

    // 👈 Swipe LEFT → add to favorites if not already liked
    if (info.offset.x < -70 && !song.isLiked) {
      onLikeToggle(song); // force-like = add to favorites queue
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
        flex items-center gap-2
        px-2 py-[6px]
        w-full
        rounded-xl
        glass-card
        cursor-pointer
        overflow-hidden
      "
    >
      {/* 🎵 Album */}
      <Avatar className="w-10 h-10 rounded-lg flex-shrink-0">
        <AvatarImage src={cover} alt={title} />
        <AvatarFallback className="bg-indigo-velvet rounded-lg">
          <Music size={14} className="text-periwinkle" />
        </AvatarFallback>
      </Avatar>

      {/* 🎶 Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-periwinkle font-medium truncate text-sm leading-tight">
          {title}
        </h3>
        <p className="text-lavender truncate text-xs leading-tight">
          {artist}
        </p>
      </div>

      {/* ❤️ Like icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle(song);
        }}
        className="flex-shrink-0 p-[3px]"
      >
        <Heart
          size={15}
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
