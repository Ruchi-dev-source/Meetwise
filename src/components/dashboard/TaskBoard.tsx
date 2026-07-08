import { useState, type DragEvent } from "react";
import { Calendar, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { ActionItem, TaskStage } from "@/lib/types";

const columns: { key: TaskStage; label: string; dot: string }[] = [
  { key: "todo", label: "To Do", dot: "bg-gray-500" },
  { key: "in-progress", label: "In Progress", dot: "bg-primary" },
  { key: "done", label: "Done", dot: "bg-emerald-500" },
];

export function TaskBoard({
  items,
  onStageChange,
}: {
  items: ActionItem[];
  onStageChange: (id: string, stage: TaskStage) => void;
}) {
  const [dragOverCol, setDragOverCol] = useState<TaskStage | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>, stage: TaskStage) {
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStageChange(id, stage);
    setDraggingId(null);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colItems = items.filter((t) => t.stage === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol((c) => (c === col.key ? null : c))}
            onDrop={(e) => handleDrop(e, col.key)}
            className={cn(
              "rounded-xl border border-white/5 bg-white/[0.02] p-3 flex flex-col gap-3 min-h-[220px] transition-colors",
              dragOverCol === col.key && "border-primary/40 bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", col.dot)} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {col.label}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">{colItems.length}</span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {colItems.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", task.id);
                    setDraggingId(task.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  className={cn(
                    "rounded-lg border border-white/5 bg-surface/80 p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all",
                    draggingId === task.id && "opacity-40"
                  )}
                >
                  <p className="text-xs font-medium text-white leading-snug">{task.title}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Avatar attendee={task.owner} size="xs" />
                    <span className="flex items-center gap-1 text-[9px] text-gray-500 font-semibold">
                      <Calendar className="w-3 h-3" /> {task.dueLabel}
                    </span>
                  </div>
                </div>
              ))}
              {colItems.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 border border-dashed border-white/5 rounded-lg py-6">
                  Drop a task here
                </div>
              )}
            </div>

            <button className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-white transition-colors py-1.5 border-t border-white/5 mt-1">
              <Plus className="w-3.5 h-3.5" /> Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}
