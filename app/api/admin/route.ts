import { NextRequest, NextResponse } from "next/server";
import {
  listOrders, listPartners, setOrderStatus, setReferralStatus,
  listProducts, createProduct, updateProduct, deleteProduct,
  listEnquiries, setEnquiryStatus, listSubscribers,
} from "@/lib/store";

const ADMIN_KEY = process.env.OAKLEN_ADMIN_KEY ?? "oaklen2026";

function authorized(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  const [orders, partners, products, enquiries, subscribers] = await Promise.all([
    listOrders(), listPartners(), listProducts(true), listEnquiries(), listSubscribers(),
  ]);
  return NextResponse.json({ orders, partners, products, enquiries, subscribers });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  const body = await req.json();

  switch (body.action) {
    case "order-status": {
      const order = await setOrderStatus(body.id, body.status);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
    case "referral-status": {
      const ref = await setReferralStatus(body.code, body.orderId, body.status);
      if (!ref) return NextResponse.json({ error: "Referral not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
    case "product-create": {
      const p = body.product ?? {};
      if (!p.name || !p.line || !p.price || !p.category) {
        return NextResponse.json({ error: "Name, line, category and price are required." }, { status: 400 });
      }
      const product = await createProduct({
        name: p.name, line: p.line, category: p.category, type: p.type || p.line,
        style: p.style === "classic" ? "classic" : "modern",
        silhouette: p.silhouette || "sofa",
        price: Math.max(1000, Math.round(Number(p.price))),
        dims: p.dims || "—", wood: p.wood || "Solid wood",
        fabrics: Array.isArray(p.fabrics) ? p.fabrics : [],
        leadDays: Math.max(3, Math.round(Number(p.leadDays) || 21)),
        story: p.story || "",
        signature: false,
      });
      return NextResponse.json({ product });
    }
    case "product-update": {
      const patch = body.patch ?? {};
      if (patch.price !== undefined) patch.price = Math.max(1000, Math.round(Number(patch.price)));
      if (patch.leadDays !== undefined) patch.leadDays = Math.max(3, Math.round(Number(patch.leadDays)));
      const product = await updateProduct(body.slug, patch);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json({ product });
    }
    case "product-delete": {
      const ok = await deleteProduct(body.slug);
      if (!ok) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
    case "enquiry-status": {
      const e = await setEnquiryStatus(body.id, body.status);
      if (!e) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
