import { useNavigate } from "react-router";
import { ChevronRight, Play, Disc } from "lucide-react";
import { homeCards } from "../data/samplePlaylist";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Sticky music/podcast tabs */}
      <div className="sticky top-0 z-10 px-6 pt-4 pb-3 flex gap-2" style={{ background: "#121212" }}>
        <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95">Music</button>
        <button className="px-4 py-1.5 rounded-full text-white text-sm font-medium hover:bg-[#282828] transition-all duration-200 hover:scale-105 active:scale-95">Podcasts</button>
      </div>

      <div className="px-6 pb-8">
        {/* Top row of quick-access cards */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 items-end" style={{ scrollbarWidth: "none" }}>
          {homeCards.map((card) => (
            <button
              key={card.id}
              id={`home-card-${card.id}`}
              onClick={card.id === "demo-playlist" ? () => navigate("/playlist/demo") : undefined}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 text-left ${
                card.isMain ? "w-36" : "w-28"
              }`}
            >
              <div
                className={`w-full relative flex items-center justify-center ${
                  card.isMain ? "h-20" : "h-16"
                }`}
                style={{ background: `linear-gradient(135deg, ${card.color}cc, ${card.color}55)` }}
              >
                <Disc size={card.isMain ? 28 : 22} className="text-white/30" />
              </div>
              <div className="p-1.5" style={{ background: "#1a1a1a" }}>
                <p className={`text-white font-medium truncate ${
                  card.isMain ? "text-sm" : "text-xs"
                }`}>{card.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Picked for you */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Picked for you</h2>
          </div>
          <div className="flex gap-4">
            {/* My Discovery Playlist — featured large card */}
            <button
              id="home-featured-discovery"
              onClick={() => navigate("/playlist/demo")}
              className="flex-shrink-0 w-52 rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] text-left group relative"
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
                {homeCards.slice(1).map((card) => (
                  <button
                    key={card.id}
                    className="w-36 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 text-left group relative"
                  >
                    <div
                      className="w-full h-36 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${card.color}cc, ${card.color}55)` }}
                    >
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
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Break Your Loop */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Break Your Loop</h2>
            <button className="text-[#A7A7A7] text-sm font-bold hover:text-white transition-all duration-200 hover:scale-105 active:scale-95">Show all</button>
          </div>
          <button
            id="home-break-your-loop-banner"
            onClick={() => navigate("/break-your-loop")}
            className="flex items-center gap-5 px-5 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left group"
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
          </button>
        </div>

        {/* Recents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Recents</h2>
            <button className="text-[#A7A7A7] text-sm font-bold hover:text-white transition-all duration-200 hover:scale-105 active:scale-95">Show all</button>
          </div>
          <button
            id="home-recents-discovery"
            onClick={() => navigate("/playlist/demo")}
            className="w-full rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left group relative"
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
