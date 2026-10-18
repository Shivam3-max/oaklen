import Link from "next/link";
import Reveal from "@/components/Reveal";
import Ambience from "@/components/Ambience";
import { listProjects } from "@/lib/store";

export const metadata = {
  title: "Projects — homes Oaklen has furnished",
  description:
    "Delivered work from the Oaklen workshop in Panchkula — living rooms, lounges, dining and one order of 108 seats to Chamba.",
};
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label rule mb-6 text-brass">Delivered work</p>
          <h1 className="section-title max-w-4xl text-5xl lg:text-7xl">
            Projects we have
            <br />
            <span className="italic lowercase text-walnut">finished and handed over.</span>
          </h1>
          <p className="mt-7 max-w-xl leading-relaxed text-umber">
            Every piece in these rooms was drawn, built and finished in our own workshop in Panchkula — then
            delivered and installed by the same team.
          </p>
        </Reveal>
      </section>

      <section className="relative mt-20">
        <Ambience variant="cream" />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-20 lg:px-12 lg:py-28">
          {projects.length === 0 ? (
            <p className="text-umber">No projects published yet.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {projects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <Link href={`/projects/${p.slug}`} data-cursor="view" className="group block">
                    <div className="overflow-hidden">
                      {p.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover} alt={p.title} className="tile-img w-full object-cover" style={{ aspectRatio: "4/3" }} />
                      ) : (
                        <div className="w-full bg-bone" style={{ aspectRatio: "4/3" }} />
                      )}
                    </div>
                    <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
                      <p className="section-title text-2xl transition-colors duration-500 group-hover:text-brass">
                        {p.title}
                      </p>
                      <p className="label text-[9px] text-umber">
                        {[p.location, p.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {p.summary && <p className="mt-3 max-w-lg leading-relaxed text-umber">{p.summary}</p>}
                    {p.scope.length > 0 && (
                      <p className="label mt-4 text-[9px] text-brass">{p.scope.join(" · ")}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={120}>
            <div className="mt-24 border-t hairline pt-12 text-center">
              <p className="section-title text-2xl lg:text-3xl">Furnishing a home of your own?</p>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-umber">
                Bring your room sizes. We will walk you through the workshop and quote against your specification.
              </p>
              <Link href="/visit" className="btn-line mt-8">Book a visit</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
