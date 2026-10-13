export type Role = "admin" | "user";

export interface User {
  id: string
  name: string
  email: string
  role: Role;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
