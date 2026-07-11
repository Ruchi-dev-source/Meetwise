import { cn } from "@/lib/utils";

export function ProgressBar({
  label,
  value,
  colorClass = "bg-primary",
}: {
  label: string;
  value: number;
  colorClass?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", colorClass)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
