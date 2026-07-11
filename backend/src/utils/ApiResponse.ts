import type { Response } from "express";

interface ApiResponseBody<T> {
  success: true;
  message: string;
  data: T;
}

export function sendSuccess<T>(res: Response, statusCode: number, message: string, data: T) {
  const body: ApiResponseBody<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
}
