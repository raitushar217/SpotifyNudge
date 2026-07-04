import { callGroq } from "./groqClient";

/**
 * 1. Synthesize taste profile from user tracks.
 *
 * @param {Array} tracks
 * @returns {Promise<object>} Parsed taste profile
 */
export async function synthesizeTasteProfile(tracks, options = {}) {
  const { temperature = 0.7, logResponse = false } = options;
  const systemPrompt = "You are a music taste analyst. Return ONLY valid JSON, no markdown, no extra text.";
  const userPrompt = `Given these tracks from a listener's playlist: ${JSON.stringify(
    tracks.map((t) => ({ name: t.name, artist: t.artist }))
  )}. Analyze this listener's taste profile and return JSON with this exact structure: { mood: string, energy: 'low'|'medium'|'high', vocal_style: string, era: string, circle_name: string (evocative 3-4 word name), circle_emoji: string, core_artists: array of 3 artist names from the list, taste_tags: array of exactly 3 short descriptive tags }`;

  return callGroq(systemPrompt, userPrompt, { temperature, logResponse });
}

/**
 * 2. Suggest exactly 5 real songs as stepping stones.
 *
 * @param {object} tasteProfile
 * @param {Array} tracks
 * @returns {Promise<Array>} List of suggestion objects
 */
export async function discoverSteppingStones(tasteProfile, tracks, options = {}) {
  const { temperature = 0.7, logResponse = false } = options;
  const systemPrompt = "You are a music discovery specialist who finds real, well-known songs that expand a listener's taste without alienating them. Only recommend real songs and artists that actually exist. Return ONLY valid JSON.";
  const userPrompt = `A listener's taste profile: ${JSON.stringify(tasteProfile)}. Their playlist tracks: ${JSON.stringify(
    tracks.map((t) => ({ name: t.name, artist: t.artist }))
  )}. Suggest exactly 5 real songs (not in their playlist) that would work as stepping stones for discovery. For each, pick which existing playlist track it connects to most strongly (sourceTrack, must exactly match a name from the playlist tracks given). Mix of closeness levels: 2 'safe_step', 2 'stretch', 1 'leap'. Return JSON: { suggestions: [{ song_name, artist_name, closeness, sourceTrack }] } with exactly 5 entries.`;

  const result = await callGroq(systemPrompt, userPrompt, { temperature, logResponse });
  return result?.suggestions || [];
}

/**
 * 3. Generate a warm explanation connecting recommendation to playlist favorite.
 *
 * @param {object} tasteProfile
 * @param {string} songName
 * @param {string} artistName
 * @param {string} sourceTrackName
 * @param {string} sourceTrackArtist
 * @returns {Promise<string>} Connection explanation
 */
export async function generateExplanation(
  tasteProfile,
  songName,
  artistName,
  sourceTrackName,
  sourceTrackArtist,
  options = {}
) {
  const { temperature = 0.8, logResponse = false } = options;
  const systemPrompt = "You write short, warm, specific one-sentence explanations connecting a new song recommendation to a listener's existing favorite song. Return ONLY valid JSON.";
  const userPrompt = `Listener's taste profile: ${JSON.stringify(tasteProfile)}. They love '${sourceTrackName}' by ${sourceTrackArtist}. New recommendation: '${songName}' by ${artistName}. Write one sentence (max 20 words) explaining why they'll likely enjoy this, specifically referencing '${sourceTrackName}'. Be specific, not generic. Return JSON: { explanation: string }`;

  const result = await callGroq(systemPrompt, userPrompt, { temperature, logResponse });
  return result?.explanation || "";
}

/**
 * 4. Pure JS function to generate mock-like deterministic-ish save rate percentage.
 *
 * @param {string} closeness
 * @returns {number} Save percentage (integer)
 */
export function simulateSaveRate(closeness = "") {
  const normalized = closeness.toLowerCase().replace(/[\s_-]+/g, "");

  // Generate range-based random integer
  const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (normalized === "safestep") {
    return randBetween(75, 92);
  }
  if (normalized === "stretch") {
    return randBetween(55, 75);
  }
  if (normalized === "leap") {
    return randBetween(40, 60);
  }
  return randBetween(50, 80);
}

/**
 * 5. Recommend exactly 8 songs for Taste Circles distinct from stepping stones.
 *
 * @param {object} tasteProfile
 * @param {Array} tracks
 * @param {Array} excludeSongs List of { song_name, artist_name } or similar to exclude
 * @returns {Promise<Array>} List of recommended songs
 */
export async function buildTasteCircleTracks(tasteProfile, tracks, excludeSongs, options = {}) {
  const { temperature = 0.75, logResponse = false } = options;
  const systemPrompt = "You recommend real songs that a taste-cluster of similar listeners would be discovering, distinct from the user's own stepping stones. Only recommend real, existing songs. Return ONLY valid JSON.";
  const userPrompt = `Taste profile: ${JSON.stringify(tasteProfile)}. Their playlist: ${JSON.stringify(
    tracks.map((t) => ({ name: t.name, artist: t.artist }))
  )}. Do NOT suggest any of these songs, they are already shown elsewhere: ${JSON.stringify(excludeSongs)}. Suggest exactly 8 different real songs that listeners with this same taste profile are discovering, each connected to one playlist track by theme or sound. Return JSON: { tracks: [{ song_name, artist_name, album_name, explanation (max 15 words), matchPercent (82-98 integer), sourceTrack }] } exactly 8 entries, matchPercent descending, none matching the excluded list.`;

  const result = await callGroq(systemPrompt, userPrompt, { temperature, logResponse });
  return result?.tracks || [];
}

/**
 * 6. Pure JS safety-net function to filter candidateTracks against an excludeSongs list.
 *
 * @param {Array} candidateTracks
 * @param {Array} excludeSongs
 * @returns {Array} Filtered list
 */
export function dedupeAgainstList(candidateTracks, excludeSongs) {
  if (!Array.isArray(candidateTracks)) return [];
  if (!Array.isArray(excludeSongs)) return candidateTracks;

  const excludeSet = new Set(
    excludeSongs.map((s) => {
      const name = (s.song_name || s.name || "").trim().toLowerCase();
      const artist = (s.artist_name || s.artist || "").trim().toLowerCase();
      return `${name}||${artist}`;
    })
  );

  return candidateTracks.filter((t) => {
    const name = (t.song_name || t.name || "").trim().toLowerCase();
    const artist = (t.artist_name || t.artist || "").trim().toLowerCase();
    return !excludeSet.has(`${name}||${artist}`);
  });
}

// ─── Fallback Constants ───────────────────────────────────────────────────────

export const FALLBACK_TASTE_PROFILE = {
  mood: "Dreamy & Indie Rock",
  energy: "medium",
  vocal_style: "reverberant vocals",
  era: "2010s - 2020s",
  circle_name: "Late Night Indie Explorers",
  circle_emoji: "🌙",
  core_artists: ["Arctic Monkeys", "Glass Animals", "Phoebe Bridgers"],
  taste_tags: ["Dreamy", "Indie", "Melancholic"],
  tags: ["Dreamy", "Indie", "Melancholic"],
  coreArtists: ["Arctic Monkeys", "Glass Animals", "Phoebe Bridgers"]
};

export const FALLBACK_NUDGE_CARDS = [
  {
    id: "nudge-fb-1",
    name: "Fluorescent Adolescent",
    title: "Fluorescent Adolescent",
    artist: "Arctic Monkeys",
    album: "Suck It and See",
    sourceTrack: "Do I Wanna Know?",
    explanation: "Brighter, faster tempo — same witty lyricism you love, just a shade lighter.",
    saveRate: 78,
    saveRatePercent: 78,
    closeness: "safe_step",
    intensity: "Safe Step"
  },
  {
    id: "nudge-fb-2",
    name: "Cut Your Teeth",
    title: "Cut Your Teeth",
    artist: "Kacey Musgraves",
    album: "Same Trailer Different Park",
    sourceTrack: "Motion Sickness",
    explanation: "Quietly devastating vocals over sparse arrangement — sits right in your melancholic pocket.",
    saveRate: 64,
    saveRatePercent: 64,
    closeness: "safe_step",
    intensity: "Safe Step"
  },
  {
    id: "nudge-fb-3",
    name: "Taro",
    title: "Taro",
    artist: "alt-J",
    album: "An Awesome Wave",
    sourceTrack: "The Less I Know The Better",
    explanation: "Psychedelic layering and unconventional song structure expands your Tame Impala palette.",
    saveRate: 71,
    saveRatePercent: 71,
    closeness: "stretch",
    intensity: "Stretch"
  },
  {
    id: "nudge-fb-4",
    name: "Dissolved Girl",
    title: "Dissolved Girl",
    artist: "Massive Attack",
    album: "Mezzanine",
    sourceTrack: "Midnight City",
    explanation: "Trip-hop atmosphere with the same nocturnal weight as your M83 plays.",
    saveRate: 58,
    saveRatePercent: 58,
    closeness: "stretch",
    intensity: "Stretch"
  },
  {
    id: "nudge-fb-5",
    name: "Comptine d'un autre été",
    title: "Comptine d'un autre été",
    artist: "Yann Tiersen",
    album: "Amélie OST",
    sourceTrack: "Retrograde",
    explanation: "Stark piano minimalism — a full leap from indie-rock into classical texture, but the emotional DNA matches.",
    saveRate: 43,
    saveRatePercent: 43,
    closeness: "leap",
    intensity: "Leap"
  }
];

export const FALLBACK_TASTE_CIRCLE_TRACKS = [
  { id: "c-fb-1", title: "Moon Song", name: "Moon Song", artist: "Phoebe Bridgers", album: "Punisher", match: "98%", matchPercent: 98, matchReason: "You play quiet-hour folk after 11 pm", saveRate: 81 },
  { id: "c-fb-2", title: "Holocene", name: "Holocene", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "95%", matchPercent: 95, matchReason: "Matches your ambient-vocals pattern", saveRate: 73 },
  { id: "c-fb-3", title: "Casimir Pulaski Day", name: "Casimir Pulaski Day", artist: "Sufjan Stevens", album: "Illinois", match: "91%", matchPercent: 91, matchReason: "Resonates with your late-Sunday listens", saveRate: 68 },
  { id: "c-fb-4", title: "Nobody", name: "Nobody", artist: "Mitski", album: "Be the Cowboy", match: "89%", matchPercent: 89, matchReason: "Similar emotional arc to your saves", saveRate: 77 },
  { id: "c-fb-5", title: "Funeral Pyre", name: "Funeral Pyre", artist: "Adrianne Lenker", album: "abysskiss", match: "87%", matchPercent: 87, matchReason: "Sparse guitar texture you return to", saveRate: 85 },
  { id: "c-fb-6", title: "Appointments", name: "Appointments", artist: "Julien Baker", album: "Turn Out the Lights", match: "85%", matchPercent: 85, matchReason: "High replay count in your night sessions", saveRate: 79 },
  { id: "c-fb-7", title: "Savior Complex", name: "Savior Complex", artist: "Phoebe Bridgers", album: "Punisher", match: "84%", matchPercent: 84, matchReason: "Lyric-dense songs you tend to finish", saveRate: 80 },
  { id: "c-fb-8", title: "Perth", name: "Perth", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "82%", matchPercent: 82, matchReason: "Layered production you favour at depth", saveRate: 75 }
];

