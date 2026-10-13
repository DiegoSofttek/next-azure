"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"

interface ProtectedDocumentsDemoProps {
  userId?: string
}

export function DocumentsExample({ userId }: ProtectedDocumentsDemoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [latestBlobName, setLatestBlobName] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  async function uploadImage() {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadMessage(null)
    setImageUrl(null)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/documents", { method: "POST", body: formData })
      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = (await response.json()) as { blobName: string }
      setLatestBlobName(data.blobName)
      setUploadMessage("Upload successful.")
    } catch {
      setUploadMessage("Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  async function loadImage() {
    if (!userId || !latestBlobName) return

    setIsLoadingImage(true)
    setUploadMessage(null)
    try {
      const requestUrl = new URL("/api/documents", window.location.origin)
      requestUrl.searchParams.set("userId", userId)
      requestUrl.searchParams.set("blobName", latestBlobName)

      const response = await fetch(requestUrl.toString())
      if (!response.ok) {
        throw new Error("Image access denied")
      }

      const data = (await response.json()) as { url: string }
      setImageUrl(data.url)
    } catch {
      setUploadMessage("You cannot access this image.")
    } finally {
      setIsLoadingImage(false)
    }
  }

  return (
    <div className="space-y-2 rounded-md border p-4">
      <h2 className="text-sm font-semibold">Protected documents demo</h2>
      <p className="text-xs text-muted-foreground">
        Upload an image to `documents/{`{userId}`}/...` and request a signed URL only as owner.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
      />
      <div className="flex items-center gap-2">
        <Button type="button" onClick={() => void uploadImage()} disabled={!selectedFile || isUploading}>
          {isUploading ? "Uploading..." : "Upload image"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadImage()}
          disabled={!userId || !latestBlobName || isLoadingImage}
        >
          {isLoadingImage ? "Loading..." : "Load my image"}
        </Button>
      </div>
      {latestBlobName ? <p className="text-xs">Blob name: {latestBlobName}</p> : null}
      {uploadMessage ? <p className="text-xs">{uploadMessage}</p> : null}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="User uploaded document preview"
          width={1200}
          height={800}
          unoptimized
          className="max-h-64 w-auto max-w-full rounded-md border object-contain"
        />
      ) : null}
    </div>
  )
}
