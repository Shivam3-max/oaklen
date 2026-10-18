import Link from "next/link";
import type { StoredProject } from "@/lib/store";

// The homepage band of delivered work. Replaces the old "shop the room"
// hotspot block — real finished homes carry more weight than a diagram.
export default function CompletedProjects({ projects }: { projects: StoredProject[] }) {
  if (projects.length === 0) return null;
  return (
    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} data-cursor="view" className="group block">
          <div className="overflow-hidden">
            {p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.cover}
                alt={p.title}
                className="tile-img w-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            ) : (
              <div className="w-full bg-bone" style={{ aspectRatio: "4/3" }} />
            )}
          </div>
          <p className="label mt-6 text-[9px] text-brass">
            {[p.location, p.year].filter(Boolean).join(" · ")}
          </p>
          <p className="section-title mt-3 text-xl leading-snug transition-colors duration-500 group-hover:text-brass">
            {p.title}
          </p>
          {p.summary && <p className="mt-2 text-sm leading-relaxed text-umber">{p.summary}</p>}
        </Link>
      ))}
    </div>
  );
}
