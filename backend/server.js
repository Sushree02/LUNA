import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import spotifyRoutes from "./routes/spotifyRoutes.js";
import youtubeRoutes from "./routes/youtube.js";

dotenv.config();

console.log("SPOTIFY ID:", !!process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY SECRET:", !!process.env.SPOTIFY_CLIENT_SECRET);
console.log("YOUTUBE KEY:", !!process.env.YOUTUBE_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Luna backend is working 🌙");
});

app.use("/api/spotify", spotifyRoutes);
app.use("/api/youtube", youtubeRoutes);

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
