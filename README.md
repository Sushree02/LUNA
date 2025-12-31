🎵 **LUNA — Weather-Aware, Mood-Driven Music Player**

> *A modern music experience that blends mood, weather, and real-time playback.*

**LUNA** is a **feature-rich, frontend-focused music web application** designed to deliver an immersive and intelligent listening experience.
It combines a **polished UI**, **real music metadata**, **actual audio playback**, and **weather-based mood suggestions** to go beyond a basic music player.

This project focuses heavily on **user experience, state management, and real-world API integration**.

---

✨ What Makes LUNA Special

LUNA is not just about playing songs — it’s about **context-aware music discovery**.

* 🎭 Mood-driven UI
* 🌦 Weather-aware suggestions
* 🎧 Real music playback
* 💎 Smooth, modern interface.

🌟 Features

 🖥️ UI & User Experience

* 🎨 **Polished, modern UI**
* 🏠 Home Screen with:

  * Mood blocks
  * Weather bar
  * Song suggestions
* 🔍 Dedicated **Search Screen**
* ❤️ **Liked Songs Library**
* 💬 **Mood Chat Bar**

  * Suggests songs based on user mood
  * Cute, dynamic UI
  * Visuals adapt according to selected mood
* 📱 Fully responsive design
* ✨ Smooth animations & transitions

---

🎭 Mood-Based Music System

* 🎼 Predefined **mood blocks** (Energetic, Happy, Relax, Chill, etc.)
* 🎯 Mood controls song discovery
* 🧠 Mood can be:

  * Selected manually
  * Suggested by weather
  * Influenced via chat input

---

🌦 Weather-Based Mood Suggestions

* 🌍 **Live weather data using OpenWeather API**
* ☁️ Weather bar displayed on Home Screen
* 🔄 Weather conditions automatically suggest:

  * Appropriate mood block
  * Matching songs
* 🌤 Example:

  * Rain → Relax / Chill
  * Clear → Energetic / Happy
  * Clouds → Calm / Focus

This makes the app **context-aware**, not static.

---

🎧 Real Music & Playback

* 🎵 **Real song metadata from Spotify API**

  * Song title
  * Artist
  * Album artwork
* ▶️ **Actual music playback using YouTube IFrame & YouTube API**
* ⏭ Next / ⏮ Previous song support
* 🔁 Auto-play enabled
* ⏱ **Real-time timestamp**
* 📊 **Drawable progress bar synced with audio**
* 🎚 Smooth playback experience across screens

> ⚠️ Playback is not simulated — it uses real media sources.

---

 💾 State & Data Handling

* ⚡ Centralized global state
* 🔄 Smooth data flow between:

  * Home
  * Search
  * Player
  * Library
* ❤️ Liked songs stored persistently
* 🎧 Playback state maintained during navigation

---

 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Tailwind CSS**
* **Zustand** (state management)
* **Framer Motion** (animations)
* **Vite**

### Backend
* **Node.js**
* **express.js**

### APIs & Services

* **Spotify API** — real music metadata
* **YouTube IFrame & YouTube Data API** — real audio playback
* **OpenWeather API** — live weather data
* postman to check 

---

🧠 High-Level Flow

```
User
 ↓
UI (Mood / Search / Chat)
 ↓
Spotify API (Metadata)
 ↓
YouTube API (Playback)
 ↓
Weather API (Mood Suggestion)
```

Each part works together to deliver a **smooth and intelligent experience**.

---

📸 Screenshots

![1](https://github.com/user-attachments/assets/f50eb195-bc1c-4a4f-9d69-8ef6a28a9509)
![2](https://github.com/user-attachments/assets/8c7c6fdf-b824-423f-92a2-fd360124427e)
![3](https://github.com/user-attachments/assets/51088512-13de-41e6-9a0d-f8f954a39d4a)
![12](https://github.com/user-attachments/assets/f5a0490b-8186-407a-9387-e929ce8d7d09)
![4](https://github.com/user-attachments/assets/35573a78-1e16-49c2-9d43-f839a8f9538d)
![5](https://github.com/user-attachments/assets/948c9309-b289-43e5-bbb8-dbaed1d395d0)
![6](https://github.com/user-attachments/assets/191c9ae9-2e86-4595-9f6e-f4eed24d7c0a)



---

🚀 Getting Started

Clone the Repository

```bash
git clone : https://github.com/your-username/luna-music-player.git
cd luna-music
```

Install Dependencies

```bash
npm install
```

Environment Variables

Create a `.env` file:

```env
VITE_SPOTIFY_API_KEY=your_spotify_key
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_WEATHER_API_KEY=your_openweather_key
```

Run the App

```bash
npm run dev
```

---

🎯 Why This Project Is Strong

✔ Excellent UI/UX focus
✔ Real-world API usage
✔ Actual audio playback (not mock)
✔ Weather-based logic
✔ Advanced state handling
✔ Resume-ready project

This is **well above a basic music app**.

---

🔮 Future Scope

* AI-based mood detection
* Personalized recommendations
* User authentication
* Cloud sync
* Listening analytics
* Voice-controlled playback

---
🔗 Live Demo

🚀 **Deployed Application:**  
👉 https://luna-two-gamma.vercel.app/
👉 https://luna-frontend-hvrf.onrender.com

---

👩‍💻 Author

**Sushree Soumya Priyadarshini**
🎓 Computer Science Engineering Graduate
💡 Interested in Full-Stack & AI-driven Applications

---

⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 🐛 Report issues
* 💡 Suggest improvements


