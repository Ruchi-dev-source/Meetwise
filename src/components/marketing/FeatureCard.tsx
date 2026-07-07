import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function FeatureCard({
  icon: Icon,
  iconClass,
  title,
  description,
}: {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
}) {
  return (
    <GlassCard hover className="flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </GlassCard>
  );
}
