import { NextRequest, NextResponse } from "next/server";
import {
  listOrders, setOrderStatus,
  listProducts, createProduct, updateProduct, deleteProduct,
  listEnquiries, setEnquiryStatus, listSubscribers,
  getSiteImages, setSiteImage, clearSiteImage,
  databaseConnected,
} from "@/lib/store";
import { MAX_PRODUCT_IMAGES } from "@/data/products";

const ADMIN_KEY = process.env.OAKLEN_ADMIN_KEY ?? "oaklen2026";

// generous ceiling for one client-resized data URL (~a few hundred KB of base64)
const MAX_IMAGE_CHARS = 3_000_000;

function authorized(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

function imagesTooLarge(images: unknown): boolean {
  if (!Array.isArray(images)) return false;
  return images.some((i) => typeof i === "string" && i.length > MAX_IMAGE_CHARS);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  const [orders, products, enquiries, subscribers, siteImages] = await Promise.all([
    listOrders(), listProducts(true), listEnquiries(), listSubscribers(), getSiteImages(),
  ]);
  return NextResponse.json({ orders, products, enquiries, subscribers, siteImages, dbConnected: databaseConnected });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  const body = await req.json();

  switch (body.action) {
    case "order-status": {
      const order = await setOrderStatus(body.id, body.status);
      if (!order) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
    case "product-create": {
      const p = body.product ?? {};
      if (!p.name || !p.line || !p.price || !p.category) {
        return NextResponse.json({ error: "Name, line, category and price are required." }, { status: 400 });
      }
      if (imagesTooLarge(p.images)) {
        return NextResponse.json({ error: "A product image is too large — try a smaller file." }, { status: 400 });
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
        images: Array.isArray(p.images) ? p.images.slice(0, MAX_PRODUCT_IMAGES) : [],
      });
      return NextResponse.json({ product });
    }
    case "product-update": {
      const patch = body.patch ?? {};
      if (patch.price !== undefined) patch.price = Math.max(1000, Math.round(Number(patch.price)));
      if (patch.leadDays !== undefined) patch.leadDays = Math.max(3, Math.round(Number(patch.leadDays)));
      if (imagesTooLarge(patch.images)) {
        return NextResponse.json({ error: "A product image is too large — try a smaller file." }, { status: 400 });
      }
      if (Array.isArray(patch.images)) patch.images = patch.images.slice(0, MAX_PRODUCT_IMAGES);
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
