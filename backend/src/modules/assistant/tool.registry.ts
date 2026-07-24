import type { AssistantIntent, AssistantTool, ToolExecutionResult } from "./assistant.types";

function notImplemented(toolName: string): ToolExecutionResult {
  return {
    handled: false,
    message: `${toolName} isn't implemented yet — this capability is planned for a future update.`,
  };
}

// ── Feature 9: placeholder tools ─────────────────────────────────────────
// All six named tools return NOT_IMPLEMENTED in this phase, per Feature
// 9's explicit instruction, even where an existing service (Calendar/
// Task/Analytics) could technically be called today. Two reasons this is
// the correct scope for THIS module, not a shortcut:
//
// 1. Feature 9 says so explicitly and lists all six tools by name — it's
//    not ambiguous, and it directly parallels the AI Foundation module's
//    own "infrastructure first, feature behavior later" scope from the
//    previous task.
// 2. Doing it "for real" would mean inventing unspecified behavior this
//    task never asked for: turning "next week" into an actual datetime,
//    matching "the sprint planning meeting" in free text to a specific
//    meeting id for reschedule/cancel, deciding what "my tasks across
//    every meeting" even queries (no such cross-meeting listing exists
//    in the tasks module today - it only lists tasks for one meetingId
//    at a time). Guessing at that design here risks conflicting with
//    whatever the follow-up task that actually specifies it decides.
//
// Each execute() signature below is exactly what a real implementation
// will use: it already receives the authenticated user (everything every
// listed service needs for its own auth/org-scoping) and the running
// conversation context. Upgrading a tool from placeholder to real later
// means changing the body of one function here — nothing in
// tool.executor.ts, assistant.service.ts, or assistant.controller.ts
// needs to change.

export const calendarTool: AssistantTool = {
  name: "Calendar Tool",
  // Would call calendarService.scheduleMeeting / checkAvailability /
  // getUpcomingMeetings / getTodaysMeetings, and meetingService.updateMeeting
  // / deleteMeeting for reschedule/cancel, once wired up.
  intents: ["SCHEDULE_MEETING", "RESCHEDULE_MEETING", "CANCEL_MEETING", "ASK_MEETINGS"],
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

const ALL_TOOLS: readonly AssistantTool[] = [calendarTool, summaryTool, analyticsTool, taskTool, dashboardTool, chatTool];

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
