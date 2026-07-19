export interface MeetingStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  thisMonth: number;
  byStatus: Record<string, number>;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface AttendanceStats {
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

export interface DashboardAnalytics {
  totalMeetings: number;
  meetingsToday: number;
  upcomingMeetings: number;
  completedMeetings: number;
  meetingsThisMonth: number;
  meetingsByStatus: Record<string, number>;

  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;

  attendancePercentage: number;

  notificationsUnread: number;
  filesUploaded: number;
  activeUsers: number;
}
