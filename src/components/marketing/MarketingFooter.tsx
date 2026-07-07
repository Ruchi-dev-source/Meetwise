import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 relative z-10 bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-pinky flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">MeetWise AI</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-white transition-colors" href="#">Security Standards</a>
          <a className="hover:text-white transition-colors" href="#">Contact Sales</a>
        </nav>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} MeetWise AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
