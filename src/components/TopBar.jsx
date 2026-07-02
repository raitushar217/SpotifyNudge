import { useNavigate, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Home,
  Download,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";

export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isLoadingAI } = useAppState();
  const isHome = pathname === "/";
  const isTasteCircles = pathname === "/taste-circles";

  return (
    <div
      className="h-16 flex items-center px-4 gap-3 flex-shrink-0"
      style={{ background: "rgba(18,18,18,0.95)" }}
    >
      {/* Nav arrows */}
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button
        onClick={() => navigate(1)}
        className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <ChevronRight size={18} className="text-white" />
      </button>

      {/* Home icon */}
      <button
        id="topbar-home-btn"
        onClick={() => navigate("/")}
        title="Home"
        className="w-8 h-8 flex items-center justify-center transition-colors"
        style={{ color: isHome ? "#ffffff" : "#A7A7A7" }}
        onMouseEnter={(e) => { if (!isHome) e.currentTarget.style.color = "#ffffff"; }}
        onMouseLeave={(e) => { if (!isHome) e.currentTarget.style.color = "#A7A7A7"; }}
      >
        <Home size={18} />
      </button>

      {/* Taste Circles icon */}
      <button
        id="topbar-taste-circles-btn"
        onClick={() => navigate("/taste-circles")}
        title="Taste Circles"
        className="w-8 h-8 flex items-center justify-center transition-colors"
        style={{ color: isTasteCircles ? "#ffffff" : "#A7A7A7" }}
        onMouseEnter={(e) => { if (!isTasteCircles) e.currentTarget.style.color = "#ffffff"; }}
        onMouseLeave={(e) => { if (!isTasteCircles) e.currentTarget.style.color = "#A7A7A7"; }}
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
          id="topbar-search-input"
          type="text"
          placeholder="What do you want to play?"
          className="w-full h-9 rounded-full pl-9 pr-4 text-sm text-white placeholder-[#A7A7A7] outline-none focus:ring-1 focus:ring-white/40"
          style={{ background: "#2a2a2a", border: "1px solid transparent" }}
        />
      </div>

      {isLoadingAI && (
        <div
          id="topbar-loading-indicator"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1db954]/10 border border-[#1db954]/20 animate-pulse ml-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
          <span className="text-[#1DB954] text-xs font-bold whitespace-nowrap">Analyzing your taste...</span>
        </div>
      )}

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
