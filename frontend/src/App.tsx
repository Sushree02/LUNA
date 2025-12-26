import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { LoadingScreen } from "./components/LoadingScreen";
import { HomePage } from "./components/HomePage";
import { SearchResults } from "./components/SearchResults";
import { PlayerScreen } from "./components/PlayerScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { BottomNav } from "./components/BottomNav";
import { YouTubePlayer } from "./components/YouTubePlayer";
import { MiniPlayer } from "./components/MiniPlayer";

import { useMusicStore } from "./store/useMusicStore";

/* 🔁 ROUTES WRAPPER (IMPORTANT) */
function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/mood/:mood" element={<SearchResults />} />
          <Route path="/player" element={<PlayerScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
        </Routes>
      </AnimatePresence>

      {/* 🎵 Mini player (outside routes, always mounted) */}
      <MiniPlayer />

      <BottomNav />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { loadMoodBlocks } = useMusicStore();

  useEffect(() => {
    loadMoodBlocks();
  }, [loadMoodBlocks]);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      {/* 🔥 YouTube audio engine (mount ONCE) */}
      <YouTubePlayer />

      <div className="pb-32">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
