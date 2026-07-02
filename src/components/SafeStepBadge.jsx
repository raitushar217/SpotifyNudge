import { INTENSITY_CONFIG } from "../data/tracks";

/**
 * IntensityBadge — Safe Step / Stretch / Leap
 */
export function IntensityBadge({ intensity }) {
  const cfg = INTENSITY_CONFIG[intensity];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}
      title={`Discovery intensity: ${cfg.label}`}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>{cfg.shape}</span>
      {cfg.label}
    </span>
  );
}

/**
 * MatchBadge — percentage match score in Taste Circles
 */
export function MatchBadge({ value }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954" }}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>●</span>
      {value}
    </span>
  );
}

/**
 * SaveRateBadge — % saved, used in Taste Circles trending panel
 */
export function SaveRateBadge({ rate }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: "rgba(29,185,84,0.15)", color: "#1DB954" }}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>●</span>
      {rate}% saved
    </span>
  );
}

// Default export = IntensityBadge (named "SafeStepBadge" per spec)
export default IntensityBadge;
