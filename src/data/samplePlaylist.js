/**
 * samplePlaylist.js — SINGLE SOURCE OF TRUTH for demo content
 *
 * This is the ONLY file with hardcoded creative content.
 * Everything else (tasteProfile, nudgeCards, tasteCircleTracks,
 * explanations, match reasons) is generated live by AI in Phase 4,
 * using this playlist as the input prompt.
 */

export const samplePlaylist = {
  id: "demo-playlist",
  name: "My Discovery Playlist",
  description: "AI analyzes your listening patterns to find your perfect stepping stones",
  owner: "You",
  coverColor: "#1DB954",
  tracks: [
    { id: "t1", name: "Do I Wanna Know?",          artist: "Arctic Monkeys",   album: "AM",                          dateAdded: "Mar 2, 2025",  duration: "4:32" },
    { id: "t2", name: "Heat Waves",                 artist: "Glass Animals",    album: "Dreamland",                   dateAdded: "Mar 5, 2025",  duration: "3:59" },
    { id: "t3", name: "The Less I Know The Better", artist: "Tame Impala",      album: "Currents",                    dateAdded: "Mar 10, 2025", duration: "3:36" },
    { id: "t4", name: "Sweater Weather",            artist: "The Neighbourhood",album: "I Love You.",                 dateAdded: "Mar 12, 2025", duration: "4:02" },
    { id: "t5", name: "Electric Feel",              artist: "MGMT",             album: "Oracular Spectacular",        dateAdded: "Mar 15, 2025", duration: "3:49" },
    { id: "t6", name: "Midnight City",              artist: "M83",              album: "Hurry Up, We're Dreaming",    dateAdded: "Mar 18, 2025", duration: "4:03" },
    { id: "t7", name: "Motion Sickness",            artist: "Phoebe Bridgers",  album: "Stranger in the Alps",        dateAdded: "Mar 20, 2025", duration: "3:51" },
    { id: "t8", name: "Retrograde",                 artist: "James Blake",      album: "Overgrown",                   dateAdded: "Mar 22, 2025", duration: "4:11" },
  ],
};

export const sampleQueue = samplePlaylist.tracks;

// ─── Repeat Listening Data ────────────────────────────────────────────────────
// Simulated — no real listening-history API without OAuth.
// Disclosed as simulated in the product deck.
export const sampleRepeatData = {
  artistName: "Arctic Monkeys",
  count: 17,
  branches: [
    { name: "The Strokes",     thumbnailColor: "#E8B4B8" },
    { name: "Vampire Weekend", thumbnailColor: "#B4C8E8" },
  ],
};

// ─── Home Screen Cards ────────────────────────────────────────────────────────
export const homeCards = [
  { id: "demo-playlist",   name: "My Discovery Playlist", color: "#1DB954", isMain: true  },
  { id: "discover-weekly", name: "Discover Weekly",       color: "#7B2D8B", isMain: false },
  { id: "daily-mix-1",     name: "Daily Mix 1",           color: "#2D6DB5", isMain: false },
  { id: "daily-mix-2",     name: "Daily Mix 2",           color: "#C25B2A", isMain: false },
  { id: "liked-songs",     name: "Liked Songs",           color: "#1A4A3A", isMain: false },
];

// ─── Sidebar Library ──────────────────────────────────────────────────────────
export const sidebarLibrary = [
  {
    id: "demo-playlist",
    name: "My Discovery Playlist",
    type: "Playlist",
    owner: "You",
    letter: "M",
    color: "#1DB954",
  },
];

// End of sample data

