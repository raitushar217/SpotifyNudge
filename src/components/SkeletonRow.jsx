/**
 * SkeletonRow — animate-pulse placeholder for a playlist / track row.
 * Matches the 5-column playlist grid: # | title/artist | album | date | duration
 */
export default function SkeletonRow() {
  return (
    <div
      className="grid items-center py-2.5 px-2 animate-pulse"
      style={{ gridTemplateColumns: "32px 1fr 1fr 120px 64px" }}
    >
      {/* # column */}
      <div className="flex justify-center">
        <div className="w-4 h-4 rounded bg-white/10" />
      </div>

      {/* Title + artist */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded flex-shrink-0 bg-white/10" />
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-2.5 w-20 rounded bg-white/10" />
        </div>
      </div>

      {/* Album */}
      <div className="h-3 w-24 rounded bg-white/10" />

      {/* Date */}
      <div className="h-3 w-16 rounded bg-white/10" />

      {/* Duration */}
      <div className="flex justify-end">
        <div className="h-3 w-8 rounded bg-white/10" />
      </div>
    </div>
  );
}
