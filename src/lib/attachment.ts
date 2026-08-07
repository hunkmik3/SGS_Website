/**
 * Attachment rules, shared by the browser (instant feedback) and the route
 * handler (the check that actually counts — a client can always be bypassed).
 */

/**
 * Hard ceiling for a file travelling inside the email itself.
 *
 * This cannot be raised much: Resend caps a message at 40MB, most inboxes
 * reject above ~25MB, and base64 inflates a file by about a third. On Vercel
 * the binding limit is lower still — a Serverless Function request body is
 * capped at 4.5MB, so anything over ~3MB never reaches this code.
 *
 * Bigger files need a different route entirely: upload straight from the
 * browser to object storage with a presigned URL and mail the link instead.
 */
export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

/**
 * An allowlist, not a blocklist. Blocklists are a losing game — every list of
 * dangerous extensions is missing something, and double extensions or unusual
 * platform binaries slip through. Naming what a project brief may legitimately
 * contain is both shorter and safer.
 */
export const ALLOWED_EXTENSIONS = [
  // Documents
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "md", "rtf", "csv",
  // Images
  "jpg", "jpeg", "png", "gif", "webp", "avif", "heic", "tif", "tiff",
  // Video and audio
  "mp4", "mov", "webm", "m4v", "mp3", "wav", "aac",
  // Design and edit files
  "ai", "psd", "fig", "sketch", "xd", "aep", "prproj", "eps", "svg",
  // Archives
  "zip",
] as const;

export function extensionOf(filename: string) {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot + 1).toLowerCase();
}

export function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Returns an error message, or null when the file is acceptable. */
export function checkAttachment(file: File): string | null {
  if (file.size === 0) return "That file appears to be empty.";

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return `That file is ${formatBytes(file.size)}. Attachments are limited to ${formatBytes(
      MAX_ATTACHMENT_BYTES,
    )} — please share a download link in the project details instead.`;
  }

  const ext = extensionOf(file.name);
  if (!ext) return "That file has no extension, so we cannot accept it.";

  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return `.${ext} files are not accepted. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}.`;
  }

  return null;
}
