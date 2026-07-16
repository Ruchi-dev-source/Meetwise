import { prisma } from "../../lib/prisma";
import type { CreateMeetingInput, ListMeetingsFilter, UpdateMeetingInput } from "./meeting.types";

const hostSelect = {
  select: { id: true, firstName: true, lastName: true },
} as const;

export function createMeeting(input: CreateMeetingInput, hostId: string) {
  return prisma.meeting.create({
    data: { ...input, hostId },
    include: { host: hostSelect },
  });
}

export function findMeetingsByOrganization(organizationId: string, filter: ListMeetingsFilter) {
  return prisma.meeting.findMany({
    where: {
      host: { organizationId },
      ...(filter.status ? { status: filter.status } : {}),
    },
    include: { host: hostSelect },
    orderBy: { scheduledStart: "asc" },
  });
}

/** Scoped to organization so a meeting from another org 404s instead of leaking whether the id exists. */
export function findMeetingByIdInOrganization(id: string, organizationId: string) {
  return prisma.meeting.findFirst({
    where: { id, host: { organizationId } },
    include: { host: hostSelect },
  });
}

export function updateMeeting(id: string, input: UpdateMeetingInput) {
  return prisma.meeting.update({
    where: { id },
    data: input,
    include: { host: hostSelect },
  });
}

export function deleteMeeting(id: string) {
  return prisma.meeting.delete({ where: { id } });
}
