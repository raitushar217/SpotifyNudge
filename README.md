# SpotifyNudge — AI Music Discovery & Loop Breaker

SpotifyNudge is a production-ready Spotify-clone web player designed to nudge users out of repetitive listening loops through smart, AI-driven "stepping stones" (discovery tracks) and interactive Taste Circles.

## 🚀 Deployment & Set Up

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Insert your **Groq API key** into `.env`:
   ```env
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment
To deploy this project to Vercel:
1. Push this repository to GitHub/GitLab/Bitbucket.
2. Link the repository to your Vercel Account.
3. In **Project Settings > Environment Variables**, add:
   * **Key:** `VITE_GROQ_API_KEY`
   * **Value:** `gsk_your_actual_key_here`
4. Click **Deploy**. Vercel will automatically run Vite's build script and serve it using the configured `vercel.json` rewrite rule to support single-page application routing.

---

## 🎵 Features & AI Pipeline

* **Zero Login Required**: The app immediately opens directly into the demo playlist and launches the taste analysis.
* **Live AI Orchestration**: On load (and on clicking the "Regenerate Recommendations" button), a pipeline powered by Groq's `llama-3.1-8b-instant` model takes the demo playlist as input:
  1. Synthesizes a music taste profile (mood, energy, tags, core artists).
  2. Discovers exactly 5 real, existing "stepping stones" (2 Safe Steps, 2 Stretches, 1 Leap).
  3. Formulates warm, personalized, one-sentence explanations connecting recommendations to your favorite songs.
  4. Generates exactly 8 distinct Taste Circle tracks representing trending music for listeners with this profile.
* **De-duplication**: An automated client-side check filters out any overlap between the 5 stepping stone tracks (Break Your Loop screen) and the 8 Taste Circle tracks (Taste Circles screen), ensuring fresh suggestions across views.

---

## ⚙️ Trigger Systems & Simulators

### Active Triggers
* **Discovery Break Modal (Every 4th song)**: Pressing the "Next" button in the bottom player bar increments your songs played counter. After every 4 songs played, a centered popup modal appears presenting a dynamic discovery recommendation. The modal cycles through your 5 generated stepping stones.
* **End-of-Playlist Modal**: Clicking "Next" on the last song in the demo playlist triggers the End of Playlist modal (rather than firing on selecting the last song).

### Simulated Parameters (Disclosures)
The following creative data remains simulated for demo/visual presentation purposes:
* **Social Proof Save Rates**: Percentages indicating how many other listeners saved a song (e.g., 78%) are generated deterministically based on discovery intensity.
* **Repeat listen counter**: Fixed at "17x this week" for Arctic Monkeys.
* **Taste Circle member count**: Fixed at "18,243 listeners".