import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Workspace", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Security", href: "/#security" },
];

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass-nav fixed top-0 w-full z-50 transition-all duration-300",
        scrolled && "shadow-xl bg-background/80"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary via-secondary to-pinky flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">MeetWise AI</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-medium text-sm text-gray-400 hover:text-white transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-4">
          <Link to="/login" className="font-medium text-sm text-gray-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button href="/login" variant="secondary" size="sm">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 px-6 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 font-medium"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button href="/login" variant="ghost" size="sm" className="flex-1">
              Sign In
            </Button>
            <Button href="/login" variant="secondary" size="sm" className="flex-1">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
