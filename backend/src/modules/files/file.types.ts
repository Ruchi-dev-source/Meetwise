import type { MeetingFile } from "@prisma/client";

export type FileWithUploader = MeetingFile & {
  uploader: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

/** What the client sends — the server derives storedFileName/storageKey/storageProvider itself. */
export interface UploadFileMetadataInput {
  originalFileName: string;
  mimeType: string;
  size: number;
}
