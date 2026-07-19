import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as fileController from "./file.controller";

/** Mounted at /meetings/:meetingId/files — mergeParams so :meetingId is available. */
export const meetingFileRouter = Router({ mergeParams: true });
meetingFileRouter.use(authenticate);
meetingFileRouter.post("/", fileController.uploadFileMetadata);
meetingFileRouter.get("/", fileController.listMeetingFiles);

/** Mounted at /files — operates on a file directly by id, independent of the meeting-nested path. */
export const fileRouter = Router();
fileRouter.use(authenticate);
fileRouter.get("/:fileId", fileController.getFileById);
fileRouter.delete("/:fileId", fileController.deleteFile);
