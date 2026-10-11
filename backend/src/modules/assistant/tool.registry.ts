import { schedulingTool } from "./scheduling.tool";
import type { AssistantIntent, AssistantTool, ToolExecutionResult } from "./assistant.types";

function notImplemented(toolName: string): ToolExecutionResult {
  return {
    handled: false,
    message: `${toolName} isn't implemented yet — this capability is planned for a future update.`,
  };
}

// ── Feature 9: placeholder tools ─────────────────────────────────────────
// Five of the six named tools return NOT_IMPLEMENTED in this phase, per
// Feature 9's explicit instruction. SCHEDULE_MEETING is the one
// exception: the AI Smart Scheduling task replaced its placeholder with
// a real implementation (scheduling.tool.ts) — see that task's Feature
// 12: "Replace the current NOT_IMPLEMENTED scheduling tool. Do not
// modify other tool implementations." calendarTool below keeps its
// other three intents (reschedule/cancel/ask-meetings) as placeholders,
// exactly as before.
//
// Each remaining placeholder's execute() signature is exactly what a
// real implementation will use: it already receives the authenticated
// user and the running conversation context. Upgrading one from
// placeholder to real later means changing the body of one function
// here — nothing in tool.executor.ts, assistant.service.ts, or
// assistant.controller.ts needs to change.

export const calendarTool: AssistantTool = {
  name: "Calendar Tool",
  // RESCHEDULE_MEETING/CANCEL_MEETING would call meetingService.updateMeeting
  // / deleteMeeting; ASK_MEETINGS would call calendarService.getUpcomingMeetings
  // / getTodaysMeetings, once wired up.
  intents: ["RESCHEDULE_MEETING", "CANCEL_MEETING", "ASK_MEETINGS"],
  async execute() {
    return notImplemented("Calendar Tool");
  },
};

export const summaryTool: AssistantTool = {
  name: "Summary Tool",
  // Would call the (not-yet-built) meeting summary feature via AIService.
  intents: ["SUMMARIZE_MEETING"],
  async execute() {
    return notImplemented("Summary Tool");
  },
};

export const analyticsTool: AssistantTool = {
  name: "Analytics Tool",
  // Would call analyticsService.getDashboardAnalytics / getMeetingStats /
  // getTaskStats / getAttendanceStats, once wired up.
  intents: ["ASK_ANALYTICS"],
  async execute() {
    return notImplemented("Analytics Tool");
  },
};

export const taskTool: AssistantTool = {
  name: "Task Tool",
  // Would call taskService.createTask / listMeetingTasks, once wired up.
  intents: ["CREATE_ACTION_ITEMS", "ASK_TASKS"],
  async execute() {
    return notImplemented("Task Tool");
  },
};

export const dashboardTool: AssistantTool = {
  name: "Dashboard Tool",
  // No current intent routes here yet — registered so the tool exists
  // and is discoverable ahead of a future ASK_DASHBOARD-style intent.
  intents: [],
  async execute() {
    return notImplemented("Dashboard Tool");
  },
};

export const chatTool: AssistantTool = {
  name: "Chat Tool",
  // Would call the (not-yet-built) open-ended chat feature via AIService.
  intents: ["GENERAL_CHAT"],
  async execute() {
    return notImplemented("Chat Tool");
  },
};

const ALL_TOOLS: readonly AssistantTool[] = [
  schedulingTool,
  calendarTool,
  summaryTool,
  analyticsTool,
  taskTool,
  dashboardTool,
  chatTool,
];

const intentToTool = new Map<AssistantIntent, AssistantTool>();
for (const tool of ALL_TOOLS) {
  for (const intent of tool.intents) {
    intentToTool.set(intent, tool);
  }
}

export function getToolForIntent(intent: AssistantIntent): AssistantTool | undefined {
  return intentToTool.get(intent);
}

export function getAllTools(): readonly AssistantTool[] {
  return ALL_TOOLS;
}
