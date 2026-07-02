import { useAppState } from "../context/AppStateContext";

export default function EndOfPlaylistModal() {
  const {
    shouldShowEndOfPlaylist,
    setShouldShowEndOfPlaylist,
    setCurrentTrack,
    setIsPlaying,
    setSongsPlayedCount,
    currentQueue,
  } = useAppState();

  if (!shouldShowEndOfPlaylist) return null;

  const dismiss = () => setShouldShowEndOfPlaylist(false);

  const recommendedTrack = {
    id: "nudge-r-u-mine",
    name: "R U Mine?",
    artist: "Arctic Monkeys",
    album: "AM",
    dateAdded: "Jul 2, 2026",
    duration: "3:21",
  };

  const handlePlaySong = () => {
    setCurrentTrack(recommendedTrack);
    setIsPlaying(true);
    dismiss();
  };

  const handleContinueRadio = () => {
    setSongsPlayedCount(0);
    if (currentQueue && currentQueue.length > 0) {
      setCurrentTrack(currentQueue[0]);
      setIsPlaying(true);
    }
    dismiss();
  };

  return (
    <div
      id="end-of-playlist-modal-overlay"
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

        <div className="px-7 pt-7 pb-8 flex flex-col items-center text-center">
          <p className="text-[#A7A7A7] text-xs font-semibold uppercase tracking-widest mb-2">
            Before we continue…
          </p>
          <h2 className="text-white font-black mb-7" style={{ fontSize: "1.75rem", lineHeight: 1.15 }}>
            Playlist Finished
          </h2>

          {/* Recommendation card */}
          <div
            className="w-full rounded-xl p-4 flex gap-4 items-start mb-6 text-left"
            style={{ background: "#242424" }}
          >
            <div
              className="w-16 h-16 rounded-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f59e0b99, #d9770644)" }}
            >
              <div
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #c97d2088, #7c3a0a55)" }}
              >
                <span className="text-2xl">🎵</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold leading-snug truncate">R U Mine?</p>
              <p className="text-[#A7A7A7] text-xs mb-2">Arctic Monkeys</p>

              <div className="flex items-center gap-1.5 mb-1">
                <div className="flex -space-x-1">
                  {["#8b5cf6", "#3b82f6", "#ec4899"].map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-[#242424]"
                      style={{ background: c, zIndex: 3 - i }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#1DB954" }}>82% added this to playlists</p>
              </div>

              <p className="text-xs italic leading-snug" style={{ color: "#6b7280" }}>
                Matches the energy arc of your last 3 tracks
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <button
            id="end-of-playlist-play-btn"
            onClick={handlePlaySong}
            className="w-full h-12 rounded-full font-bold text-sm mb-3 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#1DB954", color: "#000" }}
          >
            Play Song
          </button>
          <button
            id="end-of-playlist-radio-btn"
            onClick={handleContinueRadio}
            className="w-full h-12 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              background: "transparent",
            }}
          >
            Continue Playlist Radio
          </button>

          <button
            id="end-of-playlist-skip-btn"
            onClick={dismiss}
            className="mt-5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ color: "#535353" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
