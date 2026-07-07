export interface DonutSegment {
  label: string;
  value: number; // percentage 0-100, all segments should sum to <= 100
  colorClass: string; // tailwind text-color class, used for stroke via currentColor
  hoursLabel?: string;
}

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
}) {
  let offset = 0;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" cx="18" cy="18" r="15.915" />
        {segments.map((seg) => {
          const dashOffset = -offset;
          offset += seg.value;
          return (
            <circle
              key={seg.label}
              className={seg.colorClass}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${seg.value} 100`}
              strokeDashoffset={dashOffset}
              fill="none"
              cx="18"
              cy="18"
              r="15.915"
              style={{ transition: "stroke-dasharray 0.6s ease-out" }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{centerValue}</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-widest">{centerLabel}</span>
      </div>
    </div>
  );
}
