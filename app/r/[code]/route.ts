import { NextRequest, NextResponse } from "next/server";
import { trackClick } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const found = await trackClick(code);
  const res = NextResponse.redirect(new URL("/", req.url));
  if (found) {
    res.cookies.set("oaklen_ref", code.toUpperCase(), {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}
