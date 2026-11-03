import { createHash } from "node:crypto";

// Uploaded photos are stored in the database as data: URLs. Inlining those
// into pages made /shop ~24 MB, so public pages get a short /media URL
// instead and the browser fetches (and caches) each photo on its own.
// The ?v= hash changes whenever the photo does, so caching can be permanent.

export type MediaKind = "p" | "j" | "s"; // product, project, site image

export const isDataUrl = (s: unknown): s is string => typeof s === "string" && s.startsWith("data:");

export function mediaUrl(kind: MediaKind, id: string, index: string | number, data: string): string {
  const v = createHash("md5").update(data).digest("hex").slice(0, 10);
  return `/media/${kind}/${encodeURIComponent(id)}/${index}?v=${v}`;
}

export const toMedia = (kind: MediaKind, id: string, index: string | number, src: string) =>
  isDataUrl(src) ? mediaUrl(kind, id, index, src) : src;

export function decodeDataUrl(src: string): { type: string; body: Buffer } | null {
  const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(src);
  if (!m) return null;
  const body = m[2] ? Buffer.from(m[3], "base64") : Buffer.from(decodeURIComponent(m[3]));
  return { type: m[1] || "application/octet-stream", body };
}
