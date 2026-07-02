import { useAppState } from "../context/AppStateContext";
import { Repeat } from "lucide-react";

export default function RepeatBehaviorBanner() {
  const {
    shouldShowRepeatBanner,
    setShouldShowRepeatBanner,
    repeatData,
    playArtistFallback,
  } = useAppState();

  if (!shouldShowRepeatBanner) return null;

  return (
    <div
      id="repeat-behavior-banner"
      className="flex-shrink-0 flex items-center px-4 gap-4 border-t border-white/10"
      style={{ height: "48px", background: "#1a1a1a" }}
    >
      {/* Left zone */}
      <div className="w-[280px] flex items-center gap-2.5 min-w-0 flex-shrink-0">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(29,185,84,0.15)" }}
        >
          <Repeat size={11} style={{ color: "#1DB954" }} />
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate leading-tight">
            You've listened to {repeatData.artistName} {repeatData.count}× this week
          </p>
          <p className="text-xs leading-tight truncate" style={{ color: "#A7A7A7" }}>
            People with similar taste recently branched into:
          </p>
        </div>
      </div>

      {/* Center zone */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {repeatData.branches.map((branch) => (
          <button
            key={branch.name}
            id={`repeat-banner-chip-${branch.name.toLowerCase().replace(/ /g, "-")}`}
            onClick={() => playArtistFallback(branch.name)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-white/5 border border-white/10 flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-white/10"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${branch.thumbnailColor}cc, ${branch.thumbnailColor}66)`,
              }}
            />
            <span className="text-white text-xs font-medium whitespace-nowrap">{branch.name}</span>
          </button>
        ))}

        <button
          onClick={() => repeatData.branches[0] && playArtistFallback(repeatData.branches[0].name)}
          className="text-xs font-semibold whitespace-nowrap ml-1 transition-all duration-200 hover:scale-105 active:scale-95 hover:underline"
          style={{ color: "#1DB954" }}
        >
          Try one?
        </button>
      </div>

      {/* Right zone */}
      <div className="w-[200px] flex items-center justify-end flex-shrink-0">
        <button
          id="repeat-banner-dismiss-btn"
          onClick={() => setShouldShowRepeatBanner(false)}
          className="text-[#535353] hover:text-[#A7A7A7] transition-all duration-200 hover:scale-105 active:scale-95 text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
          aria-label="Dismiss repeat banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
