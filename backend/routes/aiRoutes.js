import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY missing");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Classify the user's mood in ONE word only:
happy, sad, calm, energetic, romantic

User message: "${message}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const mood =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.toLowerCase()
        .trim() || "calm";

    // 🎵 Controlled song mapping (NO AI parsing)
    const moodSongs = {
      happy: ["Ilahi", "Zinda", "Safarnama"],
      sad: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
      calm: ["Kun Faya Kun", "Agar Tum Saath Ho", "Khairiyat"],
      energetic: ["Apna Time Aayega", "Malang", "Zinda"],
      romantic: ["Tum Hi Ho", "Raabta", "Kesariya"],
    };

    res.json({
      text: `I sense a ${mood} mood 🌙`,
      songs: moodSongs[mood] || moodSongs.calm,
    });
  } catch (err) {
    console.error("Gemini error:", err.message);

    res.json({
      text: "I’m here with you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;