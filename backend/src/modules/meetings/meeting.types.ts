import type { Meeting, MeetingStatus } from "@prisma/client";

/** A meeting with just enough host info to render in a list/detail view — never the full User record. */
export type MeetingWithHost = Meeting & {
  host: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export interface CreateMeetingInput {
  title: string;
  description?: string;
  tag?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  status?: MeetingStatus;
}

export interface UpdateMeetingInput {
  title?: string;
  description?: string;
  tag?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  status?: MeetingStatus;
}

export interface ListMeetingsFilter {
  status?: MeetingStatus;
}
