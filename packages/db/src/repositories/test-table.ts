import { desc } from "drizzle-orm"
import { getDb } from "../client.js"
import {
  testEnvironments,
  testIntegrations,
  testTable,
  type NewTestTable,
  type TestEnvironment,
  type TestIntegration,
} from "../schemas/index.js"

export interface TestTableRow {
  id: number
  projectName: string
  environment: TestEnvironment
  integrations: TestIntegration[]
  createdAt: string
}

function parseIntegrations(value: string): TestIntegration[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is TestIntegration =>
      (testIntegrations as readonly string[]).includes(item),
    )
}

export async function listTestTableRows(): Promise<TestTableRow[]> {
  const db = await getDb()
  const rows = await db.select().from(testTable).orderBy(desc(testTable.id))

  return rows.map((row) => ({
    id: row.id,
    projectName: row.projectName,
    environment: row.environment,
    integrations: parseIntegrations(row.integrations),
    createdAt: row.createdAt.toISOString(),
  }))
}

type CreateTestTableRowInput = Omit<NewTestTable, "id" | "createdAt">

export async function createTestTableRow(data: CreateTestTableRowInput): Promise<void> {
  if (!(testEnvironments as readonly string[]).includes(data.environment)) {
    throw new Error("Invalid environment")
  }

  const db = await getDb()
  await db.insert(testTable).values({
    ...data,
    createdAt: new Date(),
  })
}
