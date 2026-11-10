import type { Metadata } from "next"

import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Login | Workspace",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <LoginForm />
    </main>
  )
}
