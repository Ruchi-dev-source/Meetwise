import { useMemo, useState } from "react";
import {
  ChevronRight,
  FileText,
  Search,
  Share2,
  Download,
  Sparkles,
  Copy,
  CheckSquare,
  Calendar,
  Plus,
  Play,
  Pause,
} from "lucide-react";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { actionItems as initialActionItems, attendees, transcript } from "@/data/mock";
import { cn } from "@/lib/utils";

export function MeetingDetails() {
  const [filter, setFilter] = useState("");
  const [tasks, setTasks] = useState(initialActionItems);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredTranscript = useMemo(() => {
    if (!filter.trim()) return transcript;
    const q = filter.toLowerCase();
    return transcript.filter(
      (line) => line.text.toLowerCase().includes(q) || line.speaker.name.toLowerCase().includes(q)
    );
  }, [filter]);

  const summary =
    "The team reviewed Q4 resource allocation ahead of the product launch. Engineering confirmed a beta target contingent on receiving final onboarding assets, and design committed to delivering them by Thursday. The group also agreed to split the December release into two phases to protect capacity.";

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t))
    );
  }

  function copySummary() {
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="glass-nav sticky top-0 z-30 px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            <span>Meetings</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/20 text-accent font-bold">
              Recorded
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight">Q4 Strategy Sync</h2>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup attendees={attendees} max={3} />
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-300 hover:text-white transition-all">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-primary hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </header>

      <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Transcript */}
        <section className="lg:col-span-7 glass-card rounded-2xl flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Interactive Transcript
            </h3>
            <div className="relative w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-primary placeholder:text-gray-500"
                placeholder="Filter transcript..."
                type="text"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-background/20">
            {filteredTranscript.length === 0 && (
              <p className="text-xs text-gray-500 text-center mt-8">No lines match "{filter}".</p>
            )}
            {filteredTranscript.map((line) => (
              <div
                key={line.id}
                className={cn(
                  "group pl-4 border-l-2 transition-all rounded-r-xl",
                  line.active ? "border-primary bg-primary/5 -ml-4 p-4" : "border-transparent hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{line.speaker.name}</span>
                    {line.speaker.id === attendees[1].id && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                        Host
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 hover:text-primary cursor-pointer">{line.timestamp}</span>
                </div>
                <p className={cn("text-xs leading-relaxed font-light mt-1", line.active ? "text-gray-300" : "text-gray-400")}>
                  {line.text}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 bg-surface/50 flex items-center gap-4">
            <button
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause" : "Play"}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full relative cursor-pointer group">
              <div className="absolute left-0 top-0 h-full bg-primary w-[15%] rounded-full" />
              <div className="absolute left-[15%] -top-1 w-3.5 h-3.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold">02:14 / 45:00</span>
          </div>
        </section>

        {/* Summary + Actions */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="text-primary w-4 h-4" /> AI Summary
              </h3>
              <button
                onClick={copySummary}
                className="text-gray-500 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">{summary}</p>
            {copied && <span className="text-[10px] text-accent font-semibold">Copied to clipboard</span>}
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CheckSquare className="text-secondary w-4 h-4" /> Action Items
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-gray-400">
                {pendingCount} pending
              </span>
            </div>

            <ul className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {tasks.map((task) => {
                const completed = task.status === "completed";
                return (
                  <li
                    key={task.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5 transition-all group",
                      completed ? "opacity-55" : "hover:border-primary/20 hover:bg-white/10"
                    )}
                  >
                    <input
                      checked={completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-0.5 h-4 w-4 rounded border-white/10 text-primary bg-transparent focus:ring-0 cursor-pointer"
                      type="checkbox"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-medium leading-tight transition-colors",
                          completed ? "text-gray-500 line-through" : "text-white group-hover:text-primary"
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Avatar attendee={task.owner} size="xs" />
                          {task.owner.name.split(" ")[0]} {task.owner.name.split(" ")[1]?.[0]}.
                        </div>
                        {!completed && (
                          <span className="text-pinky font-semibold flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" /> {task.dueLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 hover:border-primary/50 rounded-xl text-xs text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5 font-semibold">
              <Plus className="w-4 h-4" /> Add Action Item
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
