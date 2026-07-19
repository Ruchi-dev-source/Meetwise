import { z } from "zod";

const uuid = (label: string) => z.string().uuid(`${label} must be a valid id`);

export const meetingIdParamSchema = z.object({
  meetingId: uuid("meetingId"),
});

export const fileIdParamSchema = z.object({
  fileId: uuid("fileId"),
});

export const uploadFileMetadataSchema = z.object({
  originalFileName: z.string().trim().min(1, "originalFileName is required").max(255, "originalFileName is too long"),
  mimeType: z.string().trim().min(1, "mimeType is required").max(255, "mimeType is too long"),
  size: z.number({ invalid_type_error: "size must be a number" }).int("size must be an integer").positive("size must be positive"),
});
export type UploadFileMetadataSchema = z.infer<typeof uploadFileMetadataSchema>;
