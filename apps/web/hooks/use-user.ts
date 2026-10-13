import { useMemo } from "react"
import { useSession } from "next-auth/react"
import type {  User } from "@workspace/shared"

export function useUser() {
  const { data, status } = useSession()

  const user: User | null = useMemo(() => {
    const sessionUser = data?.user
    if (!sessionUser) return null

    return {
      id: sessionUser.sub,
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
    }
  }, [data?.user])

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: Boolean(user),
  }
}
