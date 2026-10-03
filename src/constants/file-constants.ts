export const IMAGE_MIME_TYPES = {
  PNG: "image/png",
  JPG: "image/jpeg",
  WEBP: "image/webp",
  GIF: "image/gif",
  SVG: "image/svg+xml",
} as const;

export const DOCUMENT_MIME_TYPES = {
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;