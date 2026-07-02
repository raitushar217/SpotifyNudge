/**
 * SkeletonNudgeCard — animate-pulse placeholder for a Break Your Loop nudge card.
 * Mirrors the card layout: thumbnail | title/artist/badge | because | explanation | save-rate + actions
 */
export default function SkeletonNudgeCard() {
  return (
    <div
      className="animate-pulse border-l-[3px] border-[#1DB954] border-b border-white/10 px-6 py-3"
      style={{ background: "#121212" }}
    >
      {/* Row 1: thumbnail · title · badge */}
      <div className="grid items-center gap-3 mb-3" style={{ gridTemplateColumns: "40px 1fr auto" }}>
        <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-40 rounded bg-white/10" />
          <div className="h-2.5 w-28 rounded bg-white/10" />
        </div>
        <div className="h-5 w-16 rounded-full bg-white/10" />
      </div>

      {/* Row 2: because */}
      <div className="pl-[52px] mb-1.5">
        <div className="h-2.5 w-48 rounded bg-white/10" />
      </div>

      {/* Row 3: explanation */}
      <div className="pl-[52px] mb-3 flex flex-col gap-1">
        <div className="h-2.5 w-full rounded bg-white/10" />
        <div className="h-2.5 w-3/4 rounded bg-white/10" />
      </div>

      {/* Row 4: save-rate + buttons */}
      <div className="pl-[52px] flex items-center justify-between">
        <div className="h-2.5 w-40 rounded bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-white/10" />
          <div className="h-6 w-14 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
