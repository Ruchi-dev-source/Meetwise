import { cn } from "@/lib/utils";
import type { WeeklyMeetingCount } from "@/lib/types";

export function BarChart({ data }: { data: WeeklyMeetingCount[] }) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex-1 flex items-end gap-3 sm:gap-6 h-[240px] mt-4 border-b border-white/5 pb-2 relative">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full border-t border-white/5" />
        ))}
      </div>
      {data.map((week) => {
        const heightPct = Math.max(8, Math.round((week.count / max) * 100));
        return (
          <div key={week.label} className="flex-1 flex flex-col justify-end h-full group cursor-pointer relative z-10">
            <div
              className={cn(
                "w-full rounded-t-lg transition-all duration-300 relative",
                week.active
                  ? "bg-gradient-to-t from-primary to-pinky shadow-lg shadow-primary/10"
                  : "bg-white/10 group-hover:bg-white/20"
              )}
              style={{ height: `${heightPct}%` }}
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface border border-white/10 text-[9px] text-white py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                {week.count}
              </span>
            </div>
            <span className={cn("text-[9px] text-center mt-3 font-semibold", week.active ? "text-primary font-bold" : "text-gray-500")}>
              {week.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
