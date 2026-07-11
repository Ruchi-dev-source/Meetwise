import { cn } from "@/lib/utils";
import type { Attendee } from "@/lib/types";

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function Avatar({
  attendee,
  size = "sm",
  ring = false,
}: {
  attendee: Attendee;
  size?: keyof typeof sizeClasses;
  ring?: boolean;
}) {
  return (
    <div
      title={attendee.name}
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        attendee.color,
        sizeClasses[size],
        ring && "ring-2 ring-background"
      )}
    >
      {attendee.initials}
    </div>
  );
}

export function AvatarGroup({ attendees, max = 4 }: { attendees: Attendee[]; max?: number }) {
  const shown = attendees.slice(0, max);
  const overflow = attendees.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((a) => (
        <Avatar key={a.id} attendee={a} size="xs" ring />
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full bg-white/10 ring-2 ring-background flex items-center justify-center text-[10px] font-semibold text-gray-300">
          +{overflow}
        </div>
      )}
    </div>
  );
}
