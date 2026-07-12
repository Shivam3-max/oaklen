export type Category = "living" | "sleep" | "dine" | "accents";
export type Style = "modern" | "classic";
export type Silhouette =
  | "sofa" | "sofa-curved" | "sofa-chester" | "sectional" | "armchair"
  | "bed" | "bed-canopy" | "bed-platform"
  | "dining" | "dining-round" | "chair"
  | "centre" | "centre-marble" | "nesting"
  | "pillow" | "throw";

export interface Fabric {
  id: string;
  name: string;
  tone: string;
  family: "Boucle" | "Linen" | "Velvet" | "Leather" | "Cotton";
}

export const FABRICS: Fabric[] = [
  { id: "ecru-boucle", name: "Ecru Bouclé", tone: "#EAE3D4", family: "Boucle" },
  { id: "oat-linen", name: "Oat Linen", tone: "#DCD2BE", family: "Linen" },
  { id: "flax-linen", name: "Flax Linen", tone: "#C9BA9E", family: "Linen" },
  { id: "moss-velvet", name: "Moss Velvet", tone: "#6F7259", family: "Velvet" },
  { id: "umber-velvet", name: "Umber Velvet", tone: "#7A5C43", family: "Velvet" },
  { id: "ink-velvet", name: "Ink Velvet", tone: "#3A3E45", family: "Velvet" },
  { id: "tan-leather", name: "Saddle Leather", tone: "#9A6B42", family: "Leather" },
  { id: "espresso-leather", name: "Espresso Leather", tone: "#4A3626", family: "Leather" },
  { id: "chalk-cotton", name: "Chalk Cotton", tone: "#F0EBE0", family: "Cotton" },
  { id: "terracotta-cotton", name: "Terracotta Cotton", tone: "#B5714F", family: "Cotton" },
];

export interface Product {
  slug: string;
  name: string;
  line: string;
  category: Category;
  type: string;
  style: Style;
  silhouette: Silhouette;
  price: number;
  dims: string;
  wood: string;
  fabrics: string[];
  leadDays: number;
  story: string;
  plate: number;
  signature?: boolean;
  image?: string | null;
}

