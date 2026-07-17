import { z } from "zod";

const uuid = (label: string) => z.string().uuid(`${label} must be a valid id`);

export const meetingIdParamSchema = z.object({
  meetingId: uuid("meetingId"),
});

export const participantParamsSchema = z.object({
  meetingId: uuid("meetingId"),
  userId: uuid("userId"),
});

export const inviteParticipantSchema = z.object({
  userId: uuid("userId"),
  // A host is never invited — that role is assigned automatically to the meeting creator.
  role: z.enum(["COHOST", "ATTENDEE"]).optional(),
});
export type InviteParticipantSchema = z.infer<typeof inviteParticipantSchema>;

export const selfUpdateParticipantSchema = z.object({
  action: z.enum(["join", "leave"]),
});
export type SelfUpdateParticipantSchema = z.infer<typeof selfUpdateParticipantSchema>;
