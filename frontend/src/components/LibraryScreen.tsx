import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { SongRow } from "./SongRow";
import { StarField } from "./StarField";
import { useMusicStore } from "@/store/useMusicStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function LibraryScreen() {
  const navigate = useNavigate();

  const { libraries, toggleLike, setCurrentSong } = useMusicStore();

  // ✅ Favorites is the ONLY source of truth
  const favoritesLibrary = libraries.find(
    (lib) => lib.id === "favorites"
  );

  const songs = favoritesLibrary?.songs ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full glass-card"
          >
            <ArrowLeft className="w-6 h-6 text-periwinkle" />
          </button>
          <h1 className="heading-lg text-periwinkle">Liked Songs</h1>
        </div>

        {/* Songs */}
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-3 pr-4">
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <SongRow
                    song={song}
                    onSelect={() => {
                      setCurrentSong(song, songs, index);
                      navigate("/player");
                    }}
                    onLikeToggle={() => toggleLike(song)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="body-lg text-lavender">
                  No liked songs yet 💔
                </p>
                <p className="body-sm text-lavender/60 mt-2">
                  Tap the heart icon to save songs here
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}