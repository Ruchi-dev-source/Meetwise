export type MeetingStatus = "past" | "live" | "upcoming";

export interface Attendee {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  durationMinutes: number;
  status: MeetingStatus;
  attendees: Attendee[];
  summary?: string;
  tag: string;
}

export type TaskStatus = "pending" | "completed";
export type TaskStage = "todo" | "in-progress" | "done";

export interface ActionItem {
  id: string;
  title: string;
  owner: Attendee;
  dueLabel: string;
  status: TaskStatus;
  meetingTitle: string;
  stage: TaskStage;
}

export interface TranscriptLine {
  id: string;
  speaker: Attendee;
  timestamp: string;
  text: string;
  active?: boolean;
}

export interface TopicTag {
  label: string;
  weight: number; // 1-5, used to size the tag
}

export interface WeeklyMeetingCount {
  label: string;
  count: number;
  active?: boolean;
}

export type NotificationKind = "task" | "meeting" | "summary" | "system";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  timeLabel: string;
  read: boolean;
}
