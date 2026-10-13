export const TEST_TABLE_ROUTE = "/api/test-table"

export type TestEnvironment = "development" | "staging" | "production"
export type TestIntegration = "analytics" | "support"

export interface CreateTestTableInput {
  projectName: string
  environment: TestEnvironment
  integrations: TestIntegration[]
}

export interface TestTableDto {
  id: number
  projectName: string
  environment: TestEnvironment
  integrations: TestIntegration[]
  createdAt: string
}
