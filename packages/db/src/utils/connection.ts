import { loadEnv } from "./envs.js"

export function getConnectionString(): string {
  const password = loadEnv("MSSQL_SA_PASSWORD")
  const server = loadEnv("MSSQL_SERVER");
  const port = loadEnv("MSSQL_PORT");
  const user = loadEnv("MSSQL_USER");
  const database = loadEnv("MSSQL_DATABASE");

  return `Server=${server},${port};Database=${database};User Id=${user};Password=${password};Encrypt=true;TrustServerCertificate=true`
}
