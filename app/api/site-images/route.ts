import { NextResponse } from "next/server";
import { getSiteImages } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await getSiteImages();
  return NextResponse.json({ images });
}
