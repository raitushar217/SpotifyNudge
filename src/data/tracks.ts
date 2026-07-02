// ─── Types ──────────────────────────────────────────────────────────────────

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  color: string;
}

export interface Playlist {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  gradient: string;
}

export interface CircleTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  match: string;
  matchReason: string;
  color: string;
}

export type BreakIntensity = "Safe Step" | "Stretch" | "Leap";

export interface NudgeCard {
  id: number;
  title: string;
  artist: string;
  album: string;
  color: string;
  sourceTack: string;
  explanation: string;
  saveRate: number;
  intensity: BreakIntensity;
}

// ─── Intensity Config ─────────────────────────────────────────────────────────

export const INTENSITY_CONFIG: Record<
  BreakIntensity,
  { bg: string; text: string; label: string; shape: string }
> = {
  "Safe Step": { bg: "rgba(29,185,84,0.15)", text: "#1DB954", label: "Safe Step", shape: "●" },
  Stretch: { bg: "rgba(250,176,5,0.15)", text: "#FAB005", label: "Stretch", shape: "◑" },
  Leap: { bg: "rgba(239,68,68,0.15)", text: "#F87171", label: "Leap", shape: "○" },
};

// ─── Static Data ──────────────────────────────────────────────────────────────

export const LIBRARY_ITEMS = [
  {
    id: "my-discovery",
    name: "My Discovery Playlist",
    subtitle: "Playlist • 8 songs",
    color: "#1DB954",
    gradient: "from-green-600 to-emerald-800",
    pinned: false,
  },
];

