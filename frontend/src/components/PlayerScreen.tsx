import { useEffect, useState, useRef } from "react";
import {
  Play,
  Pause,
  Heart,
  X,
  Music,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarField } from "./StarField";
import { useMusicStore } from "@/store/useMusicStore";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "@/utils/formatters";
import { searchYouTubeVideo } from "@/api/youtubeSearch";

export function PlayerScreen() {
  const navigate = useNavigate();

  const {
    currentSong,
    toggleLike,
    playNext,
    playPrevious,
    songVideoIds,
    setSongVideoId,
    libraries,
  } = useMusicStore();

  const [progress, setProgress] = useState(0);
  const [ytState, setYtState] = useState<number>(-1);

  const autoplayLock = useRef(false);

  /* 🚫 No song → go back */
  useEffect(() => {
    if (!currentSong) navigate("/");
  }, [currentSong, navigate]);

  /* ❤️ Like state from favorites */
  const favorites =
    libraries.find((lib) => lib.id === "favorites")?.songs || [];

  const isLiked = favorites.some(
    (s) => s.id === currentSong?.id
  );

  /* 🎯 Load & play song */
  useEffect(() => {
    if (!currentSong || !window.player || !window.playerReady) return;

    const playSong = async () => {
      const title = currentSong.title ?? "";
      const artist =
        typeof currentSong.artist === "string"
          ? currentSong.artist
          : "";

      const query = `${title} ${artist}`.trim();

      let videoId = songVideoIds[currentSong.id!];

      if (!videoId) {
        const result = await searchYouTubeVideo(query);
        if (!result) return;
        videoId = result;
        setSongVideoId(currentSong.id!, videoId);
      }

      window.player.loadVideoById(videoId);
      window.player.playVideo();
      setProgress(0);
    };

    playSong();
  }, [currentSong, songVideoIds, setSongVideoId]);

  /* 🔁 Progress tracking + autoplay */
  useEffect(() => {
    if (!window.player || !window.playerReady) return;

    const interval = setInterval(() => {
      const state = window.player.getPlayerState();
      setYtState(state);

      if (state === window.YT.PlayerState.PLAYING) {
        const current = window.player.getCurrentTime();
        const duration = window.player.getDuration();
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      }

      if (
        state === window.YT.PlayerState.ENDED &&
        !autoplayLock.current
      ) {
        autoplayLock.current = true;
        playNext();
        setProgress(0);

        setTimeout(() => {
          autoplayLock.current = false;
        }, 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playNext]);

  /* ▶️ Play / Pause */
  const handlePlayPause = () => {
    if (!window.player || !window.playerReady) return;

    const state = window.player.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      window.player.pauseVideo();
    } else {
      window.player.playVideo();
    }
  };

  /* 🎯 Seek (drag progress bar) */
  const handleSeek = (value: number) => {
    if (!window.player || !window.playerReady) return;

    const duration = window.player.getDuration();
    if (!duration) return;

    const newTime = (value / 100) * duration;
    window.player.seekTo(newTime, true);
    setProgress(value);
  };

  if (!currentSong) return null;

  const currentTime = Math.floor(
    (progress / 100) * (currentSong.duration || 0)
  );

  const isPlaying = ytState === window.YT?.PlayerState?.PLAYING;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />

      <div className="max-w-md mx-auto px-6 py-8 flex flex-col h-screen">
        {/* ❌ Close */}
        <button onClick={() => navigate(-1)} className="self-end mb-4">
          <X />
        </button>

        {/* 🎵 Cover */}
        <Avatar className="w-64 h-64 mx-auto my-6">
          <AvatarImage src={currentSong.cover} />
          <AvatarFallback>
            <Music />
          </AvatarFallback>
        </Avatar>

        {/* 🎶 Controls */}
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-center text-lg font-semibold">
            {currentSong.title}
          </h2>
          <p className="text-center text-sm opacity-70">
            {currentSong.artist}
          </p>

          {/* 🎚️ Spotify-style progress bar */}
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="
              w-full my-4 cursor-pointer
              accent-sky-400
              h-2 rounded-full
              hover:accent-sky-300
            "
          />

          <div className="flex justify-between text-sm opacity-70">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(currentSong.duration || 0)}</span>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            {/* ❤️ Like */}
            <button onClick={() => toggleLike(currentSong)}>
              <Heart
                className={
                  isLiked
                    ? "fill-pink-500 text-pink-500"
                    : "text-white"
                }
              />
            </button>

            {/* ⏮️ Previous */}
            <button onClick={playPrevious}>
              <SkipBack />
            </button>

            {/* ▶️ Play / Pause */}
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>

            {/* ⏭️ Next */}
            <button onClick={playNext}>
              <SkipForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
