import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { checkDatabaseConnection } from "../services/health.service";

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const db = await checkDatabaseConnection();

  return sendSuccess(res, 200, "MeetWise API is healthy", {
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: db,
  });
});
