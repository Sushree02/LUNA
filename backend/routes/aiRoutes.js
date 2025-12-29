import express from "express";

const router = express.Router();

/*
  POST /api/ai/chat
  Body: { message: string }
*/
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  // 🔒 TEMP SAFE RESPONSE (no AI yet)
  // This will NOT break your app
  res.json({
    reply: "🌙 Luna is thinking… real AI coming soon!",
    songs: [
      "Iktara",
      "Raabta",
      "Phir Le Aaya Dil",
    ],
  });
});

export default router;
