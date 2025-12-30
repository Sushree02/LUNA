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
import { AskLuna } from "./components/AskLuna";

import { useMusicStore } from "./store/useMusicStore";
import { getMoodFromWeatherAndTime } from "@/utils/moodEngine";

/* 🔁 ROUTES */
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
          <Route path="/ask-luna" element={<AskLuna />} />
        </Routes>
      </AnimatePresence>

      <MiniPlayer />
      <BottomNav />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const { loadMoodBlocks, setWeather } = useMusicStore();

  /* ✅ LOAD MOODS ONCE */
  useEffect(() => {
    loadMoodBlocks();
  }, [loadMoodBlocks]);

  /* 🌍 WEATHER + LOCATION + AUTO REFRESH */
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!API_KEY) return;

    let intervalId: number;

    const fetchByCoords = async (lat: number, lon: number) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      return res.json();
    };

    const fetchByCity = async (city: string) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      return res.json();
    };

    const applyWeather = (data: any) => {
      const weatherMain = data.weather?.[0]?.main ?? "Clear";
      const temp = Math.round(data.main?.temp ?? 0);

      const hour = new Date().getHours();

      const timeLabel =
        hour >= 22 || hour < 5
          ? "Night"
          : hour < 12
          ? "Morning"
          : hour < 17
          ? "Afternoon"
          : "Evening";

      const mood = getMoodFromWeatherAndTime(weatherMain, hour);

      setWeather(
        mood,
        `${weatherMain} · ${temp}°C`,
        timeLabel
      );
    };

    const resolveWeather = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const data = await fetchByCoords(
                pos.coords.latitude,
                pos.coords.longitude
              );
              applyWeather(data);
            },
            async () => {
              const data = await fetchByCity("Delhi");
              applyWeather(data);
            }
          );
        } else {
          const data = await fetchByCity("Delhi");
          applyWeather(data);
        }
      } catch {
        // silent fail
      }
    };

    /* 🔥 FIRST LOAD */
    resolveWeather();

    /* ⏱ AUTO REFRESH EVERY 30 MINUTES */
    intervalId = window.setInterval(
      resolveWeather,
      30 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [setWeather]);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <YouTubePlayer />
      <div className="pb-32">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
