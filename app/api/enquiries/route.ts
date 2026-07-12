import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/store";
import { sendEnquiryAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  }
  const kind = body.kind === "swatch-kit" ? "swatch-kit" : "consultation";
  const enquiry = await createEnquiry({ kind, name: body.name, phone: body.phone, note: body.note });
  void sendEnquiryAlert(kind, body.name, body.phone, body.note);
  return NextResponse.json({ id: enquiry.id });
}
