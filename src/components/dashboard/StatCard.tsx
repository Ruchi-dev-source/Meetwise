import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  iconClass,
  eyebrow,
  value,
  label,
  featured = false,
}: {
  icon: LucideIcon;
  iconClass: string;
  eyebrow: string;
  value: string;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 flex flex-col justify-between h-[150px] relative overflow-hidden",
        featured && "bg-gradient-to-tr from-surface-card to-primary/10"
      )}
    >
      {featured && <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary/20 rounded-full blur-xl" />}
      <div className="flex justify-between items-start relative z-10">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn("text-[9px] uppercase tracking-wider font-bold", featured ? "text-white" : "text-gray-500")}>
          {eyebrow}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-bold text-white leading-none mb-1">{value}</p>
        <p className={cn("text-xs", featured ? "text-primary-200" : "text-gray-400")}>{label}</p>
      </div>
    </div>
  );
}
