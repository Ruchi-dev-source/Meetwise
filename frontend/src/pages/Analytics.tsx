import { Users, Clock, Smile, ArrowUpRight, Calendar, ChevronDown, Download } from "lucide-react";
import { BarChart } from "@/components/dashboard/BarChart";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { weeklyMeetingCounts, topicMentions } from "@/data/mock";

const metrics = [
  {
    icon: Users,
    iconClass: "text-primary",
    label: "Total Meetings Processed",
    value: 342,
    delta: "12%",
    note: "vs. previous 30-day window",
  },
  {
    icon: Clock,
    iconClass: "text-secondary",
    label: "Meeting Hours Saved",
    value: 124,
    unit: "hrs",
    delta: "8%",
    note: "Parsed via AI synthesis timelines",
  },
];

export function Analytics() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="glass-nav sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white tracking-tight">Analytics Overview</h1>
          <p className="text-[10px] text-gray-400 mt-0.5">Performance insights across all workspace modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/5 rounded-xl text-gray-300 hover:text-white transition-colors text-xs font-medium">
            <Calendar className="w-4 h-4 text-primary" /> Last 30 Days <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button aria-label="Export data" className="flex items-center justify-center p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m) => (
            <div key={m.label} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <m.icon className={`w-16 h-16 ${m.iconClass}`} />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">{m.label}</h3>
              <div className="flex items-baseline gap-3">
                <span className="font-data text-4xl font-bold text-white tracking-tight tabular-nums">
                  <AnimatedCounter value={m.value} />
                  {m.unit && <span className="font-sans text-lg text-gray-400 ml-1 font-medium">{m.unit}</span>}
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-accent bg-accent/10 rounded-full px-2 py-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {m.delta}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">{m.note}</p>
            </div>
          ))}

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smile className="w-16 h-16 text-pinky" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Average Workspace Sentiment</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-data text-4xl font-bold text-white tracking-tight tabular-nums">
                <AnimatedCounter value={8.4} decimals={1} />
                <span className="font-sans text-lg text-gray-400 font-medium">/10</span>
              </span>
              <span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5 py-0.5">Positive</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full w-[84%]" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="font-display text-base font-bold text-white">Meeting Frequency</h3>
              <p className="text-[10px] text-gray-400">Weekly processing statistics</p>
            </div>
            <BarChart data={weeklyMeetingCounts} />
          </div>

          <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="font-display text-base font-bold text-white">Time Allocation</h3>
              <p className="text-[10px] text-gray-400">Meeting category ratios</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="relative w-36 h-36 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "conic-gradient(#8B5CF6 0% 45%, #3B82F6 45% 75%, rgba(255,255,255,0.05) 75% 100%)",
                }}
              >
                <div className="w-24 h-24 bg-surface rounded-full flex flex-col items-center justify-center border border-white/5">
                  <span className="font-data text-xl font-bold text-white tabular-nums">342</span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">Processed</span>
                </div>
              </div>
              <div className="w-full mt-6 space-y-2">
                {[
                  ["bg-primary", "Strategy & Sync", "45%"],
                  ["bg-secondary", "Client Calls", "30%"],
                  ["bg-white/10 border border-white/10", "1-on-1s & Other", "25%"],
                ].map(([dot, label, pct]) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded ${dot}`} />
                      <span className="text-gray-400">{label}</span>
                    </div>
                    <span className="text-white font-medium">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="font-display text-base font-bold text-white">Most Discussed Topics</h3>
            <p className="text-[10px] text-gray-400">Keywords extracted via NLP from recent sync archives</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {topicMentions.map((t, i) => (
              <div
                key={t.label}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-white transition-all cursor-default shadow-sm ${
                  i === 0 ? "border border-primary/20 bg-primary/5 hover:border-primary/50" : "border border-white/5 bg-white/5 hover:border-primary/30"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${t.colorClass}`} />
                {t.label}
                <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 font-semibold ml-1">
                  {t.mentions} mentions
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
