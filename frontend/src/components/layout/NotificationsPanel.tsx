import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Sparkles, Video, CheckSquare, Radio } from "lucide-react";
import type { NotificationItem, NotificationKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const kindIcon: Record<NotificationKind, typeof Sparkles> = {
  summary: Sparkles,
  task: CheckSquare,
  meeting: Video,
  system: Radio,
};

const kindClass: Record<NotificationKind, string> = {
  summary: "bg-primary/10 text-primary",
  task: "bg-secondary/10 text-secondary",
  meeting: "bg-pinky/10 text-pinky",
  system: "bg-accent/10 text-accent",
};

export function NotificationsPanel({
  items,
  open,
  onClose,
  onMarkAllRead,
}: {
  items: NotificationItem[];
  open: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="menu"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Notifications</h3>
            <button
              onClick={onMarkAllRead}
              className="text-[10px] font-semibold text-primary hover:text-white transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {items.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-8">You're all caught up.</p>
            )}
            {items.map((item) => {
              const Icon = kindIcon[item.kind];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5",
                    !item.read && "bg-white/[0.03]"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", kindClass[item.kind])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                      {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-pinky shrink-0" />}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.detail}</p>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wide font-semibold">
                      {item.timeLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
