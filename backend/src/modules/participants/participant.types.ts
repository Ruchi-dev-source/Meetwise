import type { Participant, ParticipantRole } from "@prisma/client";

/** A participant with just enough user info to render a roster — never the full User record. */
export type ParticipantWithUser = Participant & {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export interface InviteParticipantInput {
  userId: string;
  role?: ParticipantRole; // restricted to COHOST | ATTENDEE at the validator level — HOST is assigned automatically only
}

export type SelfParticipantAction = "join" | "leave";

export interface SelfUpdateParticipantInput {
  action: SelfParticipantAction;
}
