import { randomUUID } from "crypto";
import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedUser } from "../../types/express";
import * as fileRepository from "./file.repository";
import type { UploadFileMetadataInput } from "./file.types";

interface MeetingContext {
  hostId: string;
  organizationId: string;
}

/**
 * Confirms the meeting exists in the caller's organization (404s otherwise,
 * same "don't leak existence across orgs" pattern used throughout this
 * codebase), and returns just enough to authorize/scope what follows.
 */
async function getMeetingContext(meetingId: string, user: AuthenticatedUser): Promise<MeetingContext> {
  const meeting = await fileRepository.findMeetingContext(meetingId);
  if (!meeting || meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("Meeting not found");
  }
  return { hostId: meeting.hostId, organizationId: meeting.host.organizationId };
}

function isHostOrAdmin(user: AuthenticatedUser, hostId: string): boolean {
  return user.id === hostId || user.role === "ADMIN";
}

async function isParticipant(meetingId: string, userId: string): Promise<boolean> {
  const participant = await fileRepository.findParticipant(meetingId, userId);
  return participant !== null;
}

// ── Storage abstraction ──────────────────────────────────────────────
// Metadata-only for now: no bytes are actually written anywhere. This
// function is the single place that decides where a file *would* live.
// Adding S3/AZURE/GCS later means adding a case here (and, when real
// uploads land, an adapter that knows how to write to that provider) —
// nothing in the controller, service authorization logic, or repository
// needs to change.
type StorageLocation = { storageProvider: "LOCAL"; storedFileName: string; storageKey: string };

function prepareStorageLocation(meetingId: string, originalFileName: string): StorageLocation {
  const lastDot = originalFileName.lastIndexOf(".");
  const extension = lastDot > 0 ? originalFileName.slice(lastDot) : "";
  const storedFileName = `${randomUUID()}${extension}`;

  return {
    storageProvider: "LOCAL",
    storedFileName,
    storageKey: `meetings/${meetingId}/${storedFileName}`,
  };
}
// ──────────────────────────────────────────────────────────────────────

export async function uploadFileMetadata(
  meetingId: string,
  input: UploadFileMetadataInput,
  user: AuthenticatedUser
) {
  const meeting = await getMeetingContext(meetingId, user);
  if (!isHostOrAdmin(user, meeting.hostId)) {
    throw ApiError.forbidden("Only the meeting host or an organization admin can upload files");
  }

  const location = prepareStorageLocation(meetingId, input.originalFileName);

  return fileRepository.createFile({
    meetingId,
    uploaderId: user.id,
    originalFileName: input.originalFileName,
    storedFileName: location.storedFileName,
    mimeType: input.mimeType,
    size: input.size,
    storageProvider: location.storageProvider,
    storageKey: location.storageKey,
  });
}

export async function listMeetingFiles(meetingId: string, user: AuthenticatedUser) {
  const meeting = await getMeetingContext(meetingId, user);

  if (!isHostOrAdmin(user, meeting.hostId) && !(await isParticipant(meetingId, user.id))) {
    throw ApiError.forbidden("You must be a participant of this meeting to view its files");
  }

  return fileRepository.listFilesByMeeting(meetingId);
}

export async function getFileById(fileId: string, user: AuthenticatedUser) {
  const file = await fileRepository.findFileById(fileId);
  if (!file || !file.meeting || file.meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("File not found");
  }

  if (!isHostOrAdmin(user, file.meeting.hostId) && !(await isParticipant(file.meeting.id, user.id))) {
    throw ApiError.forbidden("You must be a participant of this meeting to view this file");
  }

  return file;
}

export async function deleteFile(fileId: string, user: AuthenticatedUser): Promise<void> {
  const file = await fileRepository.findFileById(fileId);
  if (!file || !file.meeting || file.meeting.host.organizationId !== user.organizationId) {
    throw ApiError.notFound("File not found");
  }

  const isUploader = file.uploaderId === user.id;
  if (!isHostOrAdmin(user, file.meeting.hostId) && !isUploader) {
    throw ApiError.forbidden("Only the meeting host, an organization admin, or the original uploader can delete this file");
  }

  await fileRepository.deleteFile(fileId);
}
