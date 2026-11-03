import { NextRequest, NextResponse } from "next/server";
import { getMediaSource } from "@/lib/store";
import { decodeDataUrl, isDataUrl, type MediaKind } from "@/lib/media";

export const dynamic = "force-dynamic";

const KINDS = new Set<MediaKind>(["p", "j", "s"]);
// Raster photos only — an SVG served from our own origin could run script.
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

// Serves a photo stored in the database as a real image file (see lib/media.ts).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ kind: string; id: string; index: string }> },
) {
  const { kind, id, index } = await params;
  if (!KINDS.has(kind as MediaKind)) return new NextResponse("Not found", { status: 404 });

  const src = await getMediaSource(kind as MediaKind, decodeURIComponent(id), index);
  if (!src) return new NextResponse("Not found", { status: 404 });

  // Bundled or external photos are already real files.
  if (!isDataUrl(src)) return NextResponse.redirect(new URL(src, req.url), 302);

  const file = decodeDataUrl(src);
  if (!file || !TYPES.has(file.type)) return new NextResponse("Not found", { status: 404 });

  // A versioned URL never changes content, so it can be cached for good.
  const versioned = req.nextUrl.searchParams.has("v");
  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.body.length),
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=300",
    },
  });
}
