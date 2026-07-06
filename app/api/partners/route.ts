import { NextRequest, NextResponse } from "next/server";
import { createPartner, getPartner } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, firm, tier, email, phone } = body ?? {};
    if (!name || !email || !phone || !["trade", "build", "circle"].includes(tier)) {
      return NextResponse.json({ error: "Fill name, email, phone and pick a tier." }, { status: 400 });
    }
    const partner = await createPartner({ name, firm, tier, email, phone });
    return NextResponse.json({ code: partner.code, rate: partner.rate });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const partner = await getPartner(code);
  if (!partner) return NextResponse.json({ error: "No partner with that code." }, { status: 404 });
  return NextResponse.json({ partner });
}
