import type { MetadataRoute } from "next";
import { BRAND } from "@/data/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/checkout", "/cart", "/account"],
    },
    sitemap: `${BRAND.domain}/sitemap.xml`,
  };
}
