import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "@/store/useMusicStore";

type Message = {
  role: "user" | "luna";
  text: string;
  songs?: string[];
};

export function AskLuna() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSearchQuery } = useMusicStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "luna",
      text: "Hi 🌙 I’m Luna. How are you feeling today?",
    },
  ]);

  /* =======================
     🧠 SEND MESSAGE (REAL AI)
     ======================= */
  async function handleSend() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    // show user message immediately
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("Backend URL missing");
      }

      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) {
        throw new Error(`AI request failed (${res.status})`);
      }

      const data = await res.json();

      // 🔒 strict validation (prevents undefined bugs)
      setMessages((prev) => [
        ...prev,
        {
          role: "luna",
          text: data.text ?? "I’m thinking 🌙",
          songs: Array.isArray(data.songs) ? data.songs : [],
        },
      ]);
    } catch (error) {
      console.error("❌ AskLuna AI error:", error);

      // explicit fallback (you KNOW when Gemini failed)
      setMessages((prev) => [
        ...prev,
        {
          role: "luna",
          text:
            "I’m having trouble reaching my brain right now 🌙 Here’s something you might like:",
          songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSongClick(song: string) {
    setSearchQuery(song);
    navigate("/search");
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-violet-900/40" />

      <div className="relative z-10 max-w-md mx-auto px-3 pt-2 pb-2 flex flex-col h-screen">
        {/* Header */}
        <div className="text-center mb-1">
          <h1 className="text-base font-semibold text-periwinkle flex items-center justify-center gap-1">
            Ask Luna <Sparkles size={14} />
          </h1>
          <p className="text-[11px] text-lavender">
            Tell me how you feel 🎧
          </p>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto space-y-2 pb-1">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-twilight text-white rounded-br-sm"
                      : "bg-white/10 text-lavender rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.songs && msg.songs.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.songs.map((song) => (
                      <button
                        key={song}
                        onClick={() => handleSongClick(song)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition"
                      >
                        <Music size={14} className="text-blue-300" />
                        <span className="truncate">{song}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-1 pt-1">
          <Input
            placeholder="How are you feeling?"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="glass-card rounded-lg text-xs h-9"
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            className="h-9 px-3 rounded-lg bg-violet-twilight text-xs"
          >
            {loading ? "Thinking…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}