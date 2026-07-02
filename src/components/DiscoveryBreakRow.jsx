import { Play, Music2 } from "lucide-react";
import { INTENSITY_CONFIG } from "../data/tracks";

export default function DiscoveryBreakRow({ title, album, socialProof, aiReason, intensity, color }) {
  const cfg = INTENSITY_CONFIG[intensity];
  return (
    <div
      className="w-full rounded-md relative overflow-hidden group cursor-pointer transition-colors"
      style={{ background: "rgba(29,185,84,0.07)", borderLeft: "2px solid #1DB954" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(29,185,84,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(29,185,84,0.07)"; }}
    >
      <div
        className="grid items-center py-2.5 px-2"
        style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
      >
        {/* # column */}
        <div className="flex items-center justify-center">
          <Play size={13} fill="#1DB954" className="text-[#1DB954] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Title column */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded flex-shrink-0 relative flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}99, ${color}33)` }}
          >
            <Music2 size={14} className="text-white/50" />
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#121212]"
              style={{ background: "#1DB954" }}
            />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#1DB954", lineHeight: 1 }}>
              🎵 Discovery Break
            </p>
            <p className="text-sm font-bold text-white truncate leading-snug">{title}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: "#A7A7A7" }}>{socialProof}</p>
            <p className="text-xs truncate italic" style={{ color: "#6b7280" }}>{aiReason}</p>
          </div>
        </div>

        {/* Album column */}
        <span className="text-[#A7A7A7] text-sm truncate text-left pr-4 hover:text-white hover:underline">
          {album}
        </span>

        {/* Date spacer */}
        <span />

        {/* Intensity badge */}
        <div className="flex items-center justify-end">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: cfg.bg, color: cfg.text }}
            title={`Discovery intensity: ${cfg.label}`}
          >
            <span style={{ fontSize: "8px", lineHeight: 1 }}>{cfg.shape}</span>
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
