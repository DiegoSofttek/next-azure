import { datetime2, int, mssqlTable, nvarchar } from "drizzle-orm/mssql-core"

export const testEnvironments = ["development", "staging", "production"] as const
export const testIntegrations = ["analytics", "support"] as const

export type TestEnvironment = (typeof testEnvironments)[number]
export type TestIntegration = (typeof testIntegrations)[number]

export const testTable = mssqlTable("test_table", {
  id: int("id").identity().primaryKey(),
  projectName: nvarchar("project_name", { length: 100 }).notNull(),
  environment: nvarchar("environment", { length: 50 }).$type<TestEnvironment>().notNull(),
  integrations: nvarchar("integrations", { length: 200 }).notNull(),
  createdAt: datetime2("created_at").notNull(),
})

export type TestTable = typeof testTable.$inferSelect
export type NewTestTable = typeof testTable.$inferInsert
