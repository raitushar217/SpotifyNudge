import { useNavigate, useLocation } from "react-router";
import { ListMusic, Plus, Music2 } from "lucide-react";
import { sidebarLibrary } from "../data/samplePlaylist";
import { useAppState } from "../context/AppStateContext";

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

const TABS = ["Playlists", "Artists", "Albums", "Podcasts", "Taste Circles"];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentTrack } = useAppState();

  const activeItem = (pathname === "/playlist/demo") ? "demo-playlist" : "";

  const handleSelectItem = (id) => {
    if (id === "demo-playlist" || id === "my-discovery") {
      navigate("/playlist/demo");
    } else {
      navigate("/");
    }
  };

  const handleSelectTab = (tab) => {
    if (tab === "Taste Circles") {
      navigate("/taste-circles");
    }
  };

  return (
    <div className="w-60 flex flex-col flex-shrink-0 overflow-hidden" style={{ background: "#000000" }}>
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
        <SpotifyLogo />
      </div>

      {/* Library header */}
      <div className="px-4 flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ListMusic size={16} className="text-[#A7A7A7]" />
          <span className="text-[#A7A7A7] text-sm font-bold">Your Library</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-[#A7A7A7] hover:text-white hover:bg-[#1a1a1a] transition-all duration-200 hover:scale-105 active:scale-95">
            <Plus size={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-[#A7A7A7] hover:text-white hover:bg-[#1a1a1a] transition-all duration-200 hover:scale-105 active:scale-95 text-xs font-bold px-1">
            Create
          </button>
        </div>
      </div>

      {/* Library tabs */}
      <div className="px-2 flex gap-1 mb-3 flex-shrink-0 flex-wrap">
        {TABS.map((tab) => {
          const isActive = (tab === "Taste Circles" && pathname === "/taste-circles") ||
                           (tab === "Playlists" && pathname.startsWith("/playlist"));
          return (
            <button
              key={tab}
              id={`sidebar-tab-${tab.toLowerCase().replace(" ", "-")}`}
              onClick={() => handleSelectTab(tab)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:text-white"
              style={isActive ? { background: "#282828", color: "white" } : { color: "#A7A7A7" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#1a1a1a"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
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
        <button className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-gray-200">
          Import library
        </button>
      </div>

      {/* Recents label */}
      <div className="px-4 flex items-center justify-between mb-1 flex-shrink-0">
        <span className="text-[#A7A7A7] text-xs font-medium">Recents</span>
      </div>

      {/* Library list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
        {sidebarLibrary.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => handleSelectItem(item.id)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#1a1a1a] text-left"
              style={isActive ? { background: "#1a1a1a" } : {}}
            >
              <div
                className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${item.color}cc, ${item.color}66)` }}
              >
                <span className="text-white/70 font-bold text-sm">{item.letter}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate font-medium text-white">{item.name}</p>
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
              <p className="text-white text-xs font-medium truncate">{currentTrack.name}</p>
              <p className="text-[#A7A7A7] text-xs truncate">{currentTrack.artist}</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#1DB954] flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}
