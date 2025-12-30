import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Headphones } from "lucide-react";
import { MoodBlock } from "./MoodBlock";
import { StarField } from "./StarField";
import { SmartSuggestionBar } from "./SmartSuggestionBar";
import { useMusicStore } from "@/store/useMusicStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const { moodBlocks, setSearchQuery } = useMusicStore();
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setSearchQuery(value);

    if (value.trim()) {
      navigate("/search");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-xl text-periwinkle glow-soft">Luna</h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender w-5 h-5" />
          <Input
            type="text"
            placeholder="Search a song or artist…"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="glass-card pl-12 pr-4 py-6 rounded-2xl"
          />
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-velvet/40 to-violet-twilight/40 flex items-center justify-center glow-soft mb-4">
            <Headphones className="text-periwinkle w-16 h-16" />
          </div>
          <p className="body-md text-lavender text-center">
            Find a song and listen quietly 🎧
          </p>
        </motion.div>

        {/* 🌤 Smart Suggestion Bar */}
        <SmartSuggestionBar />

        {/* Mood Blocks */}
        <motion.div>
          <h2 className="heading-lg text-periwinkle mb-4">Moods</h2>

          <div className="grid grid-cols-2 gap-4">
            {moodBlocks.map((block, index) => (
              <motion.div
                key={block.mood}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MoodBlock
                  moodBlock={block}
                  onSelect={() => {
                    setSearchQuery("");
                    navigate(`/mood/${block.mood}`);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}