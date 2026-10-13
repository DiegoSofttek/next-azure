"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { register, handleSubmit, formState } = form

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null)

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (result?.error) {
      setAuthError("Invalid credentials. Please try again.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Local development login with credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!formState.errors.email}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                id="login-email"
                type="email"
                placeholder="admin@local.dev"
                autoComplete="email"
                aria-invalid={!!formState.errors.email}
                {...register("email")}
              />
              <FieldDescription>Use an email that starts with admin for admin role.</FieldDescription>
              {formState.errors.email && <FieldError errors={[formState.errors.email]} />}
            </Field>

            <Field data-invalid={!!formState.errors.password}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!formState.errors.password}
                {...register("password")}
              />
              {formState.errors.password && <FieldError errors={[formState.errors.password]} />}
            </Field>
          </FieldGroup>
          {authError ? <p className="text-destructive text-sm">{authError}</p> : null}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="login-form" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </CardFooter>
    </Card>
  )
}
