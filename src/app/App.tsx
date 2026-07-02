import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Home,
  Plus,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Mic2,
  ListMusic,
  Laptop2,
  Volume2,
  Maximize2,
  MoreHorizontal,
  Clock,
  Share2,
  Download,
  CheckCircle2,
  CirclePlus,
  ListFilter,
  Bookmark,
  Disc,
  Music2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  color: string;
}

interface Playlist {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  gradient: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const LIBRARY_ITEMS = [
  { id: "my-discovery", name: "My Discovery Playlist", subtitle: "Playlist • 8 songs", color: "#1DB954", gradient: "from-green-600 to-emerald-800", pinned: false },
];

const DISCOVERY_TRACKS: Track[] = [
  { id: 1, title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", dateAdded: "Mar 2, 2025", duration: "4:32", color: "#ef4444" },
  { id: 2, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", dateAdded: "Mar 5, 2025", duration: "3:59", color: "#f97316" },
  { id: 3, title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", dateAdded: "Mar 10, 2025", duration: "3:36", color: "#a855f7" },
  { id: 4, title: "Sweater Weather", artist: "The Neighbourhood", album: "I Love You.", dateAdded: "Mar 12, 2025", duration: "4:02", color: "#6366f1" },
  { id: 5, title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", dateAdded: "Mar 15, 2025", duration: "3:49", color: "#eab308" },
  { id: 6, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", dateAdded: "Mar 18, 2025", duration: "4:03", color: "#06b6d4" },
  { id: 7, title: "Motion Sickness", artist: "Phoebe Bridgers", album: "Stranger in the Alps", dateAdded: "Mar 20, 2025", duration: "3:51", color: "#ec4899" },
  { id: 8, title: "Retrograde", artist: "James Blake", album: "Overgrown", dateAdded: "Mar 22, 2025", duration: "4:11", color: "#64748b" },
];

const HOME_CARDS_TOP = [
  { id: "my-discovery", name: "My Discovery Playlist", gradient: "from-green-500 to-emerald-700", prominent: true },
  { id: "discover-weekly", name: "Discover Weekly", gradient: "from-violet-600 to-purple-800", prominent: false },
  { id: "daily-mix-1", name: "Daily Mix 1", gradient: "from-blue-500 to-blue-800", prominent: false },
  { id: "daily-mix-2", name: "Daily Mix 2", gradient: "from-orange-500 to-amber-700", prominent: false },
  { id: "liked-songs", name: "Liked Songs", gradient: "from-green-800 to-emerald-950", prominent: false },
];

const TASTE_CIRCLE = {
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

interface CircleTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  match: string;
  matchReason: string;
  color: string;
}

const CIRCLE_TRACKS: CircleTrack[] = [
  { id: 1, title: "Moon Song", artist: "Phoebe Bridgers", album: "Punisher", match: "98%", matchReason: "You play quiet-hour folk after 11 pm", color: "#a78bfa" },
  { id: 2, title: "Holocene", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "95%", matchReason: "Matches your ambient-vocals pattern", color: "#7dd3fc" },
  { id: 3, title: "Casimir Pulaski Day", artist: "Sufjan Stevens", album: "Illinois", match: "91%", matchReason: "Resonates with your late-Sunday listens", color: "#fbbf24" },
  { id: 4, title: "Nobody", artist: "Mitski", album: "Be the Cowboy", match: "89%", matchReason: "Similar emotional arc to your saves", color: "#f472b6" },
  { id: 5, title: "Funeral Pyre", artist: "Adrianne Lenker", album: "abysskiss", match: "87%", matchReason: "Sparse guitar texture you return to", color: "#6ee7b7" },
  { id: 6, title: "Appointments", artist: "Julien Baker", album: "Turn Out the Lights", match: "85%", matchReason: "High replay count in your night sessions", color: "#94a3b8" },
  { id: 7, title: "Savior Complex", artist: "Phoebe Bridgers", album: "Punisher", match: "84%", matchReason: "Lyric-dense songs you tend to finish", color: "#c4b5fd" },
  { id: 8, title: "Perth", artist: "Bon Iver", album: "Bon Iver, Bon Iver", match: "82%", matchReason: "Layered production you favour at depth", color: "#bae6fd" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 168 168" className="w-8 h-8" fill="none">
      <circle cx="84" cy="84" r="84" fill="#1DB954" />
      <path
        d="M120.3 117.2c-1.6 0-2.6-.5-3.9-1.3-10.8-6.6-24.3-10.2-38.6-10.2-8 0-16.1 1-23.6 2.9-1.1.3-2.5.7-3.5.7-3.1 0-5.2-2.4-5.2-5.2 0-3.1 1.9-4.9 4.4-5.5 9-2.4 18.6-3.7 28-3.7 16.4 0 31.9 4.1 44.4 11.7 2.1 1.2 3.3 2.6 3.3 5.1.1 2.9-2.2 5.5-5.3 5.5zm8.6-22.4c-2 0-3.3-.8-4.6-1.6-12.1-7.4-28.1-12-44.6-12-9.1 0-17.5 1.3-24.2 3.2-1.5.4-2.3.7-3.6.7-3.6 0-6.4-2.9-6.4-6.4 0-3.7 2-5.9 5-6.8 8.3-2.4 17.6-3.9 29.5-3.9 18.6 0 36.7 5.1 51 14.2 2.4 1.5 3.8 3.3 3.8 6.4 0 3.5-2.9 6.2-6.4 6.2zm9.9-26c-1.9 0-3.1-.6-4.6-1.5C118.6 57.4 98 51.9 76.2 51.9c-10.4 0-20.6 1.4-30 3.9-1.2.3-2.6.8-4.1.8-4.3 0-7.5-3.3-7.5-7.6 0-4.2 2.5-6.7 5.5-7.6C51.4 38.4 63.5 36.5 76.3 36.5c24 0 47.7 6.1 65.5 17.2 2.7 1.6 4.5 3.9 4.5 7.5 0 4.3-3.4 7.6-7.5 7.6z"
        fill="black"
      />
    </svg>
  );
}

function AlbumArt({ gradient, size = "sm", char }: { gradient: string; size?: "sm" | "md" | "lg" | "xl"; char?: string }) {
  const sizes = { sm: "w-10 h-10", md: "w-12 h-12", lg: "w-32 h-32", xl: "w-52 h-52" };
  return (
    <div className={`${sizes[size]} rounded bg-gradient-to-br ${gradient} flex-shrink-0 flex items-center justify-center`}>
      {char && <span className="text-white/60 font-bold" style={{ fontSize: size === "xl" ? "3rem" : size === "lg" ? "2rem" : "1rem" }}>{char}</span>}
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ onViewChange, currentView }: { onViewChange: (v: "home" | "playlist" | "taste-circles" | "break-loop") => void; currentView: string }) {
  return (
    <div className="h-16 flex items-center px-4 gap-3 flex-shrink-0" style={{ background: "rgba(18,18,18,0.95)" }}>
      {/* Nav arrows */}
      <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
        <ChevronRight size={18} className="text-white" />
      </button>

      {/* Home icon button */}
      <button
        onClick={() => onViewChange("home")}
        title="Home"
        className="w-8 h-8 flex items-center justify-center transition-colors"
        style={{ color: currentView === "home" ? "#ffffff" : "#A7A7A7" }}
        onMouseEnter={(e) => { if (currentView !== "home") (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; }}
        onMouseLeave={(e) => { if (currentView !== "home") (e.currentTarget as HTMLButtonElement).style.color = "#A7A7A7"; }}
      >
        <Home size={18} />
      </button>

      {/* Taste Circles icon button */}
      <button
        onClick={() => onViewChange("taste-circles")}
        title="Taste Circles"
        className="w-8 h-8 flex items-center justify-center transition-colors"
        style={{ color: currentView === "taste-circles" ? "#ffffff" : "#A7A7A7" }}
        onMouseEnter={(e) => { if (currentView !== "taste-circles") (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; }}
        onMouseLeave={(e) => { if (currentView !== "taste-circles") (e.currentTarget as HTMLButtonElement).style.color = "#A7A7A7"; }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="3" cy="13.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="15" cy="13.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="7.3" y1="4.9" x2="4.2" y2="11.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10.7" y1="4.9" x2="13.8" y2="11.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="5" y1="13.5" x2="13" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-96 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7A7A7]">
          <Search size={14} />
        </div>
        <input
          type="text"
          placeholder="What do you want to play?"
          className="w-full h-9 rounded-full pl-9 pr-4 text-sm text-white placeholder-[#A7A7A7] outline-none focus:ring-1 focus:ring-white/40"
          style={{ background: "#2a2a2a", border: "1px solid transparent" }}
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <button className="px-4 h-8 rounded-full border border-white/30 text-white text-xs font-bold hover:border-white transition-colors whitespace-nowrap">
        Explore Premium
      </button>
      <button className="flex items-center gap-1.5 px-3 h-8 rounded-full border border-white/30 text-white text-xs font-bold hover:border-white transition-colors whitespace-nowrap">
        <Download size={13} />
        Install App
      </button>
      <button className="w-8 h-8 flex items-center justify-center text-[#A7A7A7] hover:text-white transition-colors">
        <Bell size={17} />
      </button>
      <button className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center hover:bg-[#727272] transition-colors overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center">
          <span className="text-black text-xs font-bold">R</span>
        </div>
      </button>
    </div>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar({
  activeItem,
  onSelectItem,
  currentTrack,
  activeTab,
  onSelectTab,
}: {
  activeItem: string;
  onSelectItem: (id: string) => void;
  currentTrack: Track | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}) {
  return (
    <div className="w-60 flex flex-col flex-shrink-0 overflow-hidden" style={{ background: "#000000" }}>
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <SpotifyLogo />
      </div>

      {/* Library header */}
      <div className="px-4 flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ListMusic size={16} className="text-[#A7A7A7]" />
          <span className="text-[#A7A7A7] text-sm font-bold">Your Library</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-[#A7A7A7] hover:text-white hover:bg-[#1a1a1a] transition-colors">
            <Plus size={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-[#A7A7A7] hover:text-white hover:bg-[#1a1a1a] transition-colors text-xs font-bold px-1">
            Create
          </button>
        </div>
      </div>

      {/* Library tabs */}
      <div className="px-2 flex gap-1 mb-3 flex-shrink-0 flex-wrap">
        {["Playlists", "Artists", "Albums", "Podcasts", "Taste Circles"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors hover:text-white"
              style={isActive
                ? { background: "#282828", color: "white" }
                : { color: "#A7A7A7" }
              }
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a"; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Import box */}
      <div className="mx-2 mb-3 rounded-lg p-3 flex-shrink-0" style={{ background: "#1a1a1a" }}>
        <p className="text-white text-xs font-bold mb-1">Import your music from other Apps</p>
        <p className="text-[#A7A7A7] text-xs mb-3">Bring your playlists, songs and artists.</p>
        <button className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors">
          Import library
        </button>
      </div>

      {/* Recents label */}
      <div className="px-4 flex items-center justify-between mb-1 flex-shrink-0">
        <span className="text-[#A7A7A7] text-xs font-medium">Recents</span>
      </div>

      {/* Library list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
        {LIBRARY_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors text-left"
              style={isActive ? { background: "#1a1a1a" } : {}}
            >
              <AlbumArt gradient={item.gradient} size="sm" char={item.name[0].toUpperCase()} />
              <div className="min-w-0">
                <p className={`text-sm truncate font-medium ${isActive ? "text-white" : "text-white"}`}>{item.name}</p>
                <p className="text-xs text-[#A7A7A7] truncate">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Now playing in sidebar */}
      {currentTrack && (
        <div className="px-2 py-2 flex-shrink-0 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded flex-shrink-0 bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center">
              <Music2 size={13} className="text-white/50" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{currentTrack.title}</p>
              <p className="text-[#A7A7A7] text-xs truncate">{currentTrack.artist}</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#1DB954] flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Home View ───────────────────────────────────────────────────────────────

function HomeView({ onSelectPlaylist, onSelectBreakLoop }: { onSelectPlaylist: () => void; onSelectBreakLoop: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Sticky music/podcast tabs */}
      <div className="sticky top-0 z-10 px-6 pt-4 pb-3 flex gap-2" style={{ background: "#121212" }}>
        <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold">Music</button>
        <button className="px-4 py-1.5 rounded-full text-white text-sm font-medium hover:bg-[#282828] transition-colors">Podcasts</button>
      </div>

      <div className="px-6 pb-8">
        {/* Top row of quick-access cards */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 items-end" style={{ scrollbarWidth: "none" }}>
          {HOME_CARDS_TOP.map((card) => (
            <button
              key={card.id}
              onClick={card.id === "my-discovery" ? onSelectPlaylist : undefined}
              className={`flex-shrink-0 rounded-lg overflow-hidden hover:opacity-90 transition-opacity text-left ${card.prominent ? "w-36" : "w-28"}`}
            >
              <div className={`w-full bg-gradient-to-br ${card.gradient} relative flex items-center justify-center ${card.prominent ? "h-20" : "h-16"}`}>
                <Disc size={card.prominent ? 28 : 22} className="text-white/30" />
              </div>
              <div className="p-1.5" style={{ background: "#1a1a1a" }}>
                <p className={`text-white font-medium truncate ${card.prominent ? "text-sm" : "text-xs"}`}>{card.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Picked for you / Made For You */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Picked for you</h2>
          </div>
          <div className="flex gap-4">
            {/* My Discovery Playlist — featured large card */}
            <button
              onClick={onSelectPlaylist}
              className="flex-shrink-0 w-52 rounded-lg overflow-hidden hover:opacity-90 transition-opacity text-left group relative"
            >
              <div className="w-full h-52 bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-black/10" />
                <div className="text-center px-3 relative z-10">
                  <Disc size={48} className="text-white/40 mx-auto mb-3" />
                  <p className="text-white font-black text-sm leading-tight">My Discovery Playlist</p>
                  <p className="text-white/70 text-xs mt-1">8 songs • 38 min</p>
                </div>
                <div className="absolute bottom-2 left-2 opacity-40"><Disc size={14} className="text-white" /></div>
              </div>
              <div className="absolute bottom-14 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg">
                  <Play size={16} fill="black" className="text-black ml-0.5" />
                </div>
              </div>
              <div className="p-2" style={{ background: "#1a1a1a" }}>
                <p className="text-white text-xs font-bold">My Discovery Playlist</p>
                <p className="text-[#A7A7A7] text-xs">Your AI-curated mix</p>
              </div>
            </button>

            <div className="flex flex-col gap-3">
              <p className="text-[#A7A7A7] text-xs uppercase tracking-wider font-bold">Made For You</p>
              <div className="flex gap-3">
                {HOME_CARDS_TOP.slice(1).map((card) => (
                  <div key={card.id} className="w-36 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group relative">
                    <div className={`w-full h-36 bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                      <Disc size={36} className="text-white/30" />
                    </div>
                    <div className="p-2" style={{ background: "#1a1a1a" }}>
                      <p className="text-white text-xs font-bold">{card.name}</p>
                    </div>
                    <div className="absolute bottom-12 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg">
                        <Play size={12} fill="black" className="text-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Break Your Loop */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Break Your Loop</h2>
            <button className="text-[#A7A7A7] text-sm font-bold hover:text-white transition-colors">Show all</button>
          </div>
          <div
            onClick={onSelectBreakLoop}
            className="flex items-center gap-5 px-5 py-4 rounded-xl cursor-pointer group transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #1DB954 0%, #148a3d 35%, #0d2b1a 100%)", maxWidth: "calc(2 * 9rem + 1rem)" }}
          >
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.25)" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 6h9a3 3 0 0 1 0 6H5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12l-2-2 2-2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold leading-snug">See what listeners like you discovered this week</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Based on your last 20 plays</p>
            </div>
            <ChevronRight size={18} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "rgba(255,255,255,0.7)" }} />
          </div>
        </div>

        {/* Recents — single wide card */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Recents</h2>
            <button className="text-[#A7A7A7] text-sm font-bold hover:text-white transition-colors">Show all</button>
          </div>
          <button
            onClick={onSelectPlaylist}
            className="w-full rounded-xl overflow-hidden hover:opacity-90 transition-opacity text-left group relative"
            style={{ background: "#1a1a1a" }}
          >
            <div className="w-full h-32 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center gap-6 px-6 relative">
              <div className="absolute top-3 right-3 opacity-40"><Disc size={16} className="text-white" /></div>
              <Disc size={56} className="text-white/25 flex-shrink-0" />
              <div>
                <p className="text-white font-black text-xl">My Discovery Playlist</p>
                <p className="text-white/70 text-sm mt-0.5">8 songs</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg">
                  <Play size={18} fill="black" className="text-black ml-0.5" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Playlist View ────────────────────────────────────────────────────────────

function PlaylistView({
  onSelectTrack,
  activeTrackId,
}: {
  onSelectTrack: (t: Track) => void;
  activeTrackId: number | null;
}) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Gradient header */}
      <div
        className="px-6 pt-16 pb-6"
        style={{ background: "linear-gradient(180deg, #0d4a1f 0%, #072b12 60%, #121212 100%)" }}
      >
        <p className="text-white text-xs font-medium mb-3">Playlist</p>
        <h1 className="text-white font-black mb-2" style={{ fontSize: "4.5rem", lineHeight: 1, letterSpacing: "-0.02em" }}>
          My Discovery Playlist
        </h1>
        <p className="text-[#A7A7A7] text-sm mb-1">AI analyzes your listening patterns to find your perfect stepping stones</p>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-white font-bold">You</span>
          <span className="text-[#A7A7A7]">•</span>
          <span className="text-[#A7A7A7]">8 songs • 38 min</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 flex items-center gap-5" style={{ background: "linear-gradient(180deg, #061a0d 0%, #121212 100%)" }}>
        <button className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg">
          <Play size={24} fill="black" className="text-black ml-1" />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Shuffle size={22} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <CirclePlus size={22} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Share2 size={20} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <MoreHorizontal size={22} />
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white transition-colors text-sm">
          <Mic2 size={14} />
          Mic
        </button>
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white transition-colors text-sm">
          <ListFilter size={14} />
          List
        </button>
      </div>

      {/* Table header */}
      <div className="px-6 border-b border-white/10 pb-2 mb-2">
        <div className="grid text-[#A7A7A7] text-sm" style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}>
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date added</span>
          <span className="flex justify-end"><Clock size={14} /></span>
        </div>
      </div>

      {/* Track list */}
      <div className="px-6 pb-8">
        {DISCOVERY_TRACKS.map((track, i) => {
          const isActive = activeTrackId === track.id;
          return (
            <div key={track.id}>
              {i === 4 && (
                <DiscoveryBreakRow
                  title="R U Mine?"
                  album="AM"
                  socialProof="73% of listeners like you saved this"
                  aiReason="Because you enjoy Arctic Monkeys"
                  intensity="Stretch"
                  color="#ef4444"
                />
              )}
              <button
                onClick={() => onSelectTrack(track)}
                className="w-full group rounded-md hover:bg-[#282828] transition-colors"
              >
              <div
                className="grid items-center py-2.5 px-2 rounded-md"
                style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
              >
                {/* Track number / play icon */}
                <div className="flex items-center justify-center">
                  {isActive ? (
                    <span className="text-[#1DB954] text-xs font-bold">♪</span>
                  ) : (
                    <>
                      <span className="text-[#A7A7A7] text-sm group-hover:hidden">{i + 1}</span>
                      <Play size={14} fill="white" className="text-white hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Title + artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 relative flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${track.color}88, ${track.color}44)` }}
                  >
                    <Music2 size={14} className="text-white/50" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-[#1DB954]" : "text-white"}`}>{track.title}</p>
                    <p className="text-[#A7A7A7] text-xs truncate">{track.artist}</p>
                  </div>
                </div>

                {/* Album */}
                <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline cursor-pointer">
                  {track.album}
                </span>

                {/* Date */}
                <span className="text-[#A7A7A7] text-sm">{track.dateAdded}</span>

                {/* Duration */}
                <div className="flex items-center justify-end gap-3">
                  <Heart size={14} className="text-[#A7A7A7] opacity-0 group-hover:opacity-100 hover:text-white transition-all" />
                  <span className="text-[#A7A7A7] text-sm">{track.duration}</span>
                  <MoreHorizontal size={14} className="text-[#A7A7A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Break Your Loop data ────────────────────────────────────────────────────

const LOOP_NUDGE_CARDS = [
  {
    id: 1,
    title: "Fluorescent Adolescent",
    artist: "Arctic Monkeys",
    album: "Suck It and See",
    color: "#ef4444",
    sourceTack: "Do I Wanna Know?",
    explanation: "Brighter, faster tempo — same witty lyricism you love, just a shade lighter.",
    saveRate: 78,
    intensity: "Safe Step" as BreakIntensity,
  },
  {
    id: 2,
    title: "Cut Your Teeth",
    artist: "Kacey Musgraves",
    album: "Same Trailer Different Park",
    color: "#f97316",
    sourceTack: "Motion Sickness",
    explanation: "Quietly devastating vocals over sparse arrangement — sits right in your melancholic pocket.",
    saveRate: 64,
    intensity: "Safe Step" as BreakIntensity,
  },
  {
    id: 3,
    title: "Taro",
    artist: "alt-J",
    album: "An Awesome Wave",
    color: "#a855f7",
    sourceTack: "The Less I Know The Better",
    explanation: "Psychedelic layering and unconventional song structure expands your Tame Impala palette.",
    saveRate: 71,
    intensity: "Stretch" as BreakIntensity,
  },
  {
    id: 4,
    title: "Dissolved Girl",
    artist: "Massive Attack",
    album: "Mezzanine",
    color: "#06b6d4",
    sourceTack: "Midnight City",
    explanation: "Trip-hop atmosphere with the same nocturnal weight as your M83 plays.",
    saveRate: 58,
    intensity: "Stretch" as BreakIntensity,
  },
  {
    id: 5,
    title: "Comptine d'un autre été",
    artist: "Yann Tiersen",
    album: "Amélie OST",
    color: "#64748b",
    sourceTack: "Retrograde",
    explanation: "Stark piano minimalism — a full leap from indie-rock into classical texture, but the emotional DNA matches.",
    saveRate: 43,
    intensity: "Leap" as BreakIntensity,
  },
];

const LOOP_TASTE_TAGS = ["Dreamy", "Indie", "Melancholic"];
const LOOP_CORE_ARTISTS = ["Arctic Monkeys", "Glass Animals", "Phoebe Bridgers"];

// ─── Badge components ─────────────────────────────────────────────────────────

type BreakIntensity = "Safe Step" | "Stretch" | "Leap";

/*
  Shape key (colorblind-safe):
  Safe Step  — filled circle  ●   green
  Stretch    — half circle    ◑   amber
  Leap       — outline circle ○   coral
*/
const INTENSITY_CONFIG: Record<BreakIntensity, {
  bg: string; text: string; label: string; shape: string;
}> = {
  "Safe Step": { bg: "rgba(29,185,84,0.15)",  text: "#1DB954", label: "Safe Step", shape: "●" },
  "Stretch":   { bg: "rgba(250,176,5,0.15)",   text: "#FAB005", label: "Stretch",   shape: "◑" },
  "Leap":      { bg: "rgba(239,68,68,0.15)",   text: "#F87171", label: "Leap",      shape: "○" },
};

function IntensityBadge({ intensity }: { intensity: BreakIntensity }) {
  const cfg = INTENSITY_CONFIG[intensity];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}
      title={`Discovery intensity: ${cfg.label}`}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>{cfg.shape}</span>
      {cfg.label}
    </span>
  );
}

/* MatchBadge — used for percentage match scores in Taste Circles */
function MatchBadge({ value }: { value: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954" }}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>●</span>
      {value}
    </span>
  );
}

/* SaveRateBadge — used in Taste Circles right panel trending list */
function SaveRateBadge({ rate }: { rate: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954" }}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>●</span>
      {rate}% saved
    </span>
  );
}

interface DiscoveryBreakProps {
  title: string;
  album: string;
  socialProof: string;
  aiReason: string;
  intensity: BreakIntensity;
  color: string;
}

function DiscoveryBreakRow({ title, album, socialProof, aiReason, intensity, color }: DiscoveryBreakProps) {
  // Matches the ghazal playlist's 5-column layout: 32px 1fr 1fr 120px 64px
  return (
    <div
      className="w-full rounded-md relative overflow-hidden group cursor-pointer transition-colors"
      style={{ background: "rgba(29,185,84,0.07)", borderLeft: "2px solid #1DB954" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(29,185,84,0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(29,185,84,0.07)"; }}
    >
      <div
        className="grid items-center py-2.5 px-2"
        style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
      >
        {/* # column */}
        <div className="flex items-center justify-center">
          <Play size={13} fill="#1DB954" className="text-[#1DB954] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Title column */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded flex-shrink-0 relative flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}99, ${color}33)` }}
          >
            <Music2 size={14} className="text-white/50" />
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#121212]"
              style={{ background: "#1DB954" }}
            />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#1DB954", lineHeight: 1 }}>
              🎵 Discovery Break
            </p>
            <p className="text-sm font-bold text-white truncate leading-snug">{title}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: "#A7A7A7" }}>{socialProof}</p>
            <p className="text-xs truncate italic" style={{ color: "#6b7280" }}>{aiReason}</p>
          </div>
        </div>

        {/* Album column */}
        <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline">
          {album}
        </span>

        {/* Date column — blank spacer to hold layout */}
        <span />

        {/* Trailing column — intensity badge where duration normally sits */}
        <div className="flex items-center justify-end">
          <IntensityBadge intensity={intensity} />
        </div>
      </div>
    </div>
  );
}

// ─── Taste Circles Main View ──────────────────────────────────────────────────

function TasteCirclesView({
  onSelectTrack,
  activeTrackId,
}: {
  onSelectTrack: (t: Track) => void;
  activeTrackId: number | null;
}) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Gradient header */}
      <div
        className="px-6 pt-16 pb-6"
        style={{ background: "linear-gradient(180deg, #0d2b1a 0%, #071510 60%, #121212 100%)" }}
      >
        <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-3">Taste Circle</p>
        <h1 className="text-white font-black mb-2" style={{ fontSize: "3rem", lineHeight: 1.1 }}>
          {TASTE_CIRCLE.name}
        </h1>
        <div className="flex items-center gap-1 text-sm mt-3">
          <span className="text-white font-bold">{TASTE_CIRCLE.listeners} listeners</span>
          <span className="text-[#A7A7A7]">with taste like yours</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 flex items-center gap-5" style={{ background: "linear-gradient(180deg, #071510 0%, #121212 100%)" }}>
        <button className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg">
          <Play size={24} fill="black" className="text-black ml-1" />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Shuffle size={22} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <CirclePlus size={22} />
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white transition-colors text-sm">
          <ListFilter size={14} />
          Filter
        </button>
      </div>

      {/* Table header */}
      <div className="px-6 border-b border-white/10 pb-2 mb-2">
        <div className="grid text-[#A7A7A7] text-sm" style={{ gridTemplateColumns: "32px 1fr 1fr 80px" }}>
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="text-right">Match</span>
        </div>
      </div>

      {/* Track list */}
      <div className="px-6 pb-8">
        {CIRCLE_TRACKS.map((track, i) => {
          const isActive = activeTrackId === track.id;
          const asTrack: Track = { id: track.id, title: track.title, artist: track.artist, album: track.album, dateAdded: "", duration: "", color: track.color };
          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(asTrack)}
              className="w-full group rounded-md hover:bg-[#282828] transition-colors"
            >
              <div className="grid items-center py-2.5 px-2 rounded-md" style={{ gridTemplateColumns: "32px 1fr 1fr 80px" }}>
                {/* Number / play */}
                <div className="flex items-center justify-center">
                  {isActive ? (
                    <span className="text-[#1DB954] text-xs font-bold">♪</span>
                  ) : (
                    <>
                      <span className="text-[#A7A7A7] text-sm group-hover:hidden">{i + 1}</span>
                      <Play size={14} fill="white" className="text-white hidden group-hover:block" />
                    </>
                  )}
                </div>

                {/* Title + artist + match reason */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${track.color}88, ${track.color}44)` }}
                  >
                    <Music2 size={14} className="text-white/50" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-[#1DB954]" : "text-white"}`}>{track.title}</p>
                    <p className="text-[#A7A7A7] text-xs truncate">{track.artist}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#6b7280" }}>{track.matchReason}</p>
                  </div>
                </div>

                {/* Album */}
                <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline cursor-pointer">
                  {track.album}
                </span>

                {/* Match badge */}
                <div className="flex justify-end">
                  <MatchBadge value={track.match} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Taste Circles Right Panel ────────────────────────────────────────────────

function TasteCirclesPanel() {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)", scrollbarWidth: "none" }}>
      {/* Circle name */}
      <div className="p-4 pb-3">
        <h2 className="text-white font-black text-lg leading-snug">{TASTE_CIRCLE.name}</h2>
        <p className="text-[#A7A7A7] text-xs mt-1">{TASTE_CIRCLE.listeners} listeners with taste like yours</p>
      </div>

      {/* Artists in this circle */}
      <div className="px-4 pt-3 pb-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Artists in this circle</p>
          <button className="text-[#A7A7A7] text-xs font-bold hover:text-white transition-colors">Show all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TASTE_CIRCLE.artists.map((artist) => (
            <div key={artist.name} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${artist.gradient} flex items-center justify-center ring-2 ring-transparent group-hover:ring-white/30 transition-all`}
              >
                <span className="text-white text-xs font-bold">{artist.initials}</span>
              </div>
              <span className="text-[#A7A7A7] text-xs text-center w-14 truncate group-hover:text-white transition-colors">{artist.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Songs trending in your circle */}
      <div className="px-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Trending in your circle</p>
        </div>
        <div className="flex flex-col gap-1">
          {TASTE_CIRCLE.trending.map((song) => (
            <button
              key={song.title}
              className="flex items-center gap-3 w-full rounded-md px-2 py-2 hover:bg-[#282828] transition-colors group text-left"
            >
              {/* Thumbnail */}
              <div
                className="w-9 h-9 rounded flex-shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${song.color}88, ${song.color}44)` }}
              >
                <Music2 size={12} className="text-white/50" />
              </div>
              {/* Title + artist */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{song.title}</p>
                <p className="text-[#A7A7A7] text-xs truncate">{song.artist}</p>
              </div>
              {/* Save-rate badge */}
              <SaveRateBadge rate={song.saveRate} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Finished Takeover ───────────────────────────────────────────────

function PlaylistFinishedTakeover({ onPlay, onRadio, onDismiss }: {
  onPlay: () => void;
  onRadio: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div
        className="relative w-full max-w-sm mx-6 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#181818", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Subtle green glow strip at top */}
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #1DB954, transparent)" }} />

        <div className="px-7 pt-7 pb-8 flex flex-col items-center text-center">
          {/* Heading */}
          <p className="text-[#A7A7A7] text-xs font-semibold uppercase tracking-widest mb-2">Before we continue…</p>
          <h2 className="text-white font-black mb-7" style={{ fontSize: "1.75rem", lineHeight: 1.15 }}>
            Playlist Finished
          </h2>

          {/* Recommendation card */}
          <div
            className="w-full rounded-xl p-4 flex gap-4 items-start mb-6 text-left"
            style={{ background: "#242424" }}
          >
            {/* Album art */}
            <div
              className="w-16 h-16 rounded-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f59e0b99, #d9770644)" }}
            >
              {/* inner icon feel */}
              <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c97d2088, #7c3a0a55)" }}>
                <span className="text-2xl">🎵</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold leading-snug truncate">R U Mine?</p>
              <p className="text-[#A7A7A7] text-xs mb-2">Arctic Monkeys</p>

              {/* Social proof */}
              <div className="flex items-center gap-1.5 mb-1">
                <div className="flex -space-x-1">
                  {["#8b5cf6","#3b82f6","#ec4899"].map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-[#242424]"
                      style={{ background: c, zIndex: 3 - i }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#1DB954" }}>82% added this to playlists</p>
              </div>

              {/* AI reason */}
              <p className="text-xs italic leading-snug" style={{ color: "#6b7280" }}>
                Matches the energy arc of your last 3 tracks
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <button
            onClick={onPlay}
            className="w-full h-12 rounded-full font-bold text-sm mb-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#1DB954", color: "#000" }}
          >
            Play Song
          </button>
          <button
            onClick={onRadio}
            className="w-full h-12 rounded-full font-bold text-sm transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent" }}
          >
            Continue Playlist Radio
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="mt-5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: "#535353" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Break Your Loop View ────────────────────────────────────────────────────

function BreakYourLoopView({ onGoHome, onGoTasteCircles, onPlayTrack }: {
  onGoHome: () => void;
  onGoTasteCircles: () => void;
  onPlayTrack: (t: Track) => void;
}) {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nowPlaying = playingId === id ? null : id;
    setPlayingId(nowPlaying);
    if (nowPlaying !== null) {
      const card = LOOP_NUDGE_CARDS.find((c) => c.id === id)!;
      onPlayTrack({
        id: card.id,
        title: card.title,
        artist: card.artist,
        album: card.album,
        dateAdded: "",
        duration: "",
        color: card.color,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#121212", scrollbarWidth: "none" }}>

      {/* ── Header block: same gradient treatment as playlist header ── */}
      <div
        className="px-6 pt-5 pb-6"
        style={{ background: "linear-gradient(180deg, #0d2b1a 0%, #071510 55%, #121212 100%)" }}
      >
        {/* Breadcrumb */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-1 mb-5 transition-colors hover:text-white text-sm"
          style={{ color: "#A7A7A7" }}
        >
          <ChevronLeft size={13} />
          Home
        </button>

        {/* Heading — same scale as playlist title */}
        <h1
          className="text-white font-black mb-2"
          style={{ fontSize: "3.5rem", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Break Your Loop
        </h1>

        {/* Sub-line — same gray as playlist description */}
        <p className="text-sm mb-4" style={{ color: "#A7A7A7" }}>
          Based on your listening in{" "}
          <span className="text-white font-medium">My Discovery Playlist</span>
        </p>

        {/* Taste tags — dark pill, white text, matches sidebar filter pills */}
        <div className="flex items-center gap-2">
          {LOOP_TASTE_TAGS.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "#2a2a2a", color: "#ffffff" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Column headers — same as playlist table header ── */}
      <div className="px-6 border-b border-white/10 pb-2 mb-0" style={{ background: "#121212" }}>
        <div
          className="grid text-xs font-medium"
          style={{ gridTemplateColumns: "40px 1fr auto", color: "#A7A7A7" }}
        >
          <span />
          <span>Recommendation</span>
          <span className="pr-2">Step</span>
        </div>
      </div>

      {/* ── Track-list style nudge rows ── */}
      <div className="pb-6" style={{ background: "#121212" }}>
        {LOOP_NUDGE_CARDS.map((card) => {
          const isPlaying = playingId === card.id;
          return (
            <div
              key={card.id}
              className="group cursor-pointer transition-colors"
              style={{
                borderLeft: "3px solid #1DB954",
                borderBottom: "1px solid #282828",
                background: isPlaying ? "#1e1e1e" : undefined,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#1e1e1e"; }}
              onMouseLeave={(e) => { if (!isPlaying) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              onClick={(e) => togglePlay(card.id, e)}
            >
              <div className="px-6 py-3">
                {/* Row 1: thumbnail · title/artist · badge */}
                <div className="grid items-center gap-3 mb-2" style={{ gridTemplateColumns: "40px 1fr auto" }}>

                  {/* Thumbnail — shows play/pause on hover, equalizer bars when playing */}
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${card.color}88, ${card.color}33)` }}
                  >
                    {/* Default: music note — hidden on hover or when playing */}
                    {!isPlaying && (
                      <Music2
                        size={14}
                        className="text-white/50 group-hover:opacity-0 transition-opacity absolute"
                      />
                    )}

                    {/* Playing state: animated equalizer bars */}
                    {isPlaying && (
                      <div className="flex items-end gap-[2px] h-4 absolute">
                        {[3, 5, 2, 4].map((h, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-sm"
                            style={{
                              height: `${h * 3}px`,
                              background: "#1DB954",
                              animation: `equalize ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Hover: play/pause button overlay — hidden when playing (replaced by bars) */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      </div>
                    )}

                    {/* When playing: pause icon appears on hover over the bars */}
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                        <Pause size={14} fill="white" className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Title + artist */}
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate leading-snug transition-colors"
                      style={{ color: isPlaying ? "#1DB954" : "#ffffff" }}
                    >
                      {card.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: "#A7A7A7" }}>
                      {card.artist} · {card.album}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <IntensityBadge intensity={card.intensity} />
                  </div>
                </div>

                {/* Row 2: because line */}
                <p className="text-xs font-semibold mb-1 pl-[52px]" style={{ color: "#1DB954" }}>
                  Because you love: <span className="font-bold">{card.sourceTack}</span>
                </p>

                {/* Row 3: AI explanation */}
                <p className="text-xs italic mb-2.5 pl-[52px] leading-relaxed" style={{ color: "#a0a0a0" }}>
                  {card.explanation}
                </p>

                {/* Row 4: save rate · preview · save */}
                <div className="flex items-center justify-between pl-[52px]">
                  <span className="text-xs" style={{ color: "#a0a0a0" }}>
                    {card.saveRate}% of listeners like you saved this
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                      onClick={(e) => { e.stopPropagation(); togglePlay(card.id, e); }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      {isPlaying
                        ? <><Pause size={9} fill="white" className="text-white" /> Pause</>
                        : <><Play size={9} fill="white" className="text-white" /> Preview</>
                      }
                    </button>
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
                      style={{ background: "#1DB954", color: "#000" }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1ed760"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1DB954"; }}
                    >
                      <Plus size={9} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-6 border-t border-white/10" style={{ background: "#121212" }}>
        <p className="text-sm mb-4" style={{ color: "#A7A7A7" }}>
          Want to see what listeners like you discovered?
        </p>
        <button
          onClick={onGoTasteCircles}
          className="w-full h-10 rounded-full text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          View Your Taste Circle
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Break Your Loop Right Panel ─────────────────────────────────────────────

function BreakYourLoopPanel() {
  const intensityCounts: Record<BreakIntensity, number> = { "Safe Step": 0, "Stretch": 0, "Leap": 0 };
  LOOP_NUDGE_CARDS.forEach((c) => { intensityCounts[c.intensity]++; });

  const spectrum: Array<{ label: BreakIntensity; emoji: string }> = [
    { label: "Safe Step", emoji: "🟢" },
    { label: "Stretch",   emoji: "🟡" },
    { label: "Leap",      emoji: "🔴" },
  ];

  const dotColor: Record<BreakIntensity, string> = { "Safe Step": "#1DB954", "Stretch": "#FAB005", "Leap": "#F87171" };

  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)", scrollbarWidth: "none" }}
    >
      {/* Title — same weight as "AI Taste Profile" in playlist right panel */}
      <div className="p-4 pb-3">
        <p className="text-white text-sm font-bold">Your AI Taste Profile</p>
      </div>

      {/* Taste tags — same small green pill already used in playlist right panel */}
      <div className="px-4 pb-4 flex flex-wrap gap-2 border-b border-white/10">
        {LOOP_TASTE_TAGS.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954", border: "1px solid rgba(29,185,84,0.3)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Core Artists — same style as Credits rows in Image 2 */}
      <div className="px-4 pt-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Core Artists</p>
        </div>
        <div className="flex flex-col gap-3">
          {LOOP_CORE_ARTISTS.map((artist, i) => (
            <div key={artist} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: (["#ef4444","#f97316","#ec4899"] as string[])[i] + "99" }}
                >
                  {artist[0]}
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{artist}</p>
                  <p className="text-xs" style={{ color: "#A7A7A7" }}>Main Artist</p>
                </div>
              </div>
              <button
                className="px-3 py-1 rounded-full text-xs font-bold transition-colors hover:border-white"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stepping Stones — minimal count rows with badge dots */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Stepping Stones</p>
          <span className="text-xs" style={{ color: "#A7A7A7" }}>{LOOP_NUDGE_CARDS.length} recs</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {spectrum.map(({ label }) => (
            <div key={label} className="flex items-center gap-2.5">
              {/* Coloured dot from badge config */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: dotColor[label] }}
              />
              <span className="text-xs flex-1" style={{ color: "#A7A7A7" }}>{label}</span>
              <span className="text-xs font-bold text-white">{intensityCounts[label]}</span>
              {/* Thin proportional bar */}
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "#282828" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(intensityCounts[label] / LOOP_NUDGE_CARDS.length) * 100}%`,
                    background: dotColor[label],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel({ view, activeTrack }: { view: "home" | "playlist" | "taste-circles" | "break-loop"; activeTrack: Track | null }) {
  if (view === "taste-circles") return <TasteCirclesPanel />;
  if (view === "break-loop") return <BreakYourLoopPanel />;

  if (view === "home") {
    return (
      <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="p-4 flex-shrink-0">
          <p className="text-white text-sm font-bold mb-3">My Discovery Playlist</p>
        </div>

        {/* Cover art */}
        <div className="mx-4 rounded-xl overflow-hidden flex-shrink-0 mb-4">
          <div
            className="w-full aspect-square flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1DB954 0%, #148a3d 50%, #0a4020 100%)" }}
          >
            <Disc size={64} className="text-white/20" />
          </div>
        </div>

        <div className="px-4 mb-4 flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg">
            <Play size={16} fill="black" className="text-black ml-0.5" />
          </button>
          <div>
            <p className="text-white text-sm font-bold">Do I Wanna Know?</p>
            <p className="text-[#A7A7A7] text-xs">Arctic Monkeys</p>
          </div>
        </div>

        <div className="px-4 border-t border-white/10 pt-4">
          <p className="text-white text-sm font-bold mb-3">AI Taste Profile</p>
          <div className="flex flex-wrap gap-2">
            {["Dreamy", "Indie", "Melancholic"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954", border: "1px solid rgba(29,185,84,0.3)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Playlist view right panel
  return (
    <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="p-4 flex-shrink-0">
        <p className="text-white text-sm font-bold mb-3">My Discovery Playlist</p>
      </div>

      {/* Green gradient cover art */}
      <div className="mx-4 rounded-xl overflow-hidden flex-shrink-0 mb-4">
        <div
          className="w-full aspect-square flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1DB954 0%, #148a3d 50%, #0a4020 100%)" }}
        >
          <Disc size={72} className="text-white/20" />
        </div>
      </div>

      {/* Now playing info */}
      <div className="px-4 mb-4">
        <p className="text-white text-sm font-bold mb-0.5 truncate">
          {activeTrack?.title ?? "Do I Wanna Know?"}
        </p>
        <p className="text-[#A7A7A7] text-xs truncate">
          {activeTrack?.artist ?? "Arctic Monkeys"}
        </p>
      </div>

      {/* AI Taste Profile */}
      <div className="px-4 border-t border-white/10 pt-4">
        <p className="text-white text-sm font-bold mb-3">AI Taste Profile</p>
        <div className="flex flex-wrap gap-2">
          {["Dreamy", "Indie", "Melancholic"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954", border: "1px solid rgba(29,185,84,0.3)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Repeat Pattern Banner ────────────────────────────────────────────────────

const BRANCH_CHIPS = [
  { artist: "The Strokes", title: "Last Nite", color: "#f87171" },
  { artist: "Vampire Weekend", title: "A-Punk", color: "#60a5fa" },
];

function RepeatPatternBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="flex-shrink-0 flex items-center px-4 gap-4 border-t border-white/10"
      style={{ height: "48px", background: "#1a1a1a" }}
    >
      {/* ── Left zone: mirrors player's w-[280px] left track area ── */}
      <div className="w-[280px] flex items-center gap-2.5 min-w-0 flex-shrink-0">
        {/* Loop icon */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(29,185,84,0.15)" }}
        >
          <Repeat size={11} style={{ color: "#1DB954" }} />
        </div>

        {/* Text lines */}
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate leading-tight">
            You've listened to Arctic Monkeys 17× this week
          </p>
          <p className="text-xs leading-tight truncate" style={{ color: "#A7A7A7" }}>
            People with similar taste recently branched into:
          </p>
        </div>
      </div>

      {/* ── Center zone: chips + CTA, mirrors player's flex-1 center ── */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {BRANCH_CHIPS.map((chip) => (
          <button
            key={chip.artist}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors flex-shrink-0 group"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.13)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
          >
            {/* Tiny thumbnail */}
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${chip.color}cc, ${chip.color}44)` }}
            />
            <span className="text-white text-xs font-medium whitespace-nowrap">{chip.artist}</span>
          </button>
        ))}

        <button className="text-xs font-semibold whitespace-nowrap ml-1 transition-colors hover:underline" style={{ color: "#1DB954" }}>
          Try one?
        </button>
      </div>

      {/* ── Right zone: w-[200px] spacer so nothing enters the icon cluster ── */}
      <div className="w-[200px] flex items-center justify-end flex-shrink-0">
        <button
          onClick={onDismiss}
          className="text-[#535353] hover:text-[#A7A7A7] transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ─── Bottom Player ────────────────────────────────────────────────────────────

function BottomPlayer({ track, isPlaying, onTogglePlay }: { track: Track | null; isPlaying: boolean; onTogglePlay: () => void }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(31); // percentage

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

  const currentSong = track ?? { title: "Do I Wanna Know?", artist: "Arctic Monkeys", duration: "4:32", color: "#ef4444", id: 0, album: "AM", dateAdded: "" };
  const elapsed = track ? "1:17" : "0:00";
  const total = track?.duration ?? "4:32";

  return (
    <div
      className="h-[72px] flex items-center px-4 gap-4 flex-shrink-0 border-t border-white/10"
      style={{ background: "#181818" }}
    >
      {/* Left: current track */}
      <div className="flex items-center gap-3 w-[280px] min-w-0">
        <div
          className="w-14 h-14 rounded flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${currentSong.color ?? "#888"}88, ${currentSong.color ?? "#888"}44)` }}
        />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
          <p className="text-[#A7A7A7] text-xs truncate">{currentSong.artist}</p>
        </div>
        <button className="text-[#A7A7A7] hover:text-[#1DB954] transition-colors flex-shrink-0">
          <Heart size={16} />
        </button>
      </div>

      {/* Center: controls + progress */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-[40%]">
        <div className="flex items-center gap-5">
          <button className="text-[#A7A7A7] hover:text-white transition-colors">
            <Shuffle size={16} />
          </button>
          <button className="text-[#A7A7A7] hover:text-white transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying
              ? <Pause size={14} fill="black" className="text-black" />
              : <Play size={14} fill="black" className="text-black ml-0.5" />
            }
          </button>
          <button className="text-[#A7A7A7] hover:text-white transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
          <button className="text-[#A7A7A7] hover:text-white transition-colors">
            <Repeat size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#A7A7A7] text-xs w-8 text-right">{elapsed}</span>
          <div
            ref={progressRef}
            className="flex-1 h-1 rounded-full cursor-pointer relative group"
            style={{ background: "#535353" }}
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full bg-white group-hover:bg-[#1DB954] transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
            </div>
          </div>
          <span className="text-[#A7A7A7] text-xs w-8">{total}</span>
        </div>
      </div>

      {/* Right: extra controls */}
      <div className="w-[200px] flex items-center justify-end gap-3">
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Mic2 size={15} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <ListMusic size={15} />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Laptop2 size={15} />
        </button>
        <div className="flex items-center gap-1.5">
          <button className="text-[#A7A7A7] hover:text-white transition-colors">
            <Volume2 size={15} />
          </button>
          <div
            className="w-20 h-1 rounded-full cursor-pointer relative group"
            style={{ background: "#535353" }}
          >
            <div className="h-full w-3/4 rounded-full bg-white group-hover:bg-[#1DB954] transition-colors relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
            </div>
          </div>
        </div>
        <button className="text-[#A7A7A7] hover:text-white transition-colors">
          <Maximize2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<"home" | "playlist" | "taste-circles" | "break-loop">("home");
  const [activeLibraryItem, setActiveLibraryItem] = useState("liked");
  const [activeLibraryTab, setActiveLibraryTab] = useState("Playlists");
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinishedTakeover, setShowFinishedTakeover] = useState(false);
  const [showRepeatBanner, setShowRepeatBanner] = useState(true);

  const handleSelectItem = (id: string) => {
    setActiveLibraryItem(id);
    if (id === "my-discovery") {
      setView("playlist");
    } else {
      setView("home");
    }
  };

  const handleSelectTrack = (t: Track) => {
    setActiveTrack(t);
    setIsPlaying(true);
    const isLast = t.id === DISCOVERY_TRACKS[DISCOVERY_TRACKS.length - 1].id;
    if (isLast) setShowFinishedTakeover(true);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: "#121212", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Top bar */}
      <TopBar onViewChange={setView} currentView={view} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar */}
        <LeftSidebar
          activeItem={activeLibraryItem}
          onSelectItem={handleSelectItem}
          currentTrack={activeTrack}
          activeTab={activeLibraryTab}
          onSelectTab={(tab) => {
            setActiveLibraryTab(tab);
            if (tab === "Taste Circles") setView("taste-circles");
          }}
        />

        {/* Center content */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "#121212" }}>
          {view === "home" ? (
            <HomeView
              onSelectPlaylist={() => { setView("playlist"); setActiveLibraryItem("my-discovery"); }}
              onSelectBreakLoop={() => setView("break-loop")}
            />
          ) : view === "playlist" ? (
            <PlaylistView onSelectTrack={handleSelectTrack} activeTrackId={activeTrack?.id ?? null} />
          ) : view === "break-loop" ? (
            <BreakYourLoopView
              onGoHome={() => setView("home")}
              onGoTasteCircles={() => setView("taste-circles")}
              onPlayTrack={handleSelectTrack}
            />
          ) : (
            <TasteCirclesView
              onSelectTrack={handleSelectTrack}
              activeTrackId={activeTrack?.id ?? null}
            />
          )}
        </div>

        {/* Right contextual panel */}
        <RightPanel view={view} activeTrack={activeTrack} />

        {/* Playlist finished takeover */}
        {showFinishedTakeover && (
          <PlaylistFinishedTakeover
            onPlay={() => setShowFinishedTakeover(false)}
            onRadio={() => setShowFinishedTakeover(false)}
            onDismiss={() => setShowFinishedTakeover(false)}
          />
        )}
      </div>

      {/* Repeat pattern banner */}
      {showRepeatBanner && (
        <RepeatPatternBanner onDismiss={() => setShowRepeatBanner(false)} />
      )}

      {/* Bottom player */}
      <BottomPlayer
        track={activeTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
      />
    </div>
  );
}
