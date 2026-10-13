import { BlobServiceClient } from "@azure/storage-blob"
import { loadEnv } from "../utils/envs.js"

let blobClient: BlobServiceClient | null = null

export function getBlobClient(): BlobServiceClient {
  if (blobClient) {
    return blobClient
  }

  const connectionString = loadEnv("AZURE_STORAGE_CONNECTION_STRING")
  blobClient = BlobServiceClient.fromConnectionString(connectionString)

  return blobClient
}