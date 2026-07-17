import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import type { AttendanceStatus } from "@prisma/client";
import * as attendanceRepository from "./attendance.repository";
import type { MarkAttendanceInput } from "./attendance.types";

interface MeetingContext {
  hostId: string;
  organizationId: string;
}

/**
 * Confirms the meeting exists in the caller's organization (404s otherwise,
 * same "don't leak existence across orgs" pattern as meetings/participants),
 * and returns just enough to authorize/scope what follows.
 */
async function getMeetingContext(meetingId: string, user: AuthenticatedUser): Promise<MeetingContext> {
  const meeting = await attendanceRepository.findMeetingContext(meetingId);
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

export async function markOwnAttendance(
  meetingId: string,
  input: MarkAttendanceInput,
  user: AuthenticatedUser
) {
  await getMeetingContext(meetingId, user);

  const participant = await attendanceRepository.findParticipant(meetingId, user.id);
  if (!participant) throw ApiError.notFound("You are not a participant of this meeting");

  const existing = await attendanceRepository.findAttendance(meetingId, user.id);
  if (existing) throw ApiError.conflict("Attendance has already been marked for this meeting");

  return attendanceRepository.createAttendance(meetingId, user.id, input.status ?? "PRESENT");
}

export async function listAttendance(meetingId: string, user: AuthenticatedUser) {
  await getMeetingContext(meetingId, user);
  return attendanceRepository.listAttendance(meetingId);
}

/** Host or Admin only, regardless of whose attendance is being updated. */
export async function updateAttendance(
  meetingId: string,
  targetUserId: string,
  status: AttendanceStatus,
  user: AuthenticatedUser
) {
  const meeting = await getMeetingContext(meetingId, user);
  assertHostOrAdmin(user, meeting.hostId);

  const existing = await attendanceRepository.findAttendance(meetingId, targetUserId);
  if (!existing) throw ApiError.notFound("Attendance record not found");

  return attendanceRepository.updateAttendance(meetingId, targetUserId, status);
}