export const DISCOVERY_TRACKS: Track[] = [
  { id: 1, title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", dateAdded: "Mar 2, 2025", duration: "4:32", color: "#ef4444" },
  { id: 2, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", dateAdded: "Mar 5, 2025", duration: "3:59", color: "#f97316" },
  { id: 3, title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", dateAdded: "Mar 10, 2025", duration: "3:36", color: "#a855f7" },
  { id: 4, title: "Sweater Weather", artist: "The Neighbourhood", album: "I Love You.", dateAdded: "Mar 12, 2025", duration: "4:02", color: "#6366f1" },
  { id: 5, title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", dateAdded: "Mar 15, 2025", duration: "3:49", color: "#eab308" },
  { id: 6, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", dateAdded: "Mar 18, 2025", duration: "4:03", color: "#06b6d4" },
  { id: 7, title: "Motion Sickness", artist: "Phoebe Bridgers", album: "Stranger in the Alps", dateAdded: "Mar 20, 2025", duration: "3:51", color: "#ec4899" },
  { id: 8, title: "Retrograde", artist: "James Blake", album: "Overgrown", dateAdded: "Mar 22, 2025", duration: "4:11", color: "#64748b" },
];

export const HOME_CARDS_TOP = [
  { id: "my-discovery", name: "My Discovery Playlist", gradient: "from-green-500 to-emerald-700", prominent: true },
  { id: "discover-weekly", name: "Discover Weekly", gradient: "from-violet-600 to-purple-800", prominent: false },
  { id: "daily-mix-1", name: "Daily Mix 1", gradient: "from-blue-500 to-blue-800", prominent: false },
  { id: "daily-mix-2", name: "Daily Mix 2", gradient: "from-orange-500 to-amber-700", prominent: false },
  { id: "liked-songs", name: "Liked Songs", gradient: "from-green-800 to-emerald-950", prominent: false },
];

export const TASTE_CIRCLE = {
  name: "🌙 Late Night Indie Explorers",
  listeners: "18,243",
  artists: [
    { name: "Phoebe Bridgers", initials: "PB", gradient: "from-violet-600 to-purple-900" },
    { name: "Bon Iver", initials: "BI", gradient: "from-sky-700 to-blue-900" },
    { name: "Sufjan Stevens", initials: "SS", gradient: "from-amber-600 to-orange-900" },
    { name: "Mitski", initials: "Mi", gradient: "from-rose-600 to-pink-900" },
    { name: "Adrianne Lenker", initials: "AL", gradient: "from-green-700 to-emerald-900" },
    { name: "Julien Baker", initials: "JB", gradient: "from-slate-600 to-gray-900" },
  ],
  trending: [
    { title: "Moon Song", artist: "Phoebe Bridgers", saveRate: 81, color: "#a78bfa" },
    { title: "Holocene", artist: "Bon Iver", saveRate: 73, color: "#7dd3fc" },
    { title: "Casimir Pulaski Day", artist: "Sufjan Stevens", saveRate: 68, color: "#fbbf24" },
    { title: "Nobody", artist: "Mitski", saveRate: 77, color: "#f472b6" },
  ],
};

export const CIRCLE_TRACKS: CircleTrack[] = [
  { id: 1, title: "Moon Song", artist: "Phoebe Bridgers", album: "Punisher", match: "98%", matchReason: "You play quiet-hour folk after 11 pm", color: "#a78bfa" },
  { id: 2, title: "Holocene", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "95%", matchReason: "Matches your ambient-vocals pattern", color: "#7dd3fc" },
  { id: 3, title: "Casimir Pulaski Day", artist: "Sufjan Stevens", album: "Illinois", match: "91%", matchReason: "Resonates with your late-Sunday listens", color: "#fbbf24" },
  { id: 4, title: "Nobody", artist: "Mitski", album: "Be the Cowboy", match: "89%", matchReason: "Similar emotional arc to your saves", color: "#f472b6" },
  { id: 5, title: "Funeral Pyre", artist: "Adrianne Lenker", album: "abysskiss", match: "87%", matchReason: "Sparse guitar texture you return to", color: "#6ee7b7" },
  { id: 6, title: "Appointments", artist: "Julien Baker", album: "Turn Out the Lights", match: "85%", matchReason: "High replay count in your night sessions", color: "#94a3b8" },
  { id: 7, title: "Savior Complex", artist: "Phoebe Bridgers", album: "Punisher", match: "84%", matchReason: "Lyric-dense songs you tend to finish", color: "#c4b5fd" },
  { id: 8, title: "Perth", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "82%", matchReason: "Layered production you favour at depth", color: "#bae6fd" },
];

export const LOOP_NUDGE_CARDS: NudgeCard[] = [
  {
    id: 1, title: "Fluorescent Adolescent", artist: "Arctic Monkeys", album: "Suck It and See",
    color: "#ef4444", sourceTack: "Do I Wanna Know?",
    explanation: "Brighter, faster tempo — same witty lyricism you love, just a shade lighter.",
    saveRate: 78, intensity: "Safe Step",
  },
  {
    id: 2, title: "Cut Your Teeth", artist: "Kacey Musgraves", album: "Same Trailer Different Park",
    color: "#f97316", sourceTack: "Motion Sickness",
    explanation: "Quietly devastating vocals over sparse arrangement — sits right in your melancholic pocket.",
    saveRate: 64, intensity: "Safe Step",
  },
  {
    id: 3, title: "Taro", artist: "alt-J", album: "An Awesome Wave",
    color: "#a855f7", sourceTack: "The Less I Know The Better",
    explanation: "Psychedelic layering and unconventional song structure expands your Tame Impala palette.",
    saveRate: 71, intensity: "Stretch",
  },
  {
    id: 4, title: "Dissolved Girl", artist: "Massive Attack", album: "Mezzanine",
    color: "#06b6d4", sourceTack: "Midnight City",
    explanation: "Trip-hop atmosphere with the same nocturnal weight as your M83 plays.",
    saveRate: 58, intensity: "Stretch",
  },
  {
    id: 5, title: "Comptine d'un autre été", artist: "Yann Tiersen", album: "Amélie OST",
    color: "#64748b", sourceTack: "Retrograde",
    explanation: "Stark piano minimalism — a full leap from indie-rock into classical texture, but the emotional DNA matches.",
    saveRate: 43, intensity: "Leap",
  },
];

export const LOOP_TASTE_TAGS = ["Dreamy", "Indie", "Melancholic"];
export const LOOP_CORE_ARTISTS = ["Arctic Monkeys", "Glass Animals", "Phoebe Bridgers"];

export const BRANCH_CHIPS = [
  { artist: "The Strokes", title: "Last Nite", color: "#f87171" },
  { artist: "Vampire Weekend", title: "A-Punk", color: "#60a5fa" },
];
