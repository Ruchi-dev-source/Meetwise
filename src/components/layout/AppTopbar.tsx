import { Search, Bell } from "lucide-react";

export function AppTopbar({
  search,
  onSearchChange,
  placeholder = "Search meeting transcript archives, summaries, or actions...",
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
}) {
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
        <button
          className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/10 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-pinky rounded-full" />
        </button>
      </div>
    </header>
  );
}
