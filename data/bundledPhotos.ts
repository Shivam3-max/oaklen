// Photography that ships with the repo, in `public/photos`.
//
// These are the baseline: the site shows them with no database attached, and
// they deploy with the code. Anything uploaded through the admin Media tab is
// stored in the database and takes precedence over the file of the same key,
// so a bundled photo is a default, never a lock.
//
// To add one: drop `<key>.jpg` in public/photos and add the key here.

export const BUNDLED_SITE_PHOTOS: Record<string, string> = {
  "home-hero": "/photos/home-hero.jpg",
  "home-hero-2": "/photos/home-hero-2.jpg",
  "home-signature": "/photos/home-signature.jpg",
  "home-room": "/photos/home-room.jpg",
  "home-split-modern": "/photos/home-split-modern.jpg",
  "home-split-classic": "/photos/home-split-classic.jpg",
  "home-cat-living": "/photos/home-cat-living.jpg",
  "home-cat-sleep": "/photos/home-cat-sleep.jpg",
  "home-cat-dine": "/photos/home-cat-dine.jpg",
  "home-cat-accents": "/photos/home-cat-accents.jpg",

  "atelier-hero": "/photos/atelier-hero.jpg",
  "atelier-step-1": "/photos/atelier-step-1.jpg",
  "atelier-step-2": "/photos/atelier-step-2.jpg",
  "atelier-step-3": "/photos/atelier-step-3.jpg",
  "atelier-step-4": "/photos/atelier-step-4.jpg",
  "atelier-step-5": "/photos/atelier-step-5.jpg",
  "atelier-step-8": "/photos/atelier-step-8.jpg",

  "journal-how-to-read-wood-grain": "/photos/journal-how-to-read-wood-grain.jpg",
  "journal-the-case-for-slow-furniture": "/photos/journal-the-case-for-slow-furniture.jpg",
  "journal-caring-for-boucle": "/photos/journal-caring-for-boucle.jpg",

  "visit-showroom": "/photos/visit-showroom.jpg",
  "trade-preview": "/photos/trade-preview.jpg",
};

// Keyed by product slug — used only when a product carries no images of its own.
export const BUNDLED_PRODUCT_PHOTOS: Record<string, string> = {
  "aria-three-seater": "/photos/aria-three-seater.jpg",
  "ondas-curved-sofa": "/photos/ondas-curved-sofa.jpg",
  "bramble-chesterfield": "/photos/bramble-chesterfield.jpg",
  "meridian-sectional": "/photos/meridian-sectional.jpg",
  "cove-armchair": "/photos/cove-armchair.jpg",
  "nocturne-bed": "/photos/nocturne-bed.jpg",
  "haven-canopy-bed": "/photos/haven-canopy-bed.jpg",
  "aster-platform-bed": "/photos/aster-platform-bed.jpg",
};
