import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as meetingRepository from "./meeting.repository";
import type { CreateMeetingInput, ListMeetingsFilter, MeetingWithHost, UpdateMeetingInput } from "./meeting.types";

export function createMeeting(input: CreateMeetingInput, user: AuthenticatedUser): Promise<MeetingWithHost> {
  return meetingRepository.createMeeting(input, user.id);
}

export function listMeetings(filter: ListMeetingsFilter, user: AuthenticatedUser): Promise<MeetingWithHost[]> {
  return meetingRepository.findMeetingsByOrganization(user.organizationId, filter);
}

export async function getMeetingById(id: string, user: AuthenticatedUser): Promise<MeetingWithHost> {
  const meeting = await meetingRepository.findMeetingByIdInOrganization(id, user.organizationId);
  if (!meeting) throw ApiError.notFound("Meeting not found");
  return meeting;
}

/** Host or Admin only. Throws 404 if the meeting isn't in the user's org at all, 403 if it is but they can't touch it. */
async function getMeetingForMutation(id: string, user: AuthenticatedUser): Promise<MeetingWithHost> {
  const meeting = await meetingRepository.findMeetingByIdInOrganization(id, user.organizationId);
  if (!meeting) throw ApiError.notFound("Meeting not found");

  const isHost = meeting.hostId === user.id;
  const isAdmin = user.role === "ADMIN";
  if (!isHost && !isAdmin) {
    throw ApiError.forbidden("Only the meeting host or an organization admin can do this");
  }

  return meeting;
}

export async function updateMeeting(
  id: string,
  input: UpdateMeetingInput,
  user: AuthenticatedUser
): Promise<MeetingWithHost> {
  await getMeetingForMutation(id, user);
  return meetingRepository.updateMeeting(id, input);
}

export async function deleteMeeting(id: string, user: AuthenticatedUser): Promise<void> {
  await getMeetingForMutation(id, user);
  await meetingRepository.deleteMeeting(id);
}
