import { Play, Shuffle, CirclePlus, ListFilter, Music2 } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { MatchBadge } from "./SafeStepBadge";
import SkeletonRow from "./SkeletonRow";

/** Deterministic pastel color from a string */
function strColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 55%, 45%)`;
}

export default function TasteCirclesView() {
  const { tasteCircle, tasteCircleTracks, currentTrack, setCurrentTrack, setIsPlaying, isLoadingAI } = useAppState();
  const activeTrackId = currentTrack?.id ?? null;

  const handleSelectTrack = (circleTrack) => {
    setCurrentTrack({
      id: circleTrack.id,
      name: circleTrack.title,
      artist: circleTrack.artist,
      album: circleTrack.album,
      dateAdded: "Jul 2, 2026",
      duration: "3:30",
    });
    setIsPlaying(true);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Gradient header */}
      <div
        className="px-6 pt-16 pb-6"
        style={{ background: "linear-gradient(180deg, #0d2b1a 0%, #071510 60%, #121212 100%)" }}
      >
        <p className="text-[#1DB954] text-xs font-bold uppercase tracking-widest mb-3">Taste Circle</p>
        <h1 className="text-white font-black mb-2" style={{ fontSize: "3rem", lineHeight: 1.1 }}>
          {tasteCircle.name}
        </h1>
        <div className="flex items-center gap-1 text-sm mt-3">
          <span className="text-white font-bold">{tasteCircle.listeners} listeners</span>
          <span className="text-[#A7A7A7]">with taste like yours</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 flex items-center gap-5" style={{ background: "linear-gradient(180deg, #071510 0%, #121212 100%)" }}>
        <button
          id="taste-circles-play-btn"
          className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition-all shadow-lg"
          onClick={() => tasteCircleTracks[0] && handleSelectTrack(tasteCircleTracks[0])}
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </button>
        <button className="text-[#A7A7A7] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"><Shuffle size={22} /></button>
        <button className="text-[#A7A7A7] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"><CirclePlus size={22} /></button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 text-sm">
          <ListFilter size={14} /> Filter
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
        {isLoadingAI ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))
        ) : (
          tasteCircleTracks.map((track, i) => {
            const isActive = activeTrackId === track.id;
          const color = strColor(track.artist);
          return (
            <button
              key={track.id}
              id={`taste-circles-track-${track.id}`}
              onClick={() => handleSelectTrack(track)}
              className="w-full group rounded-md hover:bg-[#282828] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left"
            >
              <div className="grid items-center py-2.5 px-2 rounded-md" style={{ gridTemplateColumns: "32px 1fr 1fr 80px" }}>
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

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                  >
                    <Music2 size={14} className="text-white/60" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-[#1DB954]" : "text-white"}`}>
                      {track.title}
                    </p>
                    <p className="text-[#A7A7A7] text-xs truncate">{track.artist}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#6b7280" }}>{track.matchReason}</p>
                  </div>
                </div>

                <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline cursor-pointer">
                  {track.album}
                </span>

                <div className="flex justify-end">
                  <MatchBadge value={track.match} />
                </div>
              </div>
            </button>
          );
        })
        )}
      </div>
    </div>
  );
}
