import { prisma } from "../../lib/prisma";
import type { AttendanceStatus } from "@prisma/client";

const userSelect = {
  select: { id: true, firstName: true, lastName: true, email: true },
} as const;

/**
 * Read-only lookup used purely for organization-scoping and host
 * identification — this module never writes to Meeting, so it doesn't
 * touch the meetings module's own repository.
 */
export function findMeetingContext(meetingId: string) {
  return prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { id: true, hostId: true, host: { select: { organizationId: true } } },
  });
}

/**
 * Read-only lookup used purely to confirm "only meeting participants may
 * mark attendance" — this module never writes to Participant, so it
 * doesn't touch the participants module's own repository.
 */
export function findParticipant(meetingId: string, userId: string) {
  return prisma.participant.findUnique({
    where: { meetingId_userId: { meetingId, userId } },
    select: { id: true },
  });
}

export function findAttendance(meetingId: string, userId: string) {
  return prisma.attendance.findUnique({
    where: { meetingId_userId: { meetingId, userId } },
    include: { user: userSelect },
  });
}

export function listAttendance(meetingId: string) {
  return prisma.attendance.findMany({
    where: { meetingId },
    include: { user: userSelect },
    orderBy: { markedAt: "asc" },
  });
}

export function createAttendance(meetingId: string, userId: string, status: AttendanceStatus) {
  return prisma.attendance.create({
    data: { meetingId, userId, status },
    include: { user: userSelect },
  });
}

export function updateAttendance(meetingId: string, userId: string, status: AttendanceStatus) {
  return prisma.attendance.update({
    where: { meetingId_userId: { meetingId, userId } },
    data: { status, markedAt: new Date() },
    include: { user: userSelect },
  });
}
