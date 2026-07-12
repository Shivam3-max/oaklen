import { NextRequest, NextResponse } from "next/server";
import {
  listOrders, listPartners, setOrderStatus, setReferralStatus,
  listProducts, createProduct, updateProduct, deleteProduct,
  listEnquiries, setEnquiryStatus, listSubscribers,
  getSiteImages, setSiteImage, clearSiteImage,
  getOrder, setOrderPayment,
} from "@/lib/store";
import { isRazorpayConfigured, refundPayment } from "@/lib/razorpay";

// generous ceiling for a client-resized data URL (~a few hundred KB of base64)
const MAX_IMAGE_CHARS = 3_000_000;

const ADMIN_KEY = process.env.OAKLEN_ADMIN_KEY ?? "oaklen2026";

function authorized(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  const [orders, partners, products, enquiries, subscribers, siteImages] = await Promise.all([
    listOrders(), listPartners(), listProducts(true), listEnquiries(), listSubscribers(), getSiteImages(),
  ]);
  return NextResponse.json({ orders, partners, products, enquiries, subscribers, siteImages, demoMode: !process.env.DATABASE_URL });
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
      if (p.image && String(p.image).length > MAX_IMAGE_CHARS) {
        return NextResponse.json({ error: "Product image too large — try a smaller file." }, { status: 400 });
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
        image: p.image || null,
      });
      return NextResponse.json({ product });
    }
    case "product-update": {
      const patch = body.patch ?? {};
      if (patch.price !== undefined) patch.price = Math.max(1000, Math.round(Number(patch.price)));
      if (patch.leadDays !== undefined) patch.leadDays = Math.max(3, Math.round(Number(patch.leadDays)));
      if (patch.image && String(patch.image).length > MAX_IMAGE_CHARS) {
        return NextResponse.json({ error: "Product image too large — try a smaller file." }, { status: 400 });
      }
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
    case "order-refund": {
      const order = await getOrder(body.id);
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      if (order.paymentStatus !== "paid") {
        // demo / unpaid order — just mark it refunded in our records
        await setOrderPayment(body.id, "refunded");
        return NextResponse.json({ ok: true, note: "Marked refunded (no live payment to reverse)." });
      }
      try {
        if (isRazorpayConfigured() && order.paymentId) {
          await refundPayment(order.paymentId, order.paidNow);
        }
        await setOrderPayment(body.id, "refunded");
        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
      }
    }
    case "site-image-set": {
      const url = String(body.url ?? "");
      if (!body.key || !url) return NextResponse.json({ error: "Missing key or image." }, { status: 400 });
      if (url.length > MAX_IMAGE_CHARS) return NextResponse.json({ error: "Image too large — try a smaller file." }, { status: 400 });
      await setSiteImage(body.key, url);
      return NextResponse.json({ ok: true });
    }
    case "site-image-clear": {
      if (!body.key) return NextResponse.json({ error: "Missing key." }, { status: 400 });
      await clearSiteImage(body.key);
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
