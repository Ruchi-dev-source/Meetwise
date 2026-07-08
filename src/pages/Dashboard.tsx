import { useMemo, useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  CheckSquare,
  TrendingUp,
  UploadCloud,
  ArrowRight,
  Check,
  Sparkles,
  Loader,
  LayoutGrid,
} from "lucide-react";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";
import { meetings, actionItems as initialActionItems, currentUser } from "@/data/mock";
import type { TaskStage } from "@/lib/types";

const timeAllocation = [
  { label: "Internal Syncs", value: 65, colorClass: "text-primary", dotClass: "bg-primary", hours: "12h" },
  { label: "Client Calls", value: 20, colorClass: "text-secondary", dotClass: "bg-secondary", hours: "5h" },
  { label: "Focus Blocks", value: 15, colorClass: "text-pinky", dotClass: "bg-pinky", hours: "18h" },
];

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [tasks, setTasks] = useState(initialActionItems);

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "pending").length, [tasks]);
  const upcoming = useMemo(() => meetings.filter((m) => m.status !== "past").length, []);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setUploadedFile(file.name);
  }

  function handleStageChange(id: string, stage: TaskStage) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stage, status: stage === "done" ? "completed" : "pending" } : t))
    );
  }

  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="flex flex-col min-h-screen">
      <AppTopbar search={search} onSearchChange={setSearch} />

      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good morning, {firstName}.
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              You've saved <span className="font-semibold text-primary">4.5 hours</span> this week with
              automated AI summaries.
            </p>
          </div>
          <div className="text-xs text-gray-400 bg-white/5 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Integration Active
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Video}
              iconClass="bg-primary/10 text-primary"
              eyebrow="Today"
              value={<AnimatedCounter value={upcoming} />}
              label="Upcoming Syncs"
            />
            <StatCard
              icon={CheckSquare}
              iconClass="bg-secondary/10 text-secondary"
              eyebrow="Action Req."
              value={<AnimatedCounter value={pendingTasks} />}
              label="Pending Tasks"
            />
            <StatCard
              icon={TrendingUp}
              iconClass="bg-white/10 text-white"
              eyebrow="Excellent"
              value={<AnimatedCounter value={94} suffix="%" />}
              label="Productivity Score"
              featured
            />
          </div>

          <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Process</h3>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex-1 min-h-[100px] border border-dashed rounded-xl bg-white/5 flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-colors",
                dragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50"
              )}
            >
              <UploadCloud className="w-8 h-8 text-primary group-hover:scale-110 transition-transform mb-2" />
              {uploadedFile ? (
                <p className="text-xs font-semibold text-white truncate max-w-full">{uploadedFile} queued</p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-white">Drop audio or video here</p>
                  <p className="text-[9px] text-gray-500 mt-1">MP3, WAV, MP4 (Max 500MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold text-white">Today's Schedule</h3>
              <Link to="/meeting" className="text-primary hover:text-white transition-all text-xs font-semibold flex items-center gap-1">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative pl-6 border-l-2 border-white/5 space-y-6">
              {meetings.map((m) => (
                <div key={m.id} className="relative">
                  <div
                    className={cn(
                      "absolute -left-[31px] top-1 w-3 h-3 rounded-full border border-background",
                      m.status === "past" && "bg-gray-600",
                      m.status === "live" && "bg-primary ring-4 ring-primary/20",
                      m.status === "upcoming" && "bg-gray-800"
                    )}
                  />
                  {m.status === "live" ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 -ml-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <p className="text-[10px] text-primary font-semibold">
                            {m.time} · {m.durationMinutes} min · LIVE NOW
                          </p>
                          <p className="text-sm font-semibold text-white">{m.title}</p>
                        </div>
                        <Link
                          to="/meeting"
                          className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold hover:bg-primary-dim transition-colors"
                        >
                          Join Now
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold">
                          {m.time} · {m.durationMinutes} min
                        </p>
                        <p className={cn("text-sm font-medium", m.status === "past" ? "text-gray-300" : "text-gray-400")}>
                          {m.title}
                        </p>
                      </div>
                      {m.status === "past" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-gray-400 flex items-center gap-1">
                          <Check className="w-3 h-3 text-accent" /> Synthesized
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-white mb-1">Time Allocation</h3>
              <p className="text-[10px] text-gray-400">Meeting distribution this week</p>
            </div>

            <div className="my-6">
              <DonutChart
                centerValue="35h"
                centerLabel="Total Logged"
                segments={timeAllocation.map((t) => ({
                  label: t.label,
                  value: t.value,
                  colorClass: t.colorClass,
                }))}
              />
            </div>

            <div className="space-y-2">
              {timeAllocation.map((t) => (
                <div key={t.label} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded", t.dotClass)} />
                    <span className="text-gray-400">{t.label}</span>
                  </div>
                  <span className="text-white font-medium">
                    {t.hours} ({t.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" /> Task Board
              </h3>
              <span className="text-[10px] text-gray-500 font-semibold">Drag cards between columns</span>
            </div>
            <TaskBoard items={tasks} onStageChange={handleStageChange} />
          </section>

          <section className="lg:col-span-4 glass-card rounded-2xl p-6">
            <MiniCalendar busyDays={[3, 9, 14, 17, 22, 28]} />
          </section>
        </div>

        <section className="glass-card rounded-2xl p-6">
          <h3 className="font-display text-lg font-bold text-white mb-6">Recent Summaries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/meeting"
              className="group flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-primary/30 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Marketing All-Hands
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">Yesterday · 45 mins · 3 action items</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 border border-secondary/25 text-[9px] font-semibold text-secondary">
                Processed
              </span>
            </Link>
            <Link
              to="/meeting"
              className="group flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-primary/30 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-pinky/10 flex items-center justify-center text-pinky">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Client Discovery: Halcyon Co.
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">Today 9:00 AM · Extracting intelligence...</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-semibold text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" /> Syncing
              </span>
            </Link>
          </div>
        </section>

        <footer className="mt-4 pt-6 border-t border-white/5 flex justify-between items-center text-gray-500 text-xs pb-4">
          <p>© {new Date().getFullYear()} MeetWise AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-white transition-colors" href="#">Privacy</a>
            <a className="hover:text-white transition-colors" href="#">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
