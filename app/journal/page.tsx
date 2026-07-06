import Link from "next/link";
import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import { ARTICLES } from "@/data/journal";

export const metadata = { title: "The Journal — Oaklen" };

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-36 lg:px-12">
      <Reveal>
        <p className="label mb-4 text-brass">The Journal</p>
        <h1 className="serif-display max-w-3xl text-6xl lg:text-8xl">
          Notes from <span className="italic text-walnut">the bench.</span>
        </h1>
      </Reveal>

      <div className="mt-16 space-y-0">
        {ARTICLES.map((a, i) => (
          <Reveal key={a.slug} delay={i * 80}>
            <Link
              href={`/journal/${a.slug}`}
              className="group grid gap-8 border-t hairline py-12 last:border-b md:grid-cols-[220px_1fr_auto] md:items-center"
            >
              <div className="w-full max-w-[220px]">
                <Plate kind={i === 0 ? "detail" : i === 1 ? "sofa" : "throw"} ratio="4/3" toneIndex={i + 1} bare />
              </div>
              <div>
                <p className="label mb-3 text-brass">{a.tag} · {a.date}</p>
                <p className="serif-display text-4xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2">
                  {a.title}
                </p>
                <p className="mt-3 max-w-xl text-sm text-umber">{a.dek}</p>
              </div>
              <span className="label hidden text-espresso/40 transition-colors group-hover:text-brass md:block">Read →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
