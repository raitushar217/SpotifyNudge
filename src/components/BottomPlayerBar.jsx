import { useRef, useState } from "react";
import {
  Shuffle, SkipBack, Play, Pause, SkipForward, Repeat,
  Mic2, ListMusic, Laptop2, Volume2, Maximize2, Heart, Music2,
} from "lucide-react";
import { useAppState } from "../context/AppStateContext";

/** Deterministic pastel color from a string */
function artistColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 55%, 45%)`;
}

export default function BottomPlayerBar() {
  // ── Context ──────────────────────────────────────────────────────────────
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    currentQueue,
    songsPlayedCount,
    activeQueueContext,
    tastecircleQueueIndex,
    discoveryBreakQueueIndex,
    tasteCircleTracks,
    nudgeCards,
  } = useAppState();

  // ── Progress bar (visual only — no real audio) ────────────────────────────
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const song = currentTrack;                      // always set (queue[0] on mount)
  const color = artistColor(song?.artist ?? "");
  const total = song?.duration ?? "4:32";

  // Track position in queue (context-aware)
  let isFirst = false;
  let isLast = false;
  let queueIdx = -1;
  let queueLength = 0;

  console.log("BottomPlayerBar render:", {
    activeQueueContext,
    tastecircleQueueIndex,
    discoveryBreakQueueIndex,
    tasteCircleTracks,
    nudgeCards,
    currentQueue,
  });

  if (activeQueueContext === "tastecircles") {
    isFirst = tastecircleQueueIndex <= 0;
    isLast = tastecircleQueueIndex === (tasteCircleTracks || []).length - 1;
    queueIdx = tastecircleQueueIndex;
    queueLength = (tasteCircleTracks || []).length;
  } else if (activeQueueContext === "discoverybreak") {
    isFirst = discoveryBreakQueueIndex <= 0;
    isLast = discoveryBreakQueueIndex === (nudgeCards || []).length - 1;
    queueIdx = discoveryBreakQueueIndex;
    queueLength = (nudgeCards || []).length;
  } else {
    // playlist
    const foundIdx = (currentQueue || []).findIndex((t) => t.id === song?.id);
    isFirst = foundIdx <= 0;
    isLast = foundIdx === (currentQueue || []).length - 1;
    queueIdx = foundIdx;
    queueLength = (currentQueue || []).length;
  }

  const handleNextClick = () => {
    console.log("Current activeQueueContext:", activeQueueContext);
    playNext();
  };

  const handlePrevClick = () => {
    console.log("Current activeQueueContext for Prev:", activeQueueContext);
    playPrev();
  };

  return (
    <div
      id="bottom-player-bar"
      className="h-[72px] flex items-center px-4 gap-4 flex-shrink-0 border-t border-white/10"
      style={{ background: "#181818" }}
    >
      {/* ── Left: current track info ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 w-[280px] min-w-0">
        {/* Album art placeholder */}
        <div
          className="w-14 h-14 rounded flex-shrink-0 flex items-center justify-center transition-all duration-300"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
        >
          <Music2 size={16} className="text-white/40" />
        </div>

        {/* Track name + artist */}
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate transition-all duration-200">
            {song?.name ?? "Do I Wanna Know?"}
          </p>
          <p className="text-[#A7A7A7] text-xs truncate">{song?.artist ?? "Arctic Monkeys"}</p>
        </div>

        {/* Heart */}
        <button
          className="text-[#A7A7A7] hover:text-[#1DB954] transition-colors flex-shrink-0"
          aria-label="Like track"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* ── Center: transport controls + progress bar ─────────────────────── */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-[40%]">
        {/* Transport row */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            className="text-[#A7A7A7] hover:text-white transition-colors"
            aria-label="Shuffle"
          >
            <Shuffle size={16} />
          </button>

          {/* Previous */}
          <button
            id="bottom-player-prev-btn"
            onClick={handlePrevClick}
            disabled={isFirst}
            className="transition-colors disabled:opacity-30"
            style={{ color: isFirst ? "#535353" : "#A7A7A7" }}
            onMouseEnter={(e) => { if (!isFirst) e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isFirst ? "#535353" : "#A7A7A7"; }}
            aria-label="Previous track"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>

          {/* Play / Pause — Requirement 6 */}
          <button
            id="bottom-player-play-pause-btn"
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying
              ? <Pause size={14} fill="black" className="text-black" />
              : <Play  size={14} fill="black" className="text-black ml-0.5" />
            }
          </button>

          {/* Next — Requirement 2 & 4 */}
          <button
            id="bottom-player-next-btn"
            onClick={handleNextClick}
            className="text-[#A7A7A7] hover:text-white transition-colors"
            style={{ color: isLast ? "#A7A7A7" : undefined }}
            aria-label="Next track"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            className="text-[#A7A7A7] hover:text-white transition-colors"
            aria-label="Repeat"
          >
            <Repeat size={16} />
          </button>
        </div>

        {/* Progress bar (click-to-seek, visual only) */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#A7A7A7] text-xs w-8 text-right select-none">
            0:00
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-1 rounded-full cursor-pointer relative group"
            style={{ background: "#535353" }}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-white group-hover:bg-[#1DB954] transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
            </div>
          </div>
          <span className="text-[#A7A7A7] text-xs w-8 select-none">{total}</span>
        </div>
      </div>

      {/* ── Right: utility controls ───────────────────────────────────────── */}
      <div className="w-[200px] flex items-center justify-end gap-3">
        {/* Queue position pill */}
        {queueIdx >= 0 && (
          <span className="text-[#535353] text-xs tabular-nums select-none">
            {queueIdx + 1} / {queueLength}
          </span>
        )}

        <button className="text-[#A7A7A7] hover:text-white transition-colors" aria-label="Lyrics"><Mic2 size={15} /></button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors" aria-label="Queue"><ListMusic size={15} /></button>
        <button className="text-[#A7A7A7] hover:text-white transition-colors" aria-label="Connect device"><Laptop2 size={15} /></button>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <button className="text-[#A7A7A7] hover:text-white transition-colors" aria-label="Volume"><Volume2 size={15} /></button>
          <div className="w-20 h-1 rounded-full cursor-pointer relative group" style={{ background: "#535353" }}>
            <div className="h-full w-3/4 rounded-full bg-white group-hover:bg-[#1DB954] transition-colors relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
            </div>
          </div>
        </div>

        <button className="text-[#A7A7A7] hover:text-white transition-colors" aria-label="Full screen"><Maximize2 size={15} /></button>
      </div>
    </div>
  );
}
