import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import * as fileService from "./file.service";
import { meetingIdParamSchema, fileIdParamSchema, uploadFileMetadataSchema } from "./file.validator";

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return req.user;
}

export const uploadFileMetadata = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);
  const input = uploadFileMetadataSchema.parse(req.body);

  const file = await fileService.uploadFileMetadata(meetingId, input, user);
  return sendSuccess(res, 201, "File metadata recorded", { file });
});

export const listMeetingFiles = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { meetingId } = meetingIdParamSchema.parse(req.params);

  const files = await fileService.listMeetingFiles(meetingId, user);
  return sendSuccess(res, 200, "Files retrieved", { files });
});

export const getFileById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { fileId } = fileIdParamSchema.parse(req.params);

  const file = await fileService.getFileById(fileId, user);
  return sendSuccess(res, 200, "File retrieved", { file });
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { fileId } = fileIdParamSchema.parse(req.params);

  await fileService.deleteFile(fileId, user);
  return res.status(204).send();
});
