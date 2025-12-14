import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ArrowLeft } from 'lucide-react';
import { SongRow } from './SongRow';
import { StarField } from './StarField';
import { useMusicStore } from '@/store/useMusicStore';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SearchResults() {
  const { mood } = useParams();
  const navigate = useNavigate();
  const {
    searchQuery,
    searchResults,
    moodBlocks,
    setSearchQuery,
    performSearch,
    setCurrentSong,
    toggleLike,
  } = useMusicStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Get songs based on mood or search
  const displaySongs = mood
    ? moodBlocks.find(b => b.mood === mood)?.songs || []
    : searchResults;

  const title = mood
    ? moodBlocks.find(b => b.mood === mood)?.title || 'Songs'
    : 'Search Results';

  useEffect(() => {
    if (!mood && searchQuery) {
      performSearch();
    }
  }, [mood, searchQuery, performSearch]);

  const handleSearch = (value: string) => {
    setLocalQuery(value);
    setSearchQuery(value);
    if (value.trim()) {
      performSearch();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full glass-card hover:bg-violet-twilight/20 transition-colors"
          >
            <ArrowLeft style={{ width: 24, height: 24 }} className="text-periwinkle" />
          </button>
          <h1 className="heading-lg text-periwinkle">{title}</h1>
        </div>

        {/* Search Bar (only for search mode) */}
        {!mood && (
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative">
              <Search
                style={{ width: 20, height: 20 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender"
              />
              <Input
                type="text"
                placeholder="Search a song or artist…"
                value={localQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="glass-card pl-12 pr-4 py-4 text-periwinkle placeholder:text-lavender/60 border-periwinkle/30 focus:border-violet-twilight body-md rounded-2xl"
                autoFocus
              />
            </div>
          </motion.div>
        )}

        {/* Results */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {displaySongs.length > 0 ? (
              displaySongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SongRow
                    song={song}
                    onSelect={(song) => {
                      setCurrentSong(song);
                      navigate('/player');
                    }}
                    onLikeToggle={toggleLike}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="body-lg text-lavender">
                  {mood ? 'No songs in this mood yet' : 'No results found'}
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}