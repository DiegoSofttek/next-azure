"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import type { CreateTestTableInput } from "@workspace/shared"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { FC } from "react"

const integrations = [
  { id: "analytics", label: "Analytics" },
  { id: "support", label: "Priority support" },
] as const

const formSchema = z.object({
  projectName: z.string().min(2, "Project name must contain at least 2 characters"),
  environment: z.string().min(1, "Select an environment"),
  integrations: z.array(z.string()).min(1, "Choose at least one integration"),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  onSubmitted: () => void
}

export const FormExample: FC<Props> = ({ onSubmitted }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      environment: "",
      integrations: [],
    },
  })

  const values = useWatch({ control: form.control })

  async function onSubmit(data: FormValues) {
    const payload: CreateTestTableInput = {
      projectName: data.projectName,
      environment: data.environment as CreateTestTableInput["environment"],
      integrations: data.integrations as CreateTestTableInput["integrations"],
    }

    const response = await fetch("/api/test-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Failed to create test table row")
    }

    form.reset()
    onSubmitted?.()
  }

  return (
    <>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>RHF Example</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="projectName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reference-project-name">Project name</FieldLabel>
                    <Input
                      id="reference-project-name"
                      placeholder="Next Azure"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>Name for your playground project.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="environment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reference-environment">Environment</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange} name={field.name}>
                      <SelectTrigger id="reference-environment" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select an environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="integrations"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend>Integrations</FieldLegend>
                    <FieldDescription>Select the tools you need to test.</FieldDescription>
                    {integrations.map((integration) => (
                      <Field key={integration.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                        <Checkbox
                          id={`reference-${integration.id}`}
                          checked={field.value.includes(integration.id)}
                          onCheckedChange={(checked) => {
                            const nextValue = checked
                              ? [...field.value, integration.id]
                              : field.value.filter((value) => value !== integration.id)
                            field.onChange(nextValue)
                          }}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={`reference-${integration.id}`}>{integration.label}</FieldLabel>
                        </FieldContent>
                      </Field>
                    ))}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>
                )}
              />
            </FieldGroup>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Live form state</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
            <code>{JSON.stringify(values, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </>
  )
}
