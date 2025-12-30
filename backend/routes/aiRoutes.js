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
                  text: `You are Luna, a music assistant.

User feeling: "${message}"

Respond with:
- One friendly sentence
- Then list 3 song titles (comma separated)`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🔮 Gemini RAW:", JSON.stringify(data, null, 2));

    const textPart =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join(" ")
        .trim();

    if (!textPart) {
      throw new Error("Empty Gemini response");
    }

    const lines = textPart.split("\n");

    const replyText = lines[0];

    const songs =
      textPart
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
        .slice(0, 3) || [];

    res.json({
      text: replyText,
      songs: songs.length
        ? songs
        : ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  } catch (err) {
    console.error("❌ Gemini error:", err.message);

    res.json({
      text: "I’m here with you 🌙",
      songs: ["Iktara", "Raabta", "Phir Le Aaya Dil"],
    });
  }
});

export default router;