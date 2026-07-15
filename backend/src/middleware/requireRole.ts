import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized("Not authenticated"));

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("You don't have permission to perform this action"));
    }

    return next();
  };
}
