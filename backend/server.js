import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spotifyRoutes from "./routes/spotifyRoutes.js";

dotenv.config();
console.log("SPOTIFY ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY SECRET:", process.env.SPOTIFY_CLIENT_SECRET);


const app = express();

app.use(cors());
app.use(express.json());

// basic test route
app.get("/", (req, res) => {
  res.send("Luna backend is working 🌙");
});

// Spotify routes
app.use("/api/spotify", spotifyRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
