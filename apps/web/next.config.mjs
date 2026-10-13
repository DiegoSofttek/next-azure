import path from "node:path"
import { fileURLToPath } from "node:url"
import nextEnv from "@next/env"

// Load environment variables from the monorepo root
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(currentDir, "../..")
nextEnv.loadEnvConfig(monorepoRoot)

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig
