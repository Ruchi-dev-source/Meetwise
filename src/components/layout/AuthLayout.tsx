import { Outlet } from "react-router-dom";
import { CosmicBackground } from "@/components/marketing/CosmicBackground";

export function AuthLayout() {
  return (
    <div className="min-h-screen relative antialiased selection:bg-primary/30 selection:text-white">
      <CosmicBackground />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
