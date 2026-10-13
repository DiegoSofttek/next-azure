import path from "node:path"
import { fileURLToPath } from "node:url"
import { config as loadEnv } from "dotenv"
import { defineConfig } from "drizzle-kit"
import { getConnectionString } from "./src/utils/connection.js"

// Load envs
const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(__dirname, "../../.env") })

export default defineConfig({
  dialect: "mssql",
  schema: "./src/schemas/**/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: getConnectionString(),
  },
})
