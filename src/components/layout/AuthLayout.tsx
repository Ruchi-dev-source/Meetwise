import { CosmicBackground } from "@/components/marketing/CosmicBackground";
import { PageTransition } from "@/components/layout/PageTransition";

export function AuthLayout() {
  return (
    <div className="min-h-screen relative antialiased selection:bg-primary/30 selection:text-white">
      <CosmicBackground />
      <div className="relative z-10">
        <PageTransition />
      </div>
    </div>
  );
}
