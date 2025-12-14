import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';
import { HomePage } from './components/HomePage';
import { SearchResults } from './components/SearchResults';
import { PlayerScreen } from './components/PlayerScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { BottomNav } from './components/BottomNav';
import { useMusicStore } from './store/useMusicStore';

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
      <div className="pb-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/mood/:mood" element={<SearchResults />} />
          <Route path="/player" element={<PlayerScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;