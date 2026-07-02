import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Play, Pause, Plus, Music2, RefreshCw } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { IntensityBadge } from "./SafeStepBadge";
import SkeletonNudgeCard from "./SkeletonNudgeCard";

/** Deterministic pastel color from a string */
function artistColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 55%, 45%)`;
}

export default function BreakYourLoopScreen() {
  const navigate = useNavigate();
  const {
    nudgeCards,
    tasteProfile,
    currentPlaylist,
    setCurrentTrack,
    setIsPlaying,
    addToSavedForLater,
    savedForLater,
    showToast,
    isLoadingAI,
    regenerateAI,
  } = useAppState();
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id, e) => {
    e.stopPropagation();
    const nowPlaying = playingId === id ? null : id;
    setPlayingId(nowPlaying);
    if (nowPlaying !== null) {
      const card = nudgeCards.find((c) => c.id === id);
      if (card) {
        setCurrentTrack({
          id: card.id,
          name: card.title,
          artist: card.artist,
          album: card.album,
          dateAdded: "",
          duration: "",
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#121212", scrollbarWidth: "none" }}>
      {/* Header */}
      <div
        className="px-6 pt-5 pb-6"
        style={{ background: "linear-gradient(180deg, #0d2b1a 0%, #071510 55%, #121212 100%)" }}
      >
        <button
          id="break-loop-back-btn"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 mb-5 transition-all duration-200 hover:scale-105 active:scale-95 text-sm hover:text-white"
          style={{ color: "#A7A7A7" }}
        >
          <ChevronLeft size={13} />
          Home
        </button>

        <h1
          className="text-white font-black mb-2"
          style={{ fontSize: "3.5rem", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Break Your Loop
        </h1>

        <p className="text-sm mb-4" style={{ color: "#A7A7A7" }}>
          Based on your listening in{" "}
          <span className="text-white font-medium">{currentPlaylist.name}</span>
        </p>

        {/* Taste tags & Regenerate Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isLoadingAI ? (
              <>
                <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
                <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse" />
                <div className="h-6 w-14 rounded-full bg-white/10 animate-pulse" />
              </>
            ) : (
              (tasteProfile.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "#2a2a2a", color: "#ffffff" }}
                >
                  {tag}
                </span>
              ))
            )}
          </div>

          <button
            onClick={() => regenerateAI()}
            disabled={isLoadingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-black"
            style={{ background: "#1DB954" }}
          >
            <RefreshCw size={12} className={isLoadingAI ? "animate-spin" : ""} />
            {isLoadingAI ? "Regenerating..." : "Regenerate Recommendations"}
          </button>
        </div>
      </div>

      {/* Column headers */}
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

      {/* Nudge rows */}
      <div className="pb-6" style={{ background: "#121212" }}>
        {isLoadingAI ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonNudgeCard key={i} />
          ))
        ) : (
          nudgeCards.map((card) => {
            const isPlaying = playingId === card.id;
          const color = artistColor(card.artist);
          const isSaved = savedForLater.some((x) => x.id === card.id || x.name === card.title);

          return (
            <div
              key={card.id}
              id={`break-loop-card-${card.id}`}
              className="group cursor-pointer transition-colors"
              style={{
                borderLeft: "3px solid #1DB954",
                borderBottom: "1px solid #282828",
                background: isPlaying ? "#1e1e1e" : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e1e1e";
              }}
              onMouseLeave={(e) => {
                if (!isPlaying) e.currentTarget.style.background = "transparent";
              }}
              onClick={(e) => togglePlay(card.id, e)}
            >
              <div className="px-6 py-3">
                {/* Row 1: thumbnail · title/artist · badge */}
                <div className="grid items-center gap-3 mb-2" style={{ gridTemplateColumns: "40px 1fr auto" }}>
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                  >
                    {!isPlaying && (
                      <Music2 size={14} className="text-white/60 group-hover:opacity-0 transition-opacity absolute" />
                    )}
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
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded">
                        <Pause size={14} fill="white" className="text-white" />
                      </div>
                    )}
                  </div>

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

                {/* Row 2: because */}
                <p className="text-xs font-semibold mb-1 pl-[52px]" style={{ color: "#1DB954" }}>
                  Because you love: <span className="font-bold">{card.sourceTrack}</span>
                </p>

                {/* Row 3: AI explanation */}
                <p className="text-xs italic mb-2.5 pl-[52px] leading-relaxed" style={{ color: "#a0a0a0" }}>
                  {card.explanation}
                </p>

                {/* Row 4: save rate + actions */}
                <div className="flex items-center justify-between pl-[52px]">
                  <span className="text-xs" style={{ color: "#a0a0a0" }}>
                    {card.saveRate}% of listeners like you saved this
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", background: "transparent" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(card.id, e);
                      }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={9} fill="white" className="text-white" /> Pause
                        </>
                      ) : (
                        <>
                          <Play size={9} fill="white" className="text-white" /> Preview
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isSaved ? "rgba(255,255,255,0.05)" : "#1DB954",
                        color: isSaved ? "#A7A7A7" : "#000",
                        border: isSaved ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                      disabled={isSaved}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToSavedForLater({
                          id: card.id,
                          name: card.title,
                          artist: card.artist,
                          album: card.album,
                          dateAdded: "",
                          duration: "",
                        });
                        showToast(`Saved to Library`);
                      }}
                    >
                      {!isSaved && <Plus size={9} />}
                      {isSaved ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-white/10" style={{ background: "#121212" }}>
        <p className="text-sm mb-4" style={{ color: "#A7A7A7" }}>
          Want to see what listeners like you discovered?
        </p>
        <button
          id="break-loop-taste-circles-btn"
          onClick={() => navigate("/taste-circles")}
          className="w-full h-10 rounded-full text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", background: "transparent" }}
        >
          View Your Taste Circle →
        </button>
      </div>
    </div>
  );
}
