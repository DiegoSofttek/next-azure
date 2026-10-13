import { BlobSASPermissions } from "@azure/storage-blob"
import { getBlobClient } from "../storage/client.js"
import { STORAGE_CONTAINERS, type StorageContainer } from "../storage/containers.js"

const convertPermissions = (permissions: Partial<BlobSASPermissions>): BlobSASPermissions => {
  return BlobSASPermissions.from({
    read: permissions.read ?? false,
    write: permissions.write ?? false,
    delete: permissions.delete ?? false,
    add: permissions.add ?? false,
    create: permissions.create ?? false,
    deleteVersion: permissions.deleteVersion ?? false,
    execute: permissions.execute ?? false,
    move: permissions.move ?? false,
    permanentDelete: permissions.permanentDelete ?? false,
    setImmutabilityPolicy: permissions.setImmutabilityPolicy ?? false,
    tag: permissions.tag ?? false,
  })
}

export async function uploadFile(
  container: StorageContainer,
  blobName: string,
  content: Buffer | Blob,
  contentType: string
): Promise<string> {
  const client = getBlobClient()
  const containerClient = client.getContainerClient(STORAGE_CONTAINERS[container])

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({ access: "blob" })

  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.uploadData(content as Buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  })

  return blockBlobClient.url
}

export async function generateDownloadUrl(
  container: StorageContainer,
  blobName: string,
  expiresInMinutes = 60
): Promise<string> {
  const client = getBlobClient()
  const containerClient = client.getContainerClient(STORAGE_CONTAINERS[container])
  const blobClient = containerClient.getBlobClient(blobName)

  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  const sas = await blobClient.generateSasUrl({
    permissions: convertPermissions({ read: true }),
    expiresOn,
  })

  return sas
}

export async function deleteFile(
  container: keyof typeof STORAGE_CONTAINERS,
  blobName: string
): Promise<void> {
  const client = getBlobClient()
  const containerClient = client.getContainerClient(STORAGE_CONTAINERS[container])
  await containerClient.deleteBlob(blobName)
}