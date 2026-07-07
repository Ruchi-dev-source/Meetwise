import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CosmicBackground } from "@/components/marketing/CosmicBackground";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative text-center px-6">
      <CosmicBackground />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary via-secondary to-pinky flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="text-white w-7 h-7" />
        </div>
        <div>
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">404</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">This page went off-record.</h1>
          <p className="text-gray-400 mt-3 max-w-md">
            The page you're looking for doesn't exist, or the transcript was never captured.
          </p>
        </div>
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
