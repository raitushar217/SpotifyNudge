import { useAppState } from "../context/AppStateContext";
import { Music2 } from "lucide-react";
import { IntensityBadge } from "./SafeStepBadge";

/** Deterministic pastel color from a string */
function artistColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 55%, 45%)`;
}

export default function DiscoveryBreakModal() {
  const {
    shouldShowNudge,
    setShouldShowNudge,
    playTrack,
    addToSavedForLater,
    appendToPlaylist,
    savedForLater,
    showToast,
    isLoadingAI,
    nudgeCards,
    songsPlayedCount,
  } = useAppState();

  if (!shouldShowNudge) return null;

  // Selected card based on cycle index
  const cardIndex = Math.max(0, Math.floor(songsPlayedCount / 4 - 1));
  const activeCard = nudgeCards && nudgeCards.length > 0
    ? nudgeCards[cardIndex % nudgeCards.length]
    : null;

  const nudgeTrack = activeCard || {
    id: "nudge-fallback-d",
    name: "Fluorescent Adolescent",
    title: "Fluorescent Adolescent",
    artist: "Arctic Monkeys",
    album: "Suck It and See",
    explanation: "Brighter, faster tempo — same witty lyricism you love, just a shade lighter.",
    intensity: "Safe Step",
    saveRate: 78,
    saveRatePercent: 78,
  };

  const nudgeTrackForPlayback = {
    id: nudgeTrack.id,
    name: nudgeTrack.name || nudgeTrack.title,
    artist: nudgeTrack.artist,
    album: nudgeTrack.album || "Single",
    dateAdded: "Discovery Break",
    duration: "3:30",
  };

  const dismiss = () => setShouldShowNudge(false);

  const handlePlay = () => {
    playTrack(nudgeTrackForPlayback);
    dismiss();
    showToast(`Playing ${nudgeTrackForPlayback.name} — ${nudgeTrackForPlayback.artist}`);
  };

  const handleSave = () => {
    // Format today's date as "Mon D, YYYY"
    const today = new Date();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formattedDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    const trackForPlaylist = {
      id: "saved-" + Date.now(),
      name: nudgeTrack.name || nudgeTrack.title,
      artist: nudgeTrack.artist,
      album: "Discovered via Taste Circles",
      dateAdded: formattedDate,
      duration: "—",
    };

    addToSavedForLater(trackForPlaylist);
    appendToPlaylist(trackForPlaylist);
    showToast(`Saved to Library`);
  };

  const trackName = (nudgeTrack.name || nudgeTrack.title || "").toLowerCase();
  const trackArtist = (nudgeTrack.artist || "").toLowerCase();
  const isSaved = savedForLater.some(
    (x) => (x.name || "").toLowerCase() === trackName && (x.artist || "").toLowerCase() === trackArtist
  );

  const color = artistColor(nudgeTrack.artist);

  return (
    <div
      id="discovery-break-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        className="relative w-full max-w-sm mx-6 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#181818",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Green glow strip */}
        <div
          className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent, #1DB954, transparent)" }}
        />

        {/* Dismiss 'X' button in top-right */}
        <button
          id="discovery-modal-x-btn"
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#A7A7A7] hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Close Discovery Break"
        >
          ×
        </button>

        <div className="px-7 pt-8 pb-8 flex flex-col items-center text-center">
          <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-1">
            🎵 Discovery Break
          </p>
          <p className="text-[#A7A7A7] text-xs mb-6">A stepping stone recommendations break</p>

          {isLoadingAI ? (
            <div className="w-full animate-pulse text-left">
              <div className="rounded-xl p-4 bg-[#242424] flex gap-4 items-start mb-6">
                <div className="w-16 h-16 rounded-lg bg-white/10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="h-4 w-24 rounded bg-white/10" />
                    <div className="h-5 w-12 rounded-full bg-white/10" />
                  </div>
                  <div className="h-3 w-32 rounded bg-white/10 mb-3" />
                  <div className="h-3 w-40 rounded bg-white/10 mb-2" />
                  <div className="h-2.5 w-full rounded bg-white/10 mb-1" />
                  <div className="h-2.5 w-3/4 rounded bg-white/10" />
                </div>
              </div>
              <div className="w-full h-12 rounded-full bg-white/10 mb-3" />
              <div className="w-full h-12 rounded-full bg-white/10 mb-5" />
            </div>
          ) : (
            <>
              {/* Recommendation card */}
              <div
                className="w-full rounded-xl p-4 flex gap-4 items-start mb-6 text-left"
                style={{ background: "#242424" }}
              >
                <div
                  className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                >
                  <Music2 size={24} className="text-white/60" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-white text-sm font-bold leading-snug truncate">
                      {nudgeTrack.name || nudgeTrack.title}
                    </p>
                    <div className="flex-shrink-0">
                      <IntensityBadge intensity={nudgeTrack.intensity || "Stretch"} />
                    </div>
                  </div>
                  <p className="text-[#A7A7A7] text-xs mb-2">{nudgeTrack.artist} • {nudgeTrack.album}</p>

                  <p className="text-xs font-semibold mb-1" style={{ color: "#1DB954" }}>
                    {nudgeTrack.saveRate || nudgeTrack.saveRatePercent}% of listeners like you saved this
                  </p>
                  <p className="text-xs italic leading-normal" style={{ color: "#a0a0a0" }}>
                    {nudgeTrack.explanation}
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <button
                id="discovery-modal-play-btn"
                onClick={handlePlay}
                className="w-full h-12 rounded-full font-bold text-sm mb-3 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "#1DB954", color: "#000" }}
              >
                Play Song
              </button>
              <button
                id="discovery-modal-save-btn"
                onClick={handleSave}
                disabled={isSaved}
                className="w-full h-12 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: isSaved ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.25)",
                  color: isSaved ? "#A7A7A7" : "#fff",
                  background: isSaved ? "rgba(255,255,255,0.05)" : "transparent",
                }}
              >
                {isSaved ? "Saved ✓" : "Save for later"}
              </button>

              <button
                id="discovery-modal-skip-btn"
                onClick={dismiss}
                className="mt-5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ color: "#535353" }}
              >
                Skip for now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
