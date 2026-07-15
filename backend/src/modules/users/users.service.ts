import type { User } from "@prisma/client";
import * as usersRepository from "./users.repository";
import { ApiError } from "../../utils/ApiError";
import type { SafeUser } from "./users.types";

export function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function getSafeUserById(id: string): Promise<SafeUser> {
  const user = await usersRepository.findUserById(id);
  if (!user) throw ApiError.notFound("User not found");
  return toSafeUser(user);
}
