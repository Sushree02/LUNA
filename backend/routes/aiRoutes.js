import express from "express";

const router = express.Router();

/*
POST /api/ai/chat
Body: { message: string }
*/
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      throw new Error("GEMINI_API_KEY missing in environment");
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are Luna, a friendly music assistant.

User message: "${message}"

Respond STRICTLY in this format:

Reply: <one friendly sentence>
Songs: song1, song2, song3
`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await geminiResponse.json();

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔍 Parse Gemini response safely
    let replyText = "I’m here with you 🌙";
    let songs = [];

    rawText.split("\n").forEach((line) => {
      const lower = line.toLowerCase();

      if (lower.startsWith("reply:")) {
        replyText = line.replace(/reply:/i, "").trim();
      }

      if (lower.startsWith("songs:")) {
        songs = line
          .replace(/songs:/i, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    });

    // 🛟 Final safety net
    if (!songs.length) {
      songs = ["Iktara", "Raabta", "Phir Le Aaya Dil"];
    }

    return res.json({
      text: replyText,
      songs,
    });
  } catch (err) {
    console.error("❌ Gemini error:", err.message);

    return res.json({
      text: "I’m here for you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;