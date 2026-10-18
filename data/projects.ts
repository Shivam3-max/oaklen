// Delivered projects — the homes and spaces Oaklen has furnished.
//
// Everything here is editable from the admin Projects tab; this file is only
// the starting set, taken from the 2026 company deck. Titles and stories for
// the three homes are deliberately plain because the deck only labelled them
// "Project 01/02/03" — fill in the real client story from the admin when you
// have it. The Chamba job is described exactly as the deck states it.

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: string;
  summary: string;      // one line, shown on the card
  story: string;        // the longer description on the project page
  scope: string[];      // rooms / pieces delivered
  cover: string;        // 1600 × 1200, 4:3
  images: string[];     // gallery, any shape — laid out masonry-style
  featured: boolean;    // shows in the homepage band
}

export const PROJECTS: Project[] = [
  {
    slug: "project-01",
    title: "Living, lounge and dining",
    location: "Panchkula",
    year: "2025",
    summary: "One family, one order — the whole ground floor.",
    story:
      "A complete ground floor delivered together: a tufted three-seater and accent chairs for the living room, a marble-topped dining table seating six, and the lounge seating between them. Ordering the rooms as one let us hold the same fabric family and the same polish across every piece.",
    scope: ["Living room", "Lounge", "Dining"],
    cover: "/photos/projects/project-01-cover.jpg",
    images: ["/photos/projects/project-01-2.jpg", "/photos/projects/project-01-3.jpg"],
    featured: true,
  },
  {
    slug: "project-02",
    title: "A living room in cream",
    location: "Panchkula",
    year: "2025",
    summary: "Fluted panelling, and seating cut to the wall.",
    story:
      "A three-plus-two in cream, built to sit against a fluted feature wall without crowding it. The room was measured first and the sofa drawn to the space rather than the other way round.",
    scope: ["Living room"],
    cover: "/photos/projects/project-02-cover.jpg",
    images: [],
    featured: true,
  },
  {
    slug: "project-03",
    title: "A lounge under the chandelier",
    location: "Panchkula",
    year: "2025",
    summary: "Sectional, swivel chairs and the television wall.",
    story:
      "A large lounge furnished end to end — a long sectional, a pair of swivel chairs, centre tables and the joinery around the television. Every piece was finished in the same tone so the room reads as one.",
    scope: ["Lounge", "Television wall", "Centre tables"],
    cover: "/photos/projects/project-03-cover.jpg",
    images: [
      "/photos/projects/project-03-2.jpg",
      "/photos/projects/project-03-3.jpg",
      "/photos/projects/project-03-4.jpg",
    ],
    featured: true,
  },
  {
    slug: "chamba-banquet",
    title: "108 seats to Chamba",
    location: "Chamba, Himachal Pradesh",
    year: "2025",
    summary: "Our biggest single order — made in Panchkula, delivered to the hills.",
    story:
      "One hundred and eight seats built in the Panchkula workshop and delivered to Chamba, Himachal Pradesh. The largest single order we have taken: one specification, one finish, built and checked as a batch, then transported and installed together.",
    scope: ["108 seats", "Batch production", "Transport & install"],
    cover: "/photos/projects/chamba-banquet-cover.jpg",
    images: ["/photos/projects/chamba-banquet-2.jpg"],
    featured: true,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
