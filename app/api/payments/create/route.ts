import { NextRequest, NextResponse } from "next/server";
import { getStoredProduct } from "@/lib/store";
import { isRazorpayConfigured, razorpayKeyId, createRazorpayOrder } from "@/lib/razorpay";
import { tokenAmount } from "@/data/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = (body.items ?? []) as { slug: string; qty: number }[];
    if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // recompute the amount server-side so the client can't set its own price
    let subtotal = 0;
    for (const it of items) {
      const p = await getStoredProduct(it.slug);
      if (!p) return NextResponse.json({ error: "A piece in your cart is no longer available." }, { status: 400 });
      subtotal += p.price * Math.max(1, Math.min(9, Number(it.qty) || 1));
    }
    const paymentMode = body.paymentMode === "full" ? "full" : "token";
    const payNow = paymentMode === "full" ? subtotal : tokenAmount(subtotal);

    if (!isRazorpayConfigured()) {
      // demo mode — no gateway; the browser places the order directly
      return NextResponse.json({ configured: false, payNow });
    }

    const rzp = await createRazorpayOrder(payNow, `oaklen-${Date.now()}`);
    return NextResponse.json({
      configured: true,
      keyId: razorpayKeyId(),
      rzpOrderId: rzp.id,
      amount: rzp.amount,
      payNow,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
