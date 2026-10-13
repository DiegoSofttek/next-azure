import { Role } from "../types/auth"

export const FUNCTIONS_AUTH_ISSUER = "web-app"
export const FUNCTIONS_AUTH_AUDIENCE = "azure-functions"

export interface FunctionsAuthClaims {
  sub: string
  email: string
  role: Role;
}
