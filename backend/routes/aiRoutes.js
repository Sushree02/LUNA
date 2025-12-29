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

    if (!GEMINI_KEY) {
      throw new Error("GEMINI_API_KEY not found in env");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
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
User mood: "${message}"

Reply in a friendly way and recommend 3 song titles only (comma separated).
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I’m here with you 🌙";

    // Extract songs safely
    const songs = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    res.json({
      text: "Here’s something for you 🌙",
      songs: songs.length ? songs : ["Iktara", "Raabta"],
    });
  } catch (err) {
    console.error("Gemini error:", err.message);

    // fallback (never breaks UI)
    res.json({
      text: "I’m here for you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;