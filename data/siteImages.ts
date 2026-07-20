// Every editable image "slot" across the site. The admin Media tab renders
// one uploader per slot, showing the recommended pixel size. Uploaded images
// are stored (as the site image for that key) and rendered in place of the
// designed placeholder plates. Keep `w`/`h` as the target the admin resizes to.

export interface ImageSlot {
  key: string;
  label: string;
  section: string;
  w: number;
  h: number;
  note?: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  // Home
  { key: "home-hero", label: "Homepage hero", section: "Home", w: 1600, h: 2000, note: "Tall portrait shown on the right of the hero." },
  { key: "home-signature", label: "Signature piece (Aria)", section: "Home", w: 1400, h: 1120, note: "The featured sofa in the ‘Signature’ band." },
  { key: "home-room", label: "Shoppable room", section: "Home", w: 1600, h: 800, note: "Wide room where the four hotspots sit." },
  { key: "home-split-modern", label: "Split — Modern", section: "Home", w: 1200, h: 1500 },
  { key: "home-split-classic", label: "Split — Classic", section: "Home", w: 1200, h: 1500 },

  // Atelier
  { key: "atelier-hero", label: "Atelier — workshop floor", section: "Atelier", w: 1600, h: 700, note: "Wide banner near the top of the Atelier page." },
  { key: "atelier-step-1", label: "Atelier — Selection", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-2", label: "Atelier — Seasoning", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-3", label: "Atelier — Drawing", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-4", label: "Atelier — Joinery", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-5", label: "Atelier — Upholstery", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-6", label: "Atelier — Finishing", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-7", label: "Atelier — The rest", section: "Atelier", w: 800, h: 600 },
  { key: "atelier-step-8", label: "Atelier — Signature", section: "Atelier", w: 800, h: 600 },

  // Lookbook
  { key: "lookbook-hero", label: "Lookbook — The Ivory Room", section: "Lookbook", w: 1600, h: 800 },
  { key: "lookbook-2", label: "Lookbook — A Study in Walnut", section: "Lookbook", w: 1200, h: 900 },
  { key: "lookbook-3", label: "Lookbook — The Long Table", section: "Lookbook", w: 1200, h: 900 },
  { key: "lookbook-4", label: "Lookbook — Sleep, North-Facing", section: "Lookbook", w: 1200, h: 900 },

  // Journal
  { key: "journal-how-to-read-wood-grain", label: "Journal — Reading wood grain", section: "Journal", w: 1200, h: 760 },
  { key: "journal-the-case-for-slow-furniture", label: "Journal — Slow furniture", section: "Journal", w: 1200, h: 760 },
  { key: "journal-caring-for-boucle", label: "Journal — Caring for bouclé", section: "Journal", w: 1200, h: 760 },

  // Visit / Rewards
  { key: "visit-showroom", label: "Visit — showroom", section: "Visit", w: 1200, h: 900 },
  { key: "trade-preview", label: "Rewards — atelier preview", section: "Rewards", w: 1000, h: 1250 },
];

export const PRODUCT_IMAGE_SIZE = { w: 1400, h: 1120, label: "1400 × 1120 px (5:4), JPG or PNG" };

export function slotById(key: string) {
  return IMAGE_SLOTS.find((s) => s.key === key);
}
