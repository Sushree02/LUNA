import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ArrowLeft } from "lucide-react";
import { SongRow } from "./SongRow";
import { StarField } from "./StarField";
import { useMusicStore } from "@/store/useMusicStore";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Song } from "@/types";

export function SearchResults() {
  const { mood } = useParams();
  const navigate = useNavigate();

  const {
    searchResults,
    moodBlocks,
    setSearchQuery,
    performSearch,
    setCurrentSong,
    toggleLike,
  } = useMusicStore();

  const [localQuery, setLocalQuery] = useState("");

  const displaySongs: Song[] = mood
    ? moodBlocks.find((b) => b.mood === mood)?.songs || []
    : searchResults;

  const title = mood
    ? moodBlocks.find((b) => b.mood === mood)?.title || "Songs"
    : "Search Results";

  const handleSearch = async (value: string) => {
    setLocalQuery(value);
    setSearchQuery(value);
    if (!value.trim()) return;
    await performSearch();
  };

  /* 🔥 USER CLICK → START AUDIO HERE (MANDATORY) */
  const handleSongClick = (song: Song, index: number) => {
    // 1️⃣ Update Zustand (source of truth)
    setCurrentSong(song, displaySongs, index);

    // 2️⃣ START YOUTUBE AUDIO (USER GESTURE)
    if (window.player && window.playerReady) {
      const title = song.title ?? song.name ?? "";
      const artist =
        song.artist ??
        song.artists?.map((a) => a.name).join(" ") ??
        "";

      const query = `${title} ${artist}`.trim();

      window.player.loadPlaylist({
        listType: "search",
        list: query,
        index: 0,
      });

      // 🔥 THIS LINE IS WHY SOUND WORKS
      window.player.playVideo();
    }

    // 3️⃣ Navigate AFTER playback starts
    navigate("/player");
  };

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
          <h1 className="heading-lg text-periwinkle">{title}</h1>
        </div>

        {/* Search */}
        {!mood && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender" />
            <Input
              placeholder="Search a song or artist…"
              value={localQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 py-4 rounded-2xl glass-card"
            />
          </div>
        )}

        {/* Songs */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {displaySongs.length > 0 ? (
              displaySongs.map((song, index) => (
                <motion.div key={song.id ?? `${song.title}-${index}`}>
                  <SongRow
                    song={song}
                    onSelect={() => handleSongClick(song, index)}
                    onLikeToggle={() => toggleLike(song)}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-center text-lavender">
                No results found
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
