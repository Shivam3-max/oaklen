import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";

// Razorpay calls this on payment events. Configure the URL + secret in the
// Razorpay dashboard (Settings → Webhooks) and set RAZORPAY_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    // We already confirm payment synchronously via signature verification at
    // checkout; this webhook is the safety net for async captures/failures.
    if (process.env.NODE_ENV !== "production") {
      console.log("Razorpay webhook:", event.event);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
}
