import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { notifications as initialNotifications } from "@/data/mock";

export function AppTopbar({
  search,
  onSearchChange,
  placeholder = "Search meeting transcript archives, summaries, or actions...",
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <header className="glass-nav sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder={placeholder}
          type="text"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-colors relative"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-expanded={notifOpen}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-pinky rounded-full" />
            )}
          </button>
          <NotificationsPanel
            items={notifs}
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            onMarkAllRead={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
          />
        </div>
      </div>
    </header>
  );
}
