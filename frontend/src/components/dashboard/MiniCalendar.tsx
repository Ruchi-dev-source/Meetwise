import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function MiniCalendar({ busyDays = [] }: { busyDays?: number[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isCurrentMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const grid = useMemo(() => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (number | null)[] = Array.from({ length: firstDay }, () => null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [cursor]);

  function shiftMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`} className="text-[9px] font-bold text-gray-600 uppercase">
            {d}
          </span>
        ))}
        {grid.map((day, i) => {
          const isToday = isCurrentMonth && day === today.getDate();
          const isBusy = day !== null && busyDays.includes(day);
          return (
            <div key={i} className="flex items-center justify-center py-0.5">
              {day && (
                <div
                  className={cn(
                    "relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors",
                    isToday ? "bg-primary text-white font-bold" : "text-gray-300 hover:bg-white/5 cursor-pointer"
                  )}
                >
                  {day}
                  {isBusy && !isToday && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-accent" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
