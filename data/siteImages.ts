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
  { key: "home-hero", label: "Homepage hero", section: "Home", w: 2400, h: 1600, note: "Full-bleed behind the hero statement. Mid-tone — white type sits over it. On phones only the centre ~30% of the width is visible, so keep the subject centred." },
  { key: "home-hero-2", label: "Homepage hero — second banner", section: "Home", w: 2400, h: 1600, note: "The hero cycles two photographs. Same rules as the first, and it is reused blurred behind the category band." },
  { key: "home-signature", label: "Signature piece (Aria)", section: "Home", w: 1200, h: 1500, note: "Portrait, left of the ‘design philosophy’ copy. Also reused blurred as that band’s background." },
  { key: "home-room", label: "Shoppable room", section: "Home", w: 2000, h: 1000, note: "Wide room where the four shoppable hotspots sit. Leave the pieces clearly separated." },
  { key: "home-split-modern", label: "Split — Modern", section: "Home", w: 1200, h: 1500, note: "Tall pane. Title and copy sit bottom-left over a dark scrim — keep that corner calm." },
  { key: "home-split-classic", label: "Split — Classic", section: "Home", w: 1200, h: 1500, note: "Tall pane. Title and copy sit bottom-left over a dark scrim — keep that corner calm." },
  { key: "home-cat-living", label: "Category — Living", section: "Home", w: 1200, h: 1500, note: "Tile in the category band under the hero." },
  { key: "home-cat-sleep", label: "Category — Sleep", section: "Home", w: 1200, h: 1500 },
  { key: "home-cat-dine", label: "Category — Dine", section: "Home", w: 1200, h: 1500 },
  { key: "home-cat-accents", label: "Category — Accents", section: "Home", w: 1200, h: 1500 },

  // Atelier
  { key: "atelier-hero", label: "Atelier — workshop floor", section: "Atelier", w: 2000, h: 875, note: "Wide banner on the Atelier page. Also reused blurred behind the dark atelier band on the homepage, so it must read at low contrast." },
  { key: "atelier-step-1", label: "Atelier — Selection", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-2", label: "Atelier — Seasoning", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-3", label: "Atelier — Drawing", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-4", label: "Atelier — Joinery", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-5", label: "Atelier — Upholstery", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-6", label: "Atelier — Finishing", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-7", label: "Atelier — The rest", section: "Atelier", w: 1200, h: 900 },
  { key: "atelier-step-8", label: "Atelier — Signature", section: "Atelier", w: 1200, h: 900 },

  // Lookbook
  { key: "lookbook-hero", label: "Lookbook — The Ivory Room", section: "Lookbook", w: 2000, h: 1000, note: "Shoppable room with four hotspots." },
  { key: "lookbook-2", label: "Lookbook — A Study in Walnut", section: "Lookbook", w: 1200, h: 900 },
  { key: "lookbook-3", label: "Lookbook — The Long Table", section: "Lookbook", w: 1200, h: 900 },
  { key: "lookbook-4", label: "Lookbook — Sleep, North-Facing", section: "Lookbook", w: 1200, h: 900 },

  // Journal
  { key: "journal-how-to-read-wood-grain", label: "Journal — Reading wood grain", section: "Journal", w: 1800, h: 1200 },
  { key: "journal-the-case-for-slow-furniture", label: "Journal — Slow furniture", section: "Journal", w: 1800, h: 1200 },
  { key: "journal-caring-for-boucle", label: "Journal — Caring for bouclé", section: "Journal", w: 1800, h: 1200 },

  // Visit / Rewards
  { key: "visit-showroom", label: "Visit — showroom", section: "Visit", w: 1200, h: 900 },
  { key: "trade-preview", label: "Rewards — atelier preview", section: "Rewards", w: 1200, h: 1500, note: "Portrait. Atelier or showroom scene beside the rewards form." },
];

export const PRODUCT_IMAGE_SIZE = { w: 1400, h: 1120, label: "1400 × 1120 px (5:4 landscape), JPG or PNG" };

export function slotById(key: string) {
  return IMAGE_SLOTS.find((s) => s.key === key);
}
