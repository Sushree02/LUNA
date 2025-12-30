import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) throw new Error("Missing key");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `User feeling: "${message}". Respond kindly and suggest 3 songs.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW:", JSON.stringify(data, null, 2));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.json({ text: "Gemini returned no text" });
    }

    return res.json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gemini failed" });
  }
});

export default router;