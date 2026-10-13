export const STORAGE_CONTAINERS = {
  documents: "documents",
} as const

export type StorageContainer = keyof typeof STORAGE_CONTAINERS