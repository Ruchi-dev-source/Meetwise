import type { SafeUser } from "../users/users.types";

export interface RegisterInput {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
}
