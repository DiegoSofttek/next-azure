import { getConnectionString } from "./utils/connection.js"
import mssql from "mssql"


let poolPromise: Promise<mssql.ConnectionPool> | undefined

export async function getPool(): Promise<mssql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = mssql.connect(getConnectionString())
  }

  return poolPromise
}