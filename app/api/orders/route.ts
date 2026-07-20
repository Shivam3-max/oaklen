import { NextRequest, NextResponse } from "next/server";
import { createOrder, ordersByPhone, getStoredProduct } from "@/lib/store";
import { sendOrderConfirmation, sendStaffOrderAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = (body.items ?? []) as { slug: string; qty: number; fabric?: string }[];
    if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // trust server-side prices, not the client payload
    let subtotal = 0;
    const safeItems = [];
    for (const it of items) {
      const p = await getStoredProduct(it.slug);
      if (!p) return NextResponse.json({ error: "A piece in your cart is no longer available." }, { status: 400 });
      const qty = Math.max(1, Math.min(9, Number(it.qty) || 1));
      subtotal += p.price * qty;
      safeItems.push({ slug: p.slug, name: p.name, line: p.line, qty, price: p.price, fabric: it.fabric });
    }

    const c = body.customer ?? {};
    if (!c.name || !c.phone || !c.address || !/^\d{6}$/.test(c.pin ?? "")) {
      return NextResponse.json({ error: "Missing your details" }, { status: 400 });
    }

    const order = await createOrder({
      items: safeItems,
      subtotal,
      note: body.note || undefined,
      customer: { name: c.name, phone: c.phone, email: c.email ?? "", address: c.address, pin: c.pin },
    });

    // fire-and-forget notifications (never block the response on email)
    void Promise.allSettled([sendOrderConfirmation(order), sendStaffOrderAlert(order)]);

    return NextResponse.json({ id: order.id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
  const orders = await ordersByPhone(phone);
  return NextResponse.json({ orders });
}
