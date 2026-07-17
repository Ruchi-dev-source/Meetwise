import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as participantRepository from "./participant.repository";
import type { InviteParticipantInput, SelfParticipantAction } from "./participant.types";

interface MeetingContext {
  hostId: string;
  organizationId: string;
}

/**
 * Confirms the meeting exists in the caller's organization (404s otherwise,
 * same "don't leak existence across orgs" pattern as the meetings module),
 * and returns just enough to authorize/scope what follows.
 */
async function getMeetingContext(meetingId: string, user: AuthenticatedUser): Promise<MeetingContext> {
  const meeting = await participantRepository.findMeetingContext(meetingId);
  if (!meeting || meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Meeting not found");
  }
  return { hostId: meeting.hostId, organizationId: meeting.host.organizationId };
}

function assertHostOrAdmin(user: AuthenticatedUser, hostId: string) {
  const isHost = user.id === hostId;
  const isAdmin = user.role === "ADMIN";
  if (!isHost && !isAdmin) {
    throw ApiError.forbidden("Only the meeting host or an organization admin can do this");
  }
}

/**
 * Idempotent — guarantees the host has a HOST participant row without
 * requiring any change to how meetings are created. Self-healing: this also
 * backfills the host as a participant for meetings that existed before this
 * module did.
 */
async function ensureHostParticipant(meetingId: string, hostId: string) {
  await participantRepository.upsertHostParticipant(meetingId, hostId);
}

export async function inviteParticipant(
  meetingId: string,
  input: InviteParticipantInput,
  user: AuthenticatedUser
) {
  const meeting = await getMeetingContext(meetingId, user);
  assertHostOrAdmin(user, meeting.hostId);
  await ensureHostParticipant(meetingId, meeting.hostId);

  const targetUser = await participantRepository.findUserForInvite(input.userId);
  if (!targetUser) throw ApiError.notFound("User not found");
  if (targetUser.organizationId !== meeting.organizationId) {
    throw ApiError.forbidden("Only users from the same organization may be invited");
  }

  const existing = await participantRepository.findParticipant(meetingId, input.userId);
  if (existing) throw ApiError.conflict("This user is already a participant of the meeting");

  return participantRepository.createParticipant(meetingId, input.userId, input.role ?? "ATTENDEE");
}

export async function listParticipants(meetingId: string, user: AuthenticatedUser) {
  const meeting = await getMeetingContext(meetingId, user);
  await ensureHostParticipant(meetingId, meeting.hostId);

  return participantRepository.listParticipants(meetingId);
}

export async function removeParticipant(meetingId: string, targetUserId: string, user: AuthenticatedUser) {
  const meeting = await getMeetingContext(meetingId, user);
  assertHostOrAdmin(user, meeting.hostId);

  if (targetUserId === meeting.hostId) {
    throw ApiError.badRequest("The meeting host can't be removed as a participant");
  }

  const existing = await participantRepository.findParticipant(meetingId, targetUserId);
  if (!existing) throw ApiError.notFound("Participant not found");

  await participantRepository.deleteParticipant(meetingId, targetUserId);
}

export async function updateSelfParticipant(
  meetingId: string,
  action: SelfParticipantAction,
  user: AuthenticatedUser
) {
  const meeting = await getMeetingContext(meetingId, user);
  await ensureHostParticipant(meetingId, meeting.hostId);

  const existing = await participantRepository.findParticipant(meetingId, user.id);
  if (!existing) throw ApiError.notFound("You are not a participant of this meeting");

  const data = action === "join" ? { joinedAt: new Date() } : { leftAt: new Date() };
  return participantRepository.updateParticipantSelf(meetingId, user.id, data);
}
