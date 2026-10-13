import { drizzle } from "drizzle-orm/node-mssql"
import mssql from "mssql"
import { getPool } from "./connection-pool.js"

function createDrizzle(client: mssql.ConnectionPool) {
  return drizzle({ client })
}

type AppDb = ReturnType<typeof createDrizzle>


let db: AppDb | undefined

export async function getDb(): Promise<AppDb> {
  if (!db) {
    const client = await getPool()

    db = createDrizzle(client)
  }
  return db
}
