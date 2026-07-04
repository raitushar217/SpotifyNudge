import {
  Play, Shuffle, CirclePlus, Share2, MoreHorizontal,
  Mic2, ListFilter, Clock, Heart, Music2,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";

/** Deterministic pastel color from a string (for album-art placeholder) */
function artistColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 55%, 45%)`;
}

export default function PlaylistView() {
  const {
    currentPlaylist,
    currentQueue,
    currentTrack,
    shouldShowNudge,
    playTrack,
    playNext,
  } = useAppState();

  const activeTrackId = currentTrack?.id ?? null;
  const totalDuration = "38 min";

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* ── Gradient header ──────────────────────────────────────────────── */}
      <div
        className="px-6 pt-16 pb-6"
        style={{ background: "linear-gradient(180deg, #0d4a1f 0%, #072b12 60%, #121212 100%)" }}
      >
        <p className="text-white text-xs font-medium mb-3">Playlist</p>
        <h1
          className="text-white font-black mb-2"
          style={{ fontSize: "4.5rem", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          {currentPlaylist.name}
        </h1>
        <p className="text-[#A7A7A7] text-sm mb-1">{currentPlaylist.description}</p>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-white font-bold">{currentPlaylist.owner}</span>
          <span className="text-[#A7A7A7]">•</span>
          <span className="text-[#A7A7A7]">{currentQueue.length} songs • {totalDuration}</span>
        </div>
      </div>

      {/* ── Action bar ───────────────────────────────────────────────────── */}
      <div
        className="px-6 py-4 flex items-center gap-5"
        style={{ background: "linear-gradient(180deg, #061a0d 0%, #121212 100%)" }}
      >
        <button
          id="playlist-play-btn"
          className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg"
          onClick={() => playTrack(currentQueue[0])}
          aria-label="Play playlist from start"
        >
          <Play size={24} fill="black" className="text-black ml-1" />
        </button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors"><Shuffle size={22} /></button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors"><CirclePlus size={22} /></button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors"><Share2 size={20} /></button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors"><MoreHorizontal size={22} /></button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white transition-colors text-sm">
          <Mic2 size={14} /> Mic
        </button>
        <button className="flex items-center gap-1.5 text-[#A7A7A7] hover:text-white transition-colors text-sm">
          <ListFilter size={14} /> List
        </button>
      </div>

      {/* ── Table header ─────────────────────────────────────────────────── */}
      <div className="px-6 border-b border-white/10 pb-2 mb-2">
        <div
          className="grid text-[#A7A7A7] text-sm"
          style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
        >
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date added</span>
          <span className="flex justify-end"><Clock size={14} /></span>
        </div>
      </div>

      {/* ── Track list ───────────────────────────────────────────────────── */}
      <div className="px-6 pb-8">
        {currentQueue.map((track, i) => {
          const isActive = activeTrackId === track.id;
          const color = artistColor(track.artist);

          return (
            <div key={track.id}>
              {/* Track row */}
              <button
                id={`playlist-track-${track.id}`}
                onClick={() => playTrack(track)}
                className="w-full group rounded-md hover:bg-[#282828] transition-colors"
                aria-label={`Play ${track.name} by ${track.artist}`}
              >
                <div
                  className="grid items-center py-2.5 px-2 rounded-md"
                  style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
                >
                  {/* # / playing indicator */}
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

                  {/* Title + artist + thumbnail */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded flex-shrink-0 relative flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${color}cc, ${color}66)` }}
                    >
                      <Music2 size={14} className="text-white/60" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p
                        className={`text-sm font-medium truncate transition-colors ${
                          isActive ? "text-[#1DB954]" : "text-white"
                        }`}
                      >
                        {track.name}
                      </p>
                      <p className="text-[#A7A7A7] text-xs truncate">{track.artist}</p>
                    </div>
                  </div>

                  {/* Album */}
                  <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline cursor-pointer">
                    {track.album}
                  </span>

                  {/* Date added */}
                  <span className="text-[#A7A7A7] text-sm">{track.dateAdded}</span>

                  {/* Duration + hover actions */}
                  <div className="flex items-center justify-end gap-3">
                    <Heart
                      size={14}
                      className="text-[#A7A7A7] opacity-0 group-hover:opacity-100 hover:text-white transition-all"
                    />
                    {track.duration === "—" ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954" }}
                      >
                        ✓ Saved
                      </span>
                    ) : (
                      <span className="text-[#A7A7A7] text-sm">{track.duration}</span>
                    )}
                    <MoreHorizontal
                      size={14}
                      className="text-[#A7A7A7] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
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
