import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Ambience from "@/components/Ambience";
import { getStoredProject, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getStoredProject(slug);
  if (!p) return { title: "Project" };
  return { title: `${p.title} — Oaklen projects`, description: p.summary || p.story.slice(0, 150) };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getStoredProject(slug), listProjects()]);
  if (!project) notFound();
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <Link href="/projects" className="label text-[10px] text-umber hover:text-brass">← All projects</Link>
          <p className="label rule mt-8 mb-6 text-brass">
            {[project.location, project.year].filter(Boolean).join(" · ") || "Delivered work"}
          </p>
          <h1 className="section-title max-w-4xl text-5xl lg:text-7xl">{project.title}</h1>
          {project.summary && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-umber">{project.summary}</p>
          )}
        </Reveal>
      </section>

      {project.cover && (
        <section className="mx-auto mt-14 max-w-[1500px] px-6 lg:px-12">
          <Reveal variant="img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.cover} alt={project.title} className="w-full object-cover" style={{ aspectRatio: "4/3" }} />
          </Reveal>
        </section>
      )}

      <section className="relative mt-20">
        <Ambience variant="cream" />
        <div className="relative z-[1] mx-auto grid max-w-[1500px] gap-14 px-6 py-20 lg:grid-cols-[1fr_320px] lg:gap-20 lg:px-12 lg:py-28">
          <div>
            {project.story && (
              <Reveal>
                <p className="max-w-2xl text-lg leading-[1.8] text-umber">{project.story}</p>
              </Reveal>
            )}

            {project.images.length > 0 && (
              <Reveal delay={100}>
                {/* Masonry — the photographs come in portrait and landscape, and
                    forcing them to one ratio would crop rooms in half. */}
                <div className="mt-14 gap-5 [column-count:1] sm:[column-count:2]">
                  {project.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`${project.title} — photograph ${i + 2}`}
                      className="mb-5 w-full break-inside-avoid"
                    />
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <Reveal delay={80}>
              <div className="panel p-7">
                {project.scope.length > 0 && (
                  <>
                    <p className="label mb-4 text-[9px] text-umber">What we delivered</p>
                    <ul className="space-y-2 text-sm">
                      {project.scope.map((s) => (
                        <li key={s} className="flex items-baseline gap-3">
                          <span className="h-1 w-1 flex-none rounded-full bg-sage" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-7 border-t hairline pt-6 text-sm leading-relaxed text-umber">
                  Built in our own workshop in Panchkula, then delivered and installed by the same team.
                </p>
                <Link href="/visit" className="btn-solid mt-6 w-full justify-center">Plan yours</Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12 lg:py-28">
          <Reveal>
            <p className="label rule mb-10 text-brass">More delivered work</p>
          </Reveal>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link href={`/projects/${p.slug}`} data-cursor="view" className="group block">
                  <div className="overflow-hidden">
                    {p.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover} alt={p.title} className="tile-img w-full object-cover" style={{ aspectRatio: "4/3" }} />
                    ) : (
                      <div className="w-full bg-bone" style={{ aspectRatio: "4/3" }} />
                    )}
                  </div>
                  <p className="section-title mt-5 text-xl transition-colors duration-500 group-hover:text-brass">{p.title}</p>
                  <p className="label mt-2 text-[9px] text-umber">
                    {[p.location, p.year].filter(Boolean).join(" · ")}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
