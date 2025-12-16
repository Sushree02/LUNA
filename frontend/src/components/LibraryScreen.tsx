import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, ArrowLeft } from 'lucide-react';
import { SongRow } from './SongRow';
import { StarField } from './StarField';
import { useMusicStore } from '@/store/useMusicStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function LibraryScreen() {
  const navigate = useNavigate();
  const {
    libraries,
    currentLibrary,
    setCurrentLibrary,
    createLibrary,
    setCurrentSong,
    toggleLike,
  } = useMusicStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');

  const handleCreateLibrary = () => {
    if (newLibraryName.trim()) {
      createLibrary(newLibraryName);
      setNewLibraryName('');
      setIsDialogOpen(false);
    }
  };

  /* ✅ ALWAYS derive songs from libraries (source of truth) */
  const activeLibrary =
    libraries.find((l) => l.id === currentLibrary?.id) ?? libraries[0];

  const displaySongs = activeLibrary?.songs ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full glass-card hover:bg-violet-twilight/20 transition-colors"
            >
              <ArrowLeft
                style={{ width: 24, height: 24 }}
                className="text-periwinkle"
              />
            </button>
            <h1 className="heading-lg text-periwinkle">Library</h1>
          </div>

          {/* Create Library Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-gradient-to-br from-violet-twilight to-indigo-velvet hover:scale-110 transition-transform"
              >
                <Plus
                  style={{ width: 20, height: 20 }}
                  className="text-periwinkle"
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-periwinkle/30">
              <DialogHeader>
                <DialogTitle className="heading-md text-periwinkle">
                  Create Library
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Library name"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                  className="glass-card text-periwinkle placeholder:text-lavender/60 border-periwinkle/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateLibrary();
                    }
                  }}
                />
                <Button
                  onClick={handleCreateLibrary}
                  className="w-full bg-gradient-to-br from-violet-twilight to-indigo-velvet hover:opacity-90"
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Library Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {libraries.map((library) => (
            <motion.button
              key={library.id}
              onClick={() => setCurrentLibrary(library)}
              className={`px-4 py-2 rounded-full whitespace-nowrap body-md transition-all ${
                activeLibrary?.id === library.id
                  ? 'bg-gradient-to-br from-violet-twilight to-indigo-velvet text-periwinkle glow-soft'
                  : 'glass-card text-lavender hover:bg-violet-twilight/20'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {library.name}
            </motion.button>
          ))}
        </div>

        {/* Songs List */}
        <ScrollArea className="h-[calc(100vh-250px)]">
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
                    /* ✅ IMPORTANT: pass SONG, not id */
                    onLikeToggle={() => toggleLike(song)}
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
                  No songs in this library yet
                </p>
                <p className="body-sm text-lavender/60 mt-2">
                  Like songs to add them to your favorites
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
