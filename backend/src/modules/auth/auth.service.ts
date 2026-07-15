import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { hashPassword, comparePassword } from "../../utils/password";
import { parseDurationMs } from "../../utils/duration";
import { generateRefreshToken, hashToken } from "../../lib/refreshToken";
import { signAccessToken } from "../../lib/jwt";
import * as organizationService from "../organization/organization.service";
import * as usersRepository from "../users/users.repository";
import * as authRepository from "./auth.repository";
import { toSafeUser } from "../users/users.service";
import type { RegisterInput, LoginInput, AuthResult } from "./auth.types";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

async function issueTokenPair(userId: string, organizationId: string, role: "ADMIN" | "HOST" | "EMPLOYEE"): Promise<TokenPair> {
  const accessToken = signAccessToken({ sub: userId, organizationId, role });

  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRES_IN));
  await authRepository.createRefreshToken(userId, hashToken(refreshToken), expiresAt);

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthResult & { refreshToken: string }> {
  const emailTaken = await usersRepository.isEmailTaken(input.email);
  if (emailTaken) throw ApiError.conflict("An account with this email already exists");

  // First registered user for a new organization is always its Admin.
  const organization = await organizationService.createOrganizationWithUniqueSlug({
    name: input.organizationName,
  });

  const passwordHash = await hashPassword(input.password);
  const user = await usersRepository.createUser({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    password: passwordHash,
    role: "ADMIN",
    organizationId: organization.id,
  });

  const { accessToken, refreshToken } = await issueTokenPair(user.id, organization.id, user.role);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

export async function login(input: LoginInput): Promise<AuthResult & { refreshToken: string }> {
  const user = await usersRepository.findUserByEmail(input.email);
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const passwordMatches = await comparePassword(input.password, user.password);
  if (!passwordMatches) throw ApiError.unauthorized("Invalid email or password");

  // "Replace previous refresh token" — this app models one active session per user.
  await authRepository.deleteAllRefreshTokensForUser(user.id);

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.organizationId, user.role);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;

  const record = await authRepository.findRefreshTokenByHash(hashToken(refreshToken));
  if (record) await authRepository.deleteRefreshTokenById(record.id);
}

export async function refresh(refreshToken: string | undefined): Promise<{ accessToken: string; refreshToken: string }> {
  if (!refreshToken) throw ApiError.unauthorized("No refresh token provided");

  const record = await authRepository.findRefreshTokenByHash(hashToken(refreshToken));
  if (!record) throw ApiError.unauthorized("Invalid refresh token");

  if (record.expiresAt < new Date()) {
    await authRepository.deleteRefreshTokenById(record.id);
    throw ApiError.unauthorized("Refresh token has expired, please log in again");
  }

  // Rotate on every use: the old token is immediately invalidated, so a
  // stolen-but-already-used token can't be replayed.
  await authRepository.deleteRefreshTokenById(record.id);

  const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair(
    record.user.id,
    record.user.organizationId,
    record.user.role
  );

  return { accessToken, refreshToken: newRefreshToken };
}
