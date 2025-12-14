import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Headphones } from 'lucide-react';
import { MoodBlock } from './MoodBlock';
import { StarField } from './StarField';
import { useMusicStore } from '@/store/useMusicStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const { moodBlocks, setSearchQuery, performSearch } = useMusicStore();
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setSearchQuery(value);
    if (value.trim()) {
      performSearch();
      navigate('/search');
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
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search
              style={{ width: 20, height: 20 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender"
            />
            <Input
              type="text"
              placeholder="Search a song or artist…"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="glass-card pl-12 pr-4 py-6 text-periwinkle placeholder:text-lavender/60 border-periwinkle/30 focus:border-violet-twilight body-lg rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Center Illustration */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-velvet/40 to-violet-twilight/40 flex items-center justify-center glow-soft">
              <Headphones style={{ width: 64, height: 64 }} className="text-periwinkle" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2 text-4xl"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🐱
            </motion.div>
          </div>
          <p className="body-md text-lavender text-center">
            Find a song and listen quietly 🎧
          </p>
        </motion.div>

        {/* Mood Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="heading-lg text-periwinkle mb-4">Moods</h2>
          <div className="grid grid-cols-2 gap-4">
            {moodBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <MoodBlock
                  moodBlock={block}
                  onSelect={() => {
                    // Navigate to search with mood filter
                    setSearchQuery('');
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