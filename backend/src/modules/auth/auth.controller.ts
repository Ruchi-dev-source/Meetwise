import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { setRefreshTokenCookie, clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE } from "../../lib/cookies";
import * as authService from "./auth.service";
import * as usersService from "../users/users.service";
import { registerSchema, loginSchema } from "./auth.validator";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.register(input);

  setRefreshTokenCookie(res, refreshToken);
  return sendSuccess(res, 201, "Account created", { user, accessToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.login(input);

  setRefreshTokenCookie(res, refreshToken);
  return sendSuccess(res, 200, "Logged in successfully", { user, accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
  await authService.logout(token);

  clearRefreshTokenCookie(res);
  return sendSuccess(res, 200, "Logged out successfully", null);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
  const { accessToken, refreshToken } = await authService.refresh(token);

  setRefreshTokenCookie(res, refreshToken);
  return sendSuccess(res, 200, "Token refreshed", { accessToken });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");

  const user = await usersService.getSafeUserById(req.user.id);
  return sendSuccess(res, 200, "Current user", { user });
});
