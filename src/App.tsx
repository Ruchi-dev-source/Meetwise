import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppShell } from "@/components/layout/AppShell";
import { PageLoader } from "@/components/ui/PageLoader";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Home ships in the main bundle since it's the most likely first paint.
import { Home } from "@/pages/Home";

// Everything else is code-split per route to keep the initial bundle lean.
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Analytics = lazy(() => import("@/pages/Analytics").then((m) => ({ default: m.Analytics })));
const MeetingDetails = lazy(() =>
  import("@/pages/MeetingDetails").then((m) => ({ default: m.MeetingDetails }))
);
const Profile = lazy(() => import("@/pages/Profile").then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

function App() {
  useScrollToTop();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing site */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth screens (no nav/footer chrome) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Authenticated workspace, behind the persistent app shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/meeting" element={<MeetingDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
