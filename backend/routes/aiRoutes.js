import express from "express";
import fetch from "node-fetch"; // ✅ REQUIRED

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

Reply naturally and recommend 3 song titles.
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I’m here with you 🌙";

    const songs = raw
      .split(/[\n,-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2)
      .slice(0, 3);

    res.json({
      text: raw.split("\n")[0],
      songs: songs.length ? songs : ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  } catch (err) {
    console.error("Gemini error:", err);

    res.json({
      text: "I’m here for you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;