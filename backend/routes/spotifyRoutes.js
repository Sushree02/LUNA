import express from "express";
import {
  searchSpotify,
  getMoodSongsController,
} from "../controllers/spotifyController.js";

const router = express.Router();

router.get("/search", searchSpotify);
router.get("/mood/:mood", getMoodSongsController);

export default router;








