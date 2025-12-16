import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Heart, X, Music } from 'lucide-react';
import { StarField } from './StarField';
import { useMusicStore } from '@/store/useMusicStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDuration } from '@/utils/formatters';

export function PlayerScreen() {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    progress,
    togglePlayPause,
    toggleLike,
  } = useMusicStore();

  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (isPlaying && currentSong && currentSong.duration) {
      const interval = setInterval(() => {
        setLocalProgress((prev) => {
          const newProgress = prev + (100 / (currentSong.duration || 1));
          if (newProgress >= 100) {
            return 0;
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) {
    navigate('/');
    return null;
  }

  const currentTime = Math.floor((localProgress / 100) * (currentSong.duration || 0));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30"
        style={{ backgroundImage: `url(${currentSong.cover})` }}
      />
      
      <StarField />
      
      <div className="relative z-10 max-w-md mx-auto px-6 py-8 flex flex-col h-screen">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full glass-card hover:bg-violet-twilight/20 transition-colors"
          >
            <X style={{ width: 24, height: 24 }} className="text-periwinkle" />
          </button>
        </div>

        {/* Album Cover */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Avatar className="w-64 h-64 rounded-3xl glow-soft">
              <AvatarImage src={currentSong.cover} alt={currentSong.album} />
              <AvatarFallback className="bg-indigo-velvet rounded-3xl">
                <Music style={{ width: 80, height: 80 }} className="text-periwinkle" />
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Player Controls */}
        <motion.div
          className="glass-card p-8 rounded-3xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Song Info */}
          <div className="text-center mb-6">
            <h2 className="heading-lg text-periwinkle mb-2">{currentSong.title}</h2>
            <p className="body-md text-lavender">{currentSong.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={localProgress} className="h-2 mb-2" />
            <div className="flex justify-between body-sm text-lavender">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(currentSong.duration || 0)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8">
            {/* Like Button */}
            <motion.button
              onClick={() => toggleLike(currentSong.id)}
              className="p-3 rounded-full hover:bg-soft-pink/20 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                style={{ width: 28, height: 28 }}
                className={currentSong.isLiked ? 'text-soft-pink fill-soft-pink' : 'text-lavender'}
              />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-twilight to-indigo-velvet flex items-center justify-center glow-soft hover:scale-110 transition-transform"
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause style={{ width: 32, height: 32 }} className="text-periwinkle fill-periwinkle" />
              ) : (
                <Play style={{ width: 32, height: 32 }} className="text-periwinkle fill-periwinkle ml-1" />
              )}
            </motion.button>

            {/* Spacer for symmetry */}
            <div className="w-14" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}