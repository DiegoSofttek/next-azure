"use client"

import { useQuery } from "@tanstack/react-query"
import { FormExample } from "./_components/form-example"
import { DocumentsExample } from "./_components/documents-example"
import { type TestTableDto } from "@workspace/shared"
import { useUser } from "@/hooks/use-user"

interface TestTableApiResponse {
  rows: TestTableDto[]
}

async function getTestTableRows(): Promise<TestTableApiResponse> {
  const response = await fetch("/api/test-table")
  if (!response.ok) {
    throw new Error("Function response unavailable.")
  }

  return (await response.json()) as TestTableApiResponse
}

export default function ReferencePage() {
  const { user } = useUser()

  const {
    data: testTableResponse,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["test-table", "get"],
    queryFn: getTestTableRows,
  })

  return (
    <main className="flex min-h-svh p-6">
      <section className="flex w-full max-w-4xl flex-col gap-4">
        <h1 className="text-xl font-semibold">Reference playground</h1>
        <p className="text-sm">User: {user?.name}</p>
        <p className="text-sm">Role: {user?.role}</p>
        <p className="text-sm">User ID: {user?.id}</p>
        <p className="text-sm">
          {isPending
            ? "Test table rows: loading..."
            : testTableResponse
              ? `Test table rows loaded: ${testTableResponse.rows.length}`
              : "Test table rows unavailable. Start apps/functions and reload."}
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {(testTableResponse?.rows ?? []).slice(0, 2).map((row) => (
            <li key={row.id}>
              {row.projectName} ({row.environment}) - {row.integrations.join(", ")}
            </li>
          ))}
        </ul>
        <DocumentsExample userId={user?.id} />
        <FormExample onSubmitted={() => void refetch()} />
      </section>
    </main>
  )
}
