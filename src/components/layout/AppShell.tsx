import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { PageTransition } from "@/components/layout/PageTransition";

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background relative">
      <div aria-hidden className="absolute inset-0 cosmic-grid pointer-events-none z-0" />
      <div aria-hidden className="gradient-orb w-[500px] h-[500px] bg-primary top-[10%] left-[20%] opacity-10" />
      <div aria-hidden className="gradient-orb w-[600px] h-[600px] bg-secondary bottom-[10%] right-[10%] opacity-10" />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 glass-nav flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-primary to-pinky flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-display text-sm font-bold text-white">MeetWise AI</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className="text-white p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full z-40">
        <AppSidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-[250px] h-full bg-background">
            <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
          <button
            className="flex-1 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
        </div>
      )}

      <main className="relative z-10 md:pl-[250px] pt-14 md:pt-0">
        <PageTransition />
      </main>
    </div>
  );
}
