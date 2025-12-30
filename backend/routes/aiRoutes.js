import express from "express";

const router = express.Router();

/*
POST /api/ai/chat
Body: { message: string }
*/
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY missing");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are Luna, a music assistant.

User feeling: "${message}"

Reply EXACTLY in this format:
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

    const data = await response.json();

    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let replyText = "I’m here with you 🌙";
    let songs = [];

    raw.split("\n").forEach((line) => {
      if (line.toLowerCase().startsWith("reply:")) {
        replyText = line.replace(/reply:/i, "").trim();
      }
      if (line.toLowerCase().startsWith("songs:")) {
        songs = line
          .replace(/songs:/i, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    });

    if (!songs.length) {
      songs = ["Iktara", "Raabta", "Phir Le Aaya Dil"];
    }

    res.json({ text: replyText, songs });
  } catch (err) {
    console.error("Gemini error:", err.message);

    res.json({
      text: "I’m here for you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;
