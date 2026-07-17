import { prisma } from "../../lib/prisma";
import type { ParticipantRole } from "@prisma/client";

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

export function findUserForInvite(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true },
  });
}

export function findParticipant(meetingId: string, userId: string) {
  return prisma.participant.findUnique({
    where: { meetingId_userId: { meetingId, userId } },
    include: { user: userSelect },
  });
}

export function listParticipants(meetingId: string) {
  return prisma.participant.findMany({
    where: { meetingId },
    include: { user: userSelect },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
  });
}

export function createParticipant(meetingId: string, userId: string, role: ParticipantRole) {
  return prisma.participant.create({
    data: { meetingId, userId, role },
    include: { user: userSelect },
  });
}

/** Idempotent — used to guarantee the host is always present as a participant. */
export function upsertHostParticipant(meetingId: string, hostId: string) {
  return prisma.participant.upsert({
    where: { meetingId_userId: { meetingId, userId: hostId } },
    update: {},
    create: { meetingId, userId: hostId, role: "HOST", joinedAt: new Date() },
    include: { user: userSelect },
  });
}

export function deleteParticipant(meetingId: string, userId: string) {
  return prisma.participant.delete({
    where: { meetingId_userId: { meetingId, userId } },
  });
}

export function updateParticipantSelf(meetingId: string, userId: string, data: { joinedAt?: Date; leftAt?: Date }) {
  return prisma.participant.update({
    where: { meetingId_userId: { meetingId, userId } },
    data,
    include: { user: userSelect },
  });
}
