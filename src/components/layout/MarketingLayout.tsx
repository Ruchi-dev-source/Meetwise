import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { CosmicBackground } from "@/components/marketing/CosmicBackground";
import { PageTransition } from "@/components/layout/PageTransition";

export function MarketingLayout() {
  return (
    <div className="min-h-screen relative antialiased selection:bg-primary/30 selection:text-white">
      <CosmicBackground />
      <MarketingNavbar />
      <div className="relative z-10">
        <PageTransition />
      </div>
      <MarketingFooter />
    </div>
  );
}
