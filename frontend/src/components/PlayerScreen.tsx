import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Heart,
  X,
  Music,
  SkipBack,
  SkipForward,
} from 'lucide-react';
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
    playNext,
    playPrevious,
  } = useMusicStore();

  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (isPlaying && currentSong?.duration) {
      const interval = setInterval(() => {
        setLocalProgress((prev) => {
          const next = prev + 100 / (currentSong.duration || 1);
          return next >= 100 ? 0 : next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) {
    navigate('/');
    return null;
  }

  const currentTime = Math.floor(
    (localProgress / 100) * (currentSong.duration || 0)
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30"
        style={{ backgroundImage: `url(${currentSong.cover})` }}
      />

      <StarField />

      <div className="relative z-10 max-w-md mx-auto px-6 py-8 flex flex-col h-screen">
        {/* Close */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full glass-card hover:bg-violet-twilight/20"
          >
            <X className="w-6 h-6 text-periwinkle" />
          </button>
        </div>

        {/* Cover */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Avatar className="w-64 h-64 rounded-3xl glow-soft">
            <AvatarImage src={currentSong.cover} alt={currentSong.title} />
            <AvatarFallback className="bg-indigo-velvet rounded-3xl">
              <Music className="w-20 h-20 text-periwinkle" />
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Controls */}
        <motion.div className="glass-card p-8 rounded-3xl">
          <div className="text-center mb-6">
            <h2 className="heading-lg text-periwinkle">
              {currentSong.title}
            </h2>
            <p className="body-md text-lavender">
              {currentSong.artist}
            </p>
          </div>

          <div className="mb-6">
            <Progress value={localProgress} className="h-2 mb-2" />
            <div className="flex justify-between body-sm text-lavender">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(currentSong.duration || 0)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <motion.button
              onClick={() => toggleLike(currentSong)}
              className="p-3 rounded-full hover:bg-soft-pink/20"
            >
              <Heart
                className={
                  currentSong.isLiked
                    ? 'w-7 h-7 text-soft-pink fill-soft-pink'
                    : 'w-7 h-7 text-lavender'
                }
              />
            </motion.button>

            <motion.button onClick={playPrevious}>
              <SkipBack className="w-6 h-6 text-periwinkle" />
            </motion.button>

            <motion.button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-twilight to-indigo-velvet flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-periwinkle" />
              ) : (
                <Play className="w-8 h-8 text-periwinkle ml-1" />
              )}
            </motion.button>

            <motion.button onClick={playNext}>
              <SkipForward className="w-6 h-6 text-periwinkle" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
