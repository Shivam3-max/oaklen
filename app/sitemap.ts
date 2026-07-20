import type { MetadataRoute } from "next";
import { BRAND } from "@/data/brand";
import { listProducts } from "@/lib/store";
import { ARTICLES } from "@/data/journal";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.domain;
  const staticPaths = [
    "", "/shop", "/atelier", "/lookbook", "/tools", "/rewards", "/journal", "/visit",
    "/policies/privacy", "/policies/terms", "/policies/shipping", "/policies/refunds",
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  try {
    const products = await listProducts();
    for (const p of products) {
      entries.push({ url: `${base}/product/${p.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    }
  } catch {
    /* db not connected during build — static paths still ship */
  }

  for (const a of ARTICLES) {
    entries.push({ url: `${base}/journal/${a.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
  }

  return entries;
}
