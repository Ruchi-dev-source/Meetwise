import { prisma } from "../../lib/prisma";

const uploaderSelect = {
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
 * view files" — this module never writes to Participant, matching how
 * attendance/tasks already read (never write) it for their own
 * eligibility checks.
 */
export function findParticipant(meetingId: string, userId: string) {
  return prisma.participant.findUnique({
    where: { meetingId_userId: { meetingId, userId } },
    select: { id: true },
  });
}

export function createFile(data: {
  meetingId: string;
  uploaderId: string;
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  size: number;
  storageProvider: "LOCAL";
  storageKey: string;
}) {
  return prisma.meetingFile.create({
    data,
    include: { uploader: uploaderSelect },
  });
}

export function listFilesByMeeting(meetingId: string) {
  return prisma.meetingFile.findMany({
    where: { meetingId },
    include: { uploader: uploaderSelect },
    orderBy: { uploadedAt: "desc" },
  });
}

export function findFileById(fileId: string) {
  return prisma.meetingFile.findUnique({
    where: { id: fileId },
    include: {
      uploader: uploaderSelect,
      meeting: { select: { id: true, hostId: true, host: { select: { organizationId: true } } } },
    },
  });
}

export function deleteFile(fileId: string) {
  return prisma.meetingFile.delete({ where: { id: fileId } });
}