export const PRODUCTS: Product[] = [
  { slug: "aria-three-seater", name: "Aria", line: "Three-Seater Sofa", category: "living", type: "Sofa", style: "modern", silhouette: "sofa", price: 168000, dims: "220 × 95 × 78 cm", wood: "Kiln-dried teak frame", fabrics: ["ecru-boucle", "oat-linen", "moss-velvet", "ink-velvet"], leadDays: 21, story: "Low, long and quiet. The Aria carries its weight on a shadow-gap plinth so the whole piece appears to hover an inch above the floor.", plate: 1, signature: true },
  { slug: "ondas-curved-sofa", name: "Ondas", line: "Curved Sofa", category: "living", type: "Sofa", style: "modern", silhouette: "sofa-curved", price: 214000, dims: "248 × 102 × 74 cm", wood: "Steam-bent beech frame", fabrics: ["ecru-boucle", "chalk-cotton", "umber-velvet"], leadDays: 28, story: "A single unbroken curve, upholstered in one continuous run of bouclé. No seams face the room.", plate: 2 },
  { slug: "bramble-chesterfield", name: "Bramble", line: "Chesterfield Sofa", category: "living", type: "Sofa", style: "classic", silhouette: "sofa-chester", price: 242000, dims: "228 × 98 × 82 cm", wood: "Seasoned sheesham frame", fabrics: ["tan-leather", "espresso-leather", "moss-velvet"], leadDays: 35, story: "Four hundred and six hand-set buttons. Our master upholsterer signs the underside of every Bramble.", plate: 3 },
  { slug: "meridian-sectional", name: "Meridian", line: "L-Sectional", category: "living", type: "Sofa", style: "modern", silhouette: "sectional", price: 296000, dims: "320 × 240 × 72 cm", wood: "Engineered hardwood core", fabrics: ["oat-linen", "ecru-boucle", "ink-velvet"], leadDays: 30, story: "Built in modules that bolt blind from beneath — the Meridian moves house as easily as a bookshelf.", plate: 4 },
  { slug: "cove-armchair", name: "Cove", line: "Armchair", category: "living", type: "Armchair", style: "modern", silhouette: "armchair", price: 78000, dims: "88 × 84 × 76 cm", wood: "Solid oak legs", fabrics: ["ecru-boucle", "moss-velvet", "terracotta-cotton"], leadDays: 18, story: "A reading chair first. The seat rakes back seven degrees — the angle at which a book rests without being held.", plate: 5 },
  { slug: "nocturne-bed", name: "Nocturne", line: "Upholstered Bed", category: "sleep", type: "Bed", style: "modern", silhouette: "bed", price: 186000, dims: "King · 193 × 203 cm", wood: "Solid teak base", fabrics: ["oat-linen", "chalk-cotton", "ink-velvet"], leadDays: 24, story: "The headboard leans back like a deck chair. Designed for the hour of reading before the light goes out.", plate: 6, signature: true },
  { slug: "haven-canopy-bed", name: "Haven", line: "Canopy Bed", category: "sleep", type: "Bed", style: "classic", silhouette: "bed-canopy", price: 258000, dims: "King · 193 × 203 × 210 cm", wood: "Hand-turned sheesham posts", fabrics: ["chalk-cotton", "oat-linen"], leadDays: 40, story: "Four posts turned on a lathe that has run in the same family for three generations.", plate: 7 },
  { slug: "aster-platform-bed", name: "Aster", line: "Platform Bed", category: "sleep", type: "Bed", style: "modern", silhouette: "bed-platform", price: 148000, dims: "Queen · 168 × 203 cm", wood: "Solid oak, oiled finish", fabrics: [], leadDays: 21, story: "No headboard, no hardware in sight. Twelve interlocking joints and a floating slat deck.", plate: 8 },
  { slug: "longford-dining-table", name: "Longford", line: "Dining Table · Seats 8", category: "dine", type: "Dining Table", style: "classic", silhouette: "dining", price: 224000, dims: "240 × 100 × 76 cm", wood: "Single-slab mango top", fabrics: [], leadDays: 32, story: "Cut from one slab, so the grain runs unbroken from head to foot. No two Longfords are alike.", plate: 9, signature: true },
  { slug: "kiln-dining-table", name: "Kiln", line: "Dining Table · Seats 6", category: "dine", type: "Dining Table", style: "modern", silhouette: "dining-round", price: 162000, dims: "Ø 150 × 76 cm", wood: "Charred-oak pedestal", fabrics: [], leadDays: 26, story: "The pedestal is scorched, brushed and waxed — an old Japanese trick that seals the wood for a century.", plate: 10 },
  { slug: "bentwood-chair", name: "Bentwood", line: "Dining Chair · Set of 2", category: "dine", type: "Chair", style: "modern", silhouette: "chair", price: 46000, dims: "46 × 52 × 81 cm", wood: "Steam-bent ash", fabrics: ["oat-linen", "tan-leather"], leadDays: 14, story: "Eleven minutes of steam, one motion of the press. The back is a single piece of ash, bent, never cut.", plate: 11 },
  { slug: "pebble-centre-table", name: "Pebble", line: "Centre Table", category: "living", type: "Centre Table", style: "modern", silhouette: "centre", price: 64000, dims: "110 × 70 × 34 cm", wood: "Sculpted mango, soap finish", fabrics: [], leadDays: 16, story: "Carved soft on every edge, finished with soap flakes the Danish way. It ages the colour of sand.", plate: 12 },
  { slug: "atlas-marble-centre", name: "Atlas", line: "Marble Centre Table", category: "living", type: "Centre Table", style: "classic", silhouette: "centre-marble", price: 96000, dims: "120 × 75 × 36 cm", wood: "Banswara marble · brass base", fabrics: [], leadDays: 22, story: "A slab of Banswara white on a burnished brass cradle. The veining decides which side faces the sofa.", plate: 13 },
  { slug: "drift-nesting-tables", name: "Drift", line: "Nesting Tables · Set of 3", category: "living", type: "Centre Table", style: "modern", silhouette: "nesting", price: 52000, dims: "60 / 48 / 36 cm Ø", wood: "Walnut-stained oak", fabrics: [], leadDays: 14, story: "Three heights, one grain story. They tuck away to the footprint of a single side table.", plate: 14 },
  { slug: "meadow-pillow-set", name: "Meadow", line: "Pillow Set of 4", category: "accents", type: "Pillows", style: "modern", silhouette: "pillow", price: 12800, dims: "45 × 45 cm × 4", wood: "Feather-down fill", fabrics: ["chalk-cotton", "flax-linen", "terracotta-cotton"], leadDays: 7, story: "Four tones of the same field — chalk, oat, flax, terracotta. Made to be mixed, never matched.", plate: 15 },
  { slug: "raw-silk-lumbar", name: "Raw Silk", line: "Lumbar Pillow", category: "accents", type: "Pillows", style: "classic", silhouette: "pillow", price: 6400, dims: "35 × 60 cm", wood: "Feather-down fill", fabrics: ["flax-linen"], leadDays: 7, story: "Handloom raw silk with a visible slub — the thread's imperfection is the entire point.", plate: 16 },
  { slug: "boucle-throw", name: "Cirrus", line: "Bouclé Throw", category: "accents", type: "Throw", style: "modern", silhouette: "throw", price: 9200, dims: "130 × 180 cm", wood: "Wool-cotton loop yarn", fabrics: ["ecru-boucle"], leadDays: 7, story: "Loomed loosely enough to drape, densely enough to warm. Finished with a hand-rolled hem.", plate: 17 },
  { slug: "orchard-dining-set", name: "Orchard", line: "Dining Set · Table + 6 Chairs", category: "dine", type: "Dining Set", style: "classic", silhouette: "dining", price: 342000, dims: "220 × 100 × 76 cm", wood: "Seasoned teak throughout", fabrics: ["oat-linen", "tan-leather"], leadDays: 45, story: "The full table. Six chairs and a table built from the same tree wherever the yard allows it.", plate: 18 },
];

export const CATEGORIES: { id: Category; label: string; index: string; blurb: string }[] = [
  { id: "living", label: "Living", index: "01", blurb: "Sofas, armchairs & centre tables" },
  { id: "sleep", label: "Sleep", index: "02", blurb: "Beds built for the slow hours" },
  { id: "dine", label: "Dine", index: "03", blurb: "Tables that hold the household" },
  { id: "accents", label: "Accents", index: "04", blurb: "Pillows, throws & finishing notes" },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function fabricById(id: string) {
  return FABRICS.find((f) => f.id === id);
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function tokenAmount(total: number) {
  return Math.round((total * 0.15) / 100) * 100;
}
