import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { isProduction } from "../config/env";

interface ErrorResponseBody {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.flatten().fieldErrors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint violation, P2025 = record not found, etc.
    statusCode = err.code === "P2025" ? 404 : 409;
    message = mapPrismaError(err);
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (!isProduction && statusCode === 500) {
    console.error(err);
  }

  const body: ErrorResponseBody = { success: false, message };
  if (errors) body.errors = errors;
  if (!isProduction && err instanceof Error) body.stack = err.stack;

  res.status(statusCode).json(body);
}

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): string {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return `A record with this ${target} already exists.`;
    }
    case "P2025":
      return "The requested record was not found.";
    case "P2003":
      return "This action violates a required relationship between records.";
    default:
      return "A database error occurred.";
  }
}
