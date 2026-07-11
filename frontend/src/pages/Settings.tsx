import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Cpu,
  Bell,
  Shield,
  CreditCard,
  Upload,
  Check,
} from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";

type TabKey = "workspace" | "ai" | "notifications" | "security" | "billing";

const tabs: { key: TabKey; label: string; icon: typeof Building }[] = [
  { key: "workspace", label: "Workspace", icon: Building },
  { key: "ai", label: "AI Preferences", icon: Cpu },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export function Settings() {
  const [active, setActive] = useState<TabKey>("workspace");
  const [saved, setSaved] = useState(false);

  const [workspaceName, setWorkspaceName] = useState("Halcyon Collective");
  const [workspaceSlug, setWorkspaceSlug] = useState("halcyon-eng");

  const [aiPrefs, setAiPrefs] = useState({
    autoTranscribe: true,
    autoSummarize: true,
    actionDetection: true,
    lowConfidenceFlag: false,
  });

  const [notifications, setNotifications] = useState({
    meetingReminders: true,
    taskDueAlerts: true,
    weeklyDigest: false,
  });

  const [security, setSecurity] = useState({
    enforceSso: true,
    zeroRetention: false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex-grow max-w-5xl mx-auto w-full p-6 sm:p-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-56 shrink-0 flex flex-col gap-2">
        <h2 className="font-display text-xl font-bold text-white mb-4">Settings</h2>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0 font-semibold",
                active === key
                  ? "bg-white/5 text-white border border-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4", active === key && "text-primary")} /> {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col gap-6 max-w-2xl">
        {active === "workspace" && (
          <section className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-white mb-1">Workspace Profile</h3>
              <p className="text-xs text-gray-400">Configure parameters for your team workspace.</p>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-pinky border border-dashed border-white/10 hover:border-primary/50 transition-colors flex items-center justify-center text-white cursor-pointer relative group">
                  <Upload className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute font-display font-bold text-lg group-hover:opacity-0 transition-opacity">HC</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Workspace Logo</p>
                  <p className="text-[10px] text-gray-500">Suggested dimension: 256×256px (PNG, SVG)</p>
                  <button className="mt-1 text-[10px] text-primary hover:underline font-bold">Remove workspace logo</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400" htmlFor="workspace-name">
                  Workspace Identifier
                </label>
                <input
                  id="workspace-name"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400" htmlFor="workspace-url">
                  Workspace Access Route
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/5 bg-white/5 text-gray-400 text-xs font-medium">
                    meetwise.ai/w/
                  </span>
                  <input
                    id="workspace-url"
                    className="flex-1 bg-white/5 border border-white/5 rounded-r-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {active === "ai" && (
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-white mb-1">AI Preferences</h3>
              <p className="text-xs text-gray-400">Control how MeetWise processes and interprets your meetings.</p>
            </div>
            <div className="space-y-5">
              {[
                ["autoTranscribe", "Auto-transcribe new meetings", "Start diarized transcription automatically when a sync begins."],
                ["autoSummarize", "Generate AI summaries", "Produce a structured summary within minutes of a meeting ending."],
                ["actionDetection", "Detect action items", "Scan dialogue for commitments and route them to the right owner."],
                ["lowConfidenceFlag", "Flag low-confidence extractions", "Surface a review badge when model confidence drops below 85%."],
              ].map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle
                    checked={aiPrefs[key as keyof typeof aiPrefs]}
                    onChange={(v) => setAiPrefs((p) => ({ ...p, [key]: v }))}
                    label={label as string}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "notifications" && (
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-white mb-1">Notifications</h3>
              <p className="text-xs text-gray-400">Choose what MeetWise should keep you posted on.</p>
            </div>
            <div className="space-y-5">
              {[
                ["meetingReminders", "Meeting reminders", "A heads-up 10 minutes before each scheduled sync."],
                ["taskDueAlerts", "Task due alerts", "A ping when an action item assigned to you is due soon."],
                ["weeklyDigest", "Weekly digest email", "A Monday-morning recap of last week's meetings and outcomes."],
              ].map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(v) => setNotifications((p) => ({ ...p, [key]: v }))}
                    label={label as string}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "security" && (
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-white mb-1">Security</h3>
              <p className="text-xs text-gray-400">Manage access control and data-handling policies.</p>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Enforce SSO for all members</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Require single sign-on through your identity provider.</p>
                </div>
                <Toggle
                  checked={security.enforceSso}
                  onChange={(v) => setSecurity((s) => ({ ...s, enforceSso: v }))}
                  label="Enforce SSO"
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Zero data retention</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Discard raw audio immediately after transcription completes.</p>
                </div>
                <Toggle
                  checked={security.zeroRetention}
                  onChange={(v) => setSecurity((s) => ({ ...s, zeroRetention: v }))}
                  label="Zero data retention"
                />
              </div>
            </div>
          </section>
        )}

        {active === "billing" && (
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-display text-lg font-bold text-white mb-1">Billing</h3>
              <p className="text-xs text-gray-400">Your workspace plan and usage.</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
              <div>
                <p className="text-sm font-semibold text-white">Enterprise Plan</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Unlimited transcription minutes · 25 seats</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase">Active</span>
            </div>
            <button className="text-xs font-semibold text-primary hover:text-white transition-colors">
              Manage billing details →
            </button>
          </section>
        )}

        <div className="flex justify-end gap-3 items-center">
          {saved && (
            <span className="text-xs text-accent font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Changes saved
            </span>
          )}
          <Link
            to="/dashboard"
            className="px-5 py-2.5 text-xs font-semibold text-gray-400 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-semibold text-black bg-white rounded-xl hover:bg-primary hover:text-white transition-all shadow-md hover:scale-[1.02]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
