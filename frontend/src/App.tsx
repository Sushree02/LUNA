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
import { AskLuna } from "./components/AskLuna"; // ✅ ADD THIS

import { useMusicStore } from "./store/useMusicStore";
import { getMoodFromWeatherAndTime } from "@/utils/moodEngine";

/* 🔁 ROUTES WRAPPER */
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

          {/* 🧠 ASK LUNA ROOT */}
          <Route path="/ask-luna" element={<AskLuna />} />
        </Routes>
      </AnimatePresence>

      {/* Always mounted */}
      <MiniPlayer />
      <BottomNav />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { loadMoodBlocks } = useMusicStore();

  /* ✅ Load moods */
  useEffect(() => {
    loadMoodBlocks();
  }, [loadMoodBlocks]);

  /* 🌤 WEATHER + TIME → MOOD (LOGIC ONLY) */
  useEffect(() => {
    async function fetchWeatherMood() {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

      if (!API_KEY) {
        console.warn("⚠️ Weather API key missing");
        return;
      }

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) {
          throw new Error(`Weather API failed: ${res.status}`);
        }

        const data = await res.json();

        const weatherMain: string | undefined =
          data.weather?.[0]?.main;

        const hour = new Date().getHours();

        const mood = getMoodFromWeatherAndTime(
          weatherMain ?? "Clear",
          hour
        );

        console.log("🌤 Weather:", weatherMain);
        console.log("🕒 Hour:", hour);
        console.log("🎵 Auto Mood:", mood);
      } catch (err) {
        console.error("❌ Weather fetch failed", err);
      }
    }

    fetchWeatherMood();
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      {/* 🔥 Global audio engine */}
      <YouTubePlayer />

      <div className="pb-32">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
