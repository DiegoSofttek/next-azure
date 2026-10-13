export const DOCUMENTS_ROUTE = "/api/documents"

export interface UploadDocumentInput {
  userId: string
  fileName: string
  contentType: string
  base64Data: string
}

export interface UploadDocumentResponse {
  blobName: string
}

export interface GetDocumentUrlInput {
  userId: string
  blobName: string
}

export interface GetDocumentUrlResponse {
  url: string
}
