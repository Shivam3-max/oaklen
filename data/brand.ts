// Single source of truth for Oaklen's real-world contact details.
// Update here and it changes across the whole site (footer, visit page,
// checkout, WhatsApp links, structured data, legal pages).

// Accepts "oaklenfurniture.in", "https://oaklenfurniture.in/" etc.; anything
// unparseable falls back to the default so a typo can't crash every page.
function siteUrl(raw?: string): string {
  const fallback = "https://oaklenfurniture.in";
  const v = (raw || "").trim();
  if (!v) return fallback;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).origin;
  } catch {
    return fallback;
  }
}

export const BRAND = {
  name: "Oaklen",
  legalName: "Oaklen Furniture",
  tagline: "Furniture that outlives trends",
  phoneDisplay: "098131 71006",
  phoneDial: "+919813171006",
  whatsapp: "919813171006",
  email: "care@oaklen.in",
  address: {
    line1: "14, Industrial Area Phase 1",
    city: "Panchkula",
    state: "Haryana",
    pin: "134113",
    country: "India",
  },
  hours: "Tue–Sun · 10:30 — 19:30",
  // Fill these in when available:
  gstin: "",
  // Public URL of the live site (SEO, sitemap, canonical links). Set
  // NEXT_PUBLIC_SITE_URL on the host; it is read at build time.
  domain: siteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export const addressLine = `${BRAND.address.line1}, ${BRAND.address.city}, ${BRAND.address.state} ${BRAND.address.pin}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}
