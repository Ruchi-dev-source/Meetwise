import type {
  ActionItem,
  Attendee,
  Meeting,
  NotificationItem,
  TopicTag,
  TranscriptLine,
  WeeklyMeetingCount,
} from "@/lib/types";

export const currentUser: Attendee = {
  id: "u-alex",
  name: "Alex Rivera",
  initials: "AR",
  color: "bg-primary",
};

export const attendees: Attendee[] = [
  currentUser,
  { id: "u-sarah", name: "Sarah Chen", initials: "SC", color: "bg-secondary" },
  { id: "u-david", name: "David Kim", initials: "DK", color: "bg-accent" },
  { id: "u-maya", name: "Maya Patel", initials: "MP", color: "bg-pinky" },
  { id: "u-jordan", name: "Jordan Lee", initials: "JL", color: "bg-emerald-500" },
];

export const meetings: Meeting[] = [
  {
    id: "m-1",
    title: "Design System Sync",
    time: "9:00 AM",
    durationMinutes: 30,
    status: "past",
    attendees: [attendees[0], attendees[3]],
    tag: "Design",
    summary:
      "Aligned on the updated component spacing scale and agreed to migrate remaining legacy buttons to the new variant by Friday.",
  },
  {
    id: "m-2",
    title: "Q4 Strategy Sync",
    time: "11:30 AM",
    durationMinutes: 45,
    status: "live",
    attendees: [attendees[0], attendees[1], attendees[2], attendees[3]],
    tag: "Strategy",
    summary:
      "Reviewed Q4 targets against current pipeline. Growth is tracking 8% ahead of forecast; engineering flagged capacity risk for the December release window.",
  },
  {
    id: "m-3",
    title: "Client Onboarding — Halcyon Co.",
    time: "2:00 PM",
    durationMinutes: 30,
    status: "upcoming",
    attendees: [attendees[0], attendees[4]],
    tag: "Client",
  },
  {
    id: "m-4",
    title: "Engineering Retro",
    time: "4:00 PM",
    durationMinutes: 45,
    status: "upcoming",
    attendees: [attendees[2], attendees[4], attendees[0]],
    tag: "Engineering",
  },
];

export const actionItems: ActionItem[] = [
  {
    id: "a-1",
    title: "Send updated pricing deck to Halcyon Co.",
    owner: attendees[0],
    dueLabel: "Today",
    status: "pending",
    meetingTitle: "Client Onboarding — Halcyon Co.",
    stage: "todo",
  },
  {
    id: "a-2",
    title: "Migrate legacy buttons to new design tokens",
    owner: attendees[3],
    dueLabel: "Fri, Jul 10",
    status: "pending",
    meetingTitle: "Design System Sync",
    stage: "in-progress",
  },
  {
    id: "a-3",
    title: "Draft December capacity plan",
    owner: attendees[2],
    dueLabel: "Mon, Jul 13",
    status: "pending",
    meetingTitle: "Q4 Strategy Sync",
    stage: "in-progress",
  },
  {
    id: "a-4",
    title: "Share Q3 retro notes with leadership",
    owner: attendees[1],
    dueLabel: "Jul 2",
    status: "completed",
    meetingTitle: "Q4 Strategy Sync",
    stage: "done",
  },
  {
    id: "a-5",
    title: "Confirm two-phase release plan with engineering",
    owner: attendees[2],
    dueLabel: "Tomorrow",
    status: "pending",
    meetingTitle: "Q4 Strategy Sync",
    stage: "todo",
  },
  {
    id: "a-6",
    title: "Archive Q2 onboarding transcripts",
    owner: attendees[0],
    dueLabel: "Jun 28",
    status: "completed",
    meetingTitle: "Design System Sync",
    stage: "done",
  },
];

export const transcript: TranscriptLine[] = [
  {
    id: "t-1",
    speaker: attendees[1],
    timestamp: "00:02",
    text: "So if we look at the pipeline numbers from last week, we're tracking about eight percent ahead of where we forecasted for Q4.",
    active: true,
  },
  {
    id: "t-2",
    speaker: attendees[2],
    timestamp: "00:41",
    text: "That's great on the revenue side, but I want to flag capacity. If the December release ships on the current date, engineering is stretched thin.",
  },
  {
    id: "t-3",
    speaker: attendees[3],
    timestamp: "01:15",
    text: "Could we split the release into two smaller pushes? That would let design finish the token migration in parallel instead of blocking on one big cutover.",
  },
  {
    id: "t-4",
    speaker: attendees[1],
    timestamp: "01:52",
    text: "Let's do that. I'll take the capacity plan back to leadership and confirm the two-phase approach by Monday.",
  },
];

export const weeklyMeetingCounts: WeeklyMeetingCount[] = [
  { label: "Wk 1", count: 18 },
  { label: "Wk 2", count: 22 },
  { label: "Wk 3", count: 31, active: true },
  { label: "Wk 4", count: 26 },
  { label: "Wk 5", count: 19 },
  { label: "Wk 6", count: 24 },
];

export const topicTags: TopicTag[] = [
  { label: "Q4 Roadmap", weight: 5 },
  { label: "Capacity Planning", weight: 4 },
  { label: "Design Tokens", weight: 3 },
  { label: "Client Onboarding", weight: 4 },
  { label: "Release Cadence", weight: 3 },
  { label: "Hiring", weight: 2 },
  { label: "Budget Review", weight: 2 },
  { label: "Retro Actions", weight: 3 },
];

export const topicMentions = [
  { label: "Q4 Roadmap", mentions: 42, colorClass: "bg-primary" },
  { label: "Budget Allocation", mentions: 28, colorClass: "bg-secondary" },
  { label: "Hiring Pipeline", mentions: 24, colorClass: "bg-pinky" },
  { label: "Marketing Campaign", mentions: 15, colorClass: "bg-accent" },
  { label: "UI/UX Refresh", mentions: 12, colorClass: "bg-purple-400" },
  { label: "Server Migration", mentions: 8, colorClass: "bg-emerald-400" },
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    kind: "summary",
    title: "AI summary ready",
    detail: "Q4 Strategy Sync was processed with 3 action items extracted.",
    timeLabel: "12m ago",
    read: false,
  },
  {
    id: "n-2",
    kind: "task",
    title: "Task due today",
    detail: "Send updated pricing deck to Halcyon Co.",
    timeLabel: "1h ago",
    read: false,
  },
  {
    id: "n-3",
    kind: "meeting",
    title: "Meeting starting soon",
    detail: "Client Onboarding — Halcyon Co. begins in 15 minutes.",
    timeLabel: "2h ago",
    read: false,
  },
  {
    id: "n-4",
    kind: "system",
    title: "Google Calendar synced",
    detail: "42 upcoming events imported into your workspace.",
    timeLabel: "Yesterday",
    read: true,
  },
];
