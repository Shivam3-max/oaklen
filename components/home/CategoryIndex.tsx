import Link from "next/link";
import Plate from "../Plate";
import { CATEGORIES } from "@/data/products";

const KINDS = ["sofa", "bed", "dining", "pillow"] as const;

// The category band, in the manner of the reference boutiques: four
// photographs in a row, the room name set small and wide beneath each.
// Replaces the old floating-plate type index — same destinations, new vibe.
export default function CategoryIndex({ images = {} }: { images?: Record<string, string | undefined> }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.id}
          href={`/shop?category=${c.id}`}
          data-cursor="view"
          className="group block"
        >
          <div className="overflow-hidden">
            <Plate
              kind={KINDS[i % KINDS.length]}
              ratio="4/5"
              bare
              toneIndex={i + 1}
              src={images[`home-cat-${c.id}`]}
              alt={c.label}
              className="tile-img"
            />
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="label text-[9px] text-brass">{c.index}</span>
            <div>
              <p className="section-title text-2xl transition-colors duration-500 group-hover:text-brass lg:text-[1.75rem]">
                {c.label}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-umber">{c.blurb}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
