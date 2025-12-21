import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    player: any;
    playerReady: boolean;
    __musicStore: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function YouTubePlayer() {
  const ref = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = initPlayer;
  }, []);

  function initPlayer() {
    if (!ref.current || window.player) return;

    window.playerReady = false;

    window.player = new window.YT.Player(ref.current, {
      height: "1",
      width: "1",

      // 🔥 CRITICAL: load a dummy video to avoid -1 state
      videoId: "dQw4w9WgXcQ", // any public video (never shown)

      playerVars: {
        autoplay: 0,
        controls: 0,
        playsinline: 1, // ✅ REQUIRED for mobile audio
        enablejsapi: 1,
        origin: window.location.origin,
      },

      events: {
        onReady: () => {
          window.playerReady = true;

          // Pause immediately (we only need a valid state)
          window.player.pauseVideo();

          console.log("✅ YouTube Player Ready (initialized)");
        },

        onStateChange: (event: any) => {
          const store = window.__musicStore;
          if (!store) return;

          if (event.data === window.YT.PlayerState.PLAYING) {
            store.setState({ isPlaying: true });
          }

          if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
          ) {
            store.setState({ isPlaying: false });
          }
        },
      },
    });
  }

  return (
    <div
      ref={ref}
      style={{
        width: 1,
        height: 1,
        opacity: 0,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}
