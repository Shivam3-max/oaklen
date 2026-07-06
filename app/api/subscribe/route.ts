import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body.email ?? "").toString().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  await addSubscriber(email);
  return NextResponse.json({ ok: true });
}
