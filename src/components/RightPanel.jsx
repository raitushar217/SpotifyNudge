import { useLocation } from "react-router";
import { Disc, Music2 } from "lucide-react";
import { useAppState } from "../context/AppStateContext";
import { SaveRateBadge } from "./SafeStepBadge";

/** Deterministic pastel color from a string */
function strColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return `hsl(${h % 360}, 50%, 42%)`;
}

// ─── Taste Circles right panel ────────────────────────────────────────────────

function TasteCirclesPanel() {
  const { tasteCircle, isLoadingAI } = useAppState();
  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)", scrollbarWidth: "none" }}
    >
      <div className="p-4 pb-3">
        <h2 className="text-white font-black text-lg leading-snug">
          {isLoadingAI ? <div className="h-6 w-32 rounded bg-white/10 animate-pulse" /> : tasteCircle.name}
        </h2>
        <p className="text-[#A7A7A7] text-xs mt-1">
          {isLoadingAI ? (
            <div className="h-3 w-40 rounded bg-white/10 animate-pulse mt-1" />
          ) : (
            `${tasteCircle.listeners} listeners with taste like yours`
          )}
        </p>
      </div>

      {/* Artists in this circle */}
      <div className="px-4 pt-3 pb-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Artists in this circle</p>
          <button className="text-[#A7A7A7] text-xs font-bold hover:text-white transition-colors">Show all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {isLoadingAI ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div className="h-2 w-10 rounded bg-white/10" />
              </div>
            ))
          ) : (
            tasteCircle.artists.map((artist) => (
              <div key={artist.name} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-white/30 transition-all"
                  style={{ background: `linear-gradient(135deg, ${artist.gradientFrom}, ${artist.gradientTo})` }}
                >
                  <span className="text-white text-xs font-bold">{artist.initials}</span>
                </div>
                <span className="text-[#A7A7A7] text-xs text-center w-14 truncate group-hover:text-white transition-colors">
                  {artist.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trending in your circle */}
      <div className="px-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Trending in your circle</p>
        </div>
        <div className="flex flex-col gap-1">
          {isLoadingAI ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 w-full rounded-md px-2 py-2 animate-pulse">
                <div className="w-9 h-9 rounded bg-white/10 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-2.5 w-16 rounded bg-white/10" />
                </div>
                <div className="h-5 w-10 rounded-full bg-white/10" />
              </div>
            ))
          ) : (
            tasteCircle.trending.map((song) => {
              const color = strColor(song.artist);
              return (
                <button
                  key={song.title}
                  className="flex items-center gap-3 w-full rounded-md px-2 py-2 hover:bg-[#282828] transition-colors group text-left"
                >
                  <div
                    className="w-9 h-9 rounded flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
                  >
                    <Music2 size={12} className="text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{song.title}</p>
                    <p className="text-[#A7A7A7] text-xs truncate">{song.artist}</p>
                  </div>
                  <SaveRateBadge rate={song.saveRate} />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Break Your Loop right panel ──────────────────────────────────────────────

function BreakYourLoopPanel() {
  const { nudgeCards, tasteProfile, isLoadingAI } = useAppState();
  const intensityCounts = { "Safe Step": 0, Stretch: 0, Leap: 0 };
  nudgeCards.forEach((c) => {
    if (intensityCounts[c.intensity] !== undefined) {
      intensityCounts[c.intensity]++;
    }
  });

  const spectrum = [
    { label: "Safe Step" },
    { label: "Stretch" },
    { label: "Leap" },
  ];
  const dotColor = { "Safe Step": "#1DB954", Stretch: "#FAB005", Leap: "#F87171" };

  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)", scrollbarWidth: "none" }}
    >
      <div className="p-4 pb-3">
        <p className="text-white text-sm font-bold">Your AI Taste Profile</p>
      </div>

      {/* Taste tags */}
      <div className="px-4 pb-4 flex flex-wrap gap-2 border-b border-white/10">
        {isLoadingAI ? (
          <>
            <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse" />
            <div className="h-6 w-14 rounded-full bg-white/10 animate-pulse" />
          </>
        ) : (
          tasteProfile.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(29,185,84,0.15)",
                color: "#1DB954",
                border: "1px solid rgba(29,185,84,0.3)",
              }}
            >
              {tag}
            </span>
          ))
        )}
      </div>

      {/* Core artists */}
      <div className="px-4 pt-4 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Core Artists</p>
        </div>
        <div className="flex flex-col gap-3">
          {isLoadingAI ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-20 rounded bg-white/10" />
                    <div className="h-2.5 w-12 rounded bg-white/10" />
                  </div>
                </div>
                <div className="h-6 w-14 rounded-full bg-white/10" />
              </div>
            ))
          ) : (
            tasteProfile.coreArtists.map((artist, i) => (
              <div key={artist} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: ["#ef4444", "#f97316", "#ec4899"][i % 3] + "99" }}
                  >
                    {artist[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{artist}</p>
                    <p className="text-xs" style={{ color: "#A7A7A7" }}>
                      Main Artist
                    </p>
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 hover:border-white"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stepping stones breakdown */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-bold">Stepping Stones</p>
          <span className="text-xs" style={{ color: "#A7A7A7" }}>
            {isLoadingAI ? "" : `${nudgeCards.length} recs`}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {isLoadingAI ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white/10 flex-shrink-0" />
                <div className="h-3 w-16 rounded bg-white/10 flex-1" />
                <div className="h-3 w-4 rounded bg-white/10" />
                <div className="w-16 h-1 rounded bg-white/10" />
              </div>
            ))
          ) : (
            spectrum.map(({ label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor[label] }} />
                <span className="text-xs flex-1" style={{ color: "#A7A7A7" }}>
                  {label}
                </span>
                <span className="text-xs font-bold text-white">{intensityCounts[label]}</span>
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "#282828" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${nudgeCards.length ? (intensityCounts[label] / nudgeCards.length) * 100 : 0}%`,
                      background: dotColor[label],
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Playlist / Home right panel ──────────────────────────────────────────────

function PlaylistHomePanel() {
  const { currentTrack, currentPlaylist, tasteProfile, isLoadingAI } = useAppState();
  return (
    <div
      className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
      style={{ background: "#121212", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="p-4 flex-shrink-0">
        <p className="text-white text-sm font-bold mb-3">{currentPlaylist.name}</p>
      </div>

      <div className="mx-4 rounded-xl overflow-hidden flex-shrink-0 mb-4">
        <div
          className="w-full aspect-square flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${currentPlaylist.coverColor} 0%, #0a4020 100%)` }}
        >
          <Disc size={64} className="text-white/20" />
        </div>
      </div>

      <div className="px-4 mb-4">
        <p className="text-white text-sm font-bold mb-0.5 truncate">{currentTrack?.name ?? "Do I Wanna Know?"}</p>
        <p className="text-[#A7A7A7] text-xs truncate">{currentTrack?.artist ?? "Arctic Monkeys"}</p>
      </div>

      {/* Taste tags */}
      <div className="px-4 border-t border-white/10 pt-4">
        <p className="text-white text-sm font-bold mb-3">AI Taste Profile</p>
        <div className="flex flex-wrap gap-2">
          {isLoadingAI ? (
            <>
              <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-white/10 animate-pulse" />
              <div className="h-6 w-14 rounded-full bg-white/10 animate-pulse" />
            </>
          ) : (
            tasteProfile.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(29,185,84,0.15)",
                  color: "#1DB954",
                  border: "1px solid rgba(29,185,84,0.3)",
                }}
              >
                {tag}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Router-aware dispatcher ──────────────────────────────────────────────────

export default function RightPanel() {
  const { pathname } = useLocation();
  if (pathname === "/taste-circles") return <TasteCirclesPanel />;
  if (pathname === "/break-your-loop") return <BreakYourLoopPanel />;
  return <PlaylistHomePanel />;
}
