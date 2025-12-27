import { Music, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMusicStore } from "@/store/useMusicStore";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function MiniPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong } = useMusicStore();

  const [hidden, setHidden] = useState(false);

  // 🔁 New song → show mini player again
  useEffect(() => {
    setHidden(false);
  }, [currentSong?.id]);

  // ❌ No song or user closed it
  if (!currentSong || hidden) return null;

  // ❌ Hide on PlayerScreen
  if (location.pathname === "/player") return null;

  const bars = Array.from({ length: 32 });

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        fixed
        bottom-[72px]
        left-1/2
        -translate-x-1/2
        w-full
        max-w-sm
        z-40
      "
    >
      <div
        onClick={() => navigate("/player")}
        className="
          relative
          mx-3
          flex items-center gap-3
          px-4 py-2
          rounded-2xl
          bg-[#0f1f3d]/95
          backdrop-blur-xl
          shadow-lg
          cursor-pointer
        "
      >
        {/* ❌ Close */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHidden(true);
          }}
          className="absolute right-3 top-2 text-indigo-200 hover:text-white"
        >
          <X size={14} />
        </button>

        {/* 🎵 Cover */}
        {currentSong.cover ? (
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-10 h-10 rounded-xl object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
            <Music size={16} />
          </div>
        )}

        {/* 🎶 Text + waveform */}
        <div className="flex-1 overflow-hidden pr-6">
          <p className="text-sm font-semibold text-white truncate leading-tight">
            {currentSong.title}
          </p>
          <p className="text-xs text-indigo-200 truncate leading-tight">
            {currentSong.artist}
          </p>

          {/* 🌊 Fake animated waveform */}
          <div className="mt-1 flex items-end gap-[2px] h-3">
            {bars.map((_, i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-indigo-300"
                animate={{ height: [4, 10, 6, 12, 8] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
