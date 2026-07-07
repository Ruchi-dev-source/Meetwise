import { Link, NavLink } from "react-router-dom";
import {
  Sparkles,
  Plus,
  LayoutDashboard,
  Video,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mock";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meeting", label: "Meetings", icon: Video },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="glass-card h-full w-[250px] flex flex-col p-5 gap-6 border-r border-white/5 rounded-none">
      <div className="flex items-center justify-between px-1">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-pinky flex items-center justify-center shrink-0">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-tight text-white">MeetWise AI</span>
            <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Workspace</span>
          </div>
        </Link>
        <button className="md:hidden text-gray-400" onClick={onNavigate} aria-label="Close navigation">
          <X className="w-5 h-5" />
        </button>
      </div>

      <button className="w-full bg-white text-black py-2.5 rounded-xl font-semibold text-xs hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]">
        <Plus className="w-4 h-4" /> Create Meeting
      </button>

      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto" aria-label="Workspace navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-xs tracking-wide font-semibold",
                isActive
                  ? "bg-white/5 text-white border-white/5"
                  : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
        <a className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-xs" href="#">
          <HelpCircle className="w-4 h-4" /> Support
        </a>
        <Link
          className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-xs"
          to="/login"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2 py-3 mt-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-primary/30 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[9px] text-gray-400 truncate">Product Director</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </Link>
      </div>
    </aside>
  );
}
