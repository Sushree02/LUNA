import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import spotifyRoutes from "./routes/spotifyRoutes.js";
import youtubeRoutes from "./routes/youtube.js";
import aiRoutes from "./routes/aiRoutes.js"; // ✅ ADDED (safe)

dotenv.config();

const app = express();

/* =======================
   🔓 CORS (DEPLOY SAFE)
   ======================= */
app.use(
  cors({
    origin: "*", // allow all origins for now
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* =======================
   🔍 ENV CHECK (DEBUG)
   ======================= */
console.log("SPOTIFY ID:", !!process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY SECRET:", !!process.env.SPOTIFY_CLIENT_SECRET);
console.log("YOUTUBE KEY:", !!process.env.YOUTUBE_API_KEY);
console.log("GEMINI KEY:", !!process.env.GEMINI_API_KEY); // ✅ optional

/* =======================
   ✅ ROUTES
   ======================= */
app.get("/", (req, res) => {
  res.send("LUNA backend is working 🌙");
});

app.use("/api/spotify", spotifyRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/ai", aiRoutes); // ✅ Ask Luna (safe)

/* =======================
   🚀 START SERVER
   ======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
