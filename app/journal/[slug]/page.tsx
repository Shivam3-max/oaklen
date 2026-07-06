import Link from "next/link";
import { notFound } from "next/navigation";
import Plate from "@/components/Plate";
import Reveal from "@/components/Reveal";
import { ARTICLES } from "@/data/journal";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();
  const others = ARTICLES.filter((a) => a.slug !== slug);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-36 lg:px-0">
      <Reveal>
        <p className="label mb-4 text-brass">{article.tag} · {article.date}</p>
        <h1 className="serif-display text-5xl lg:text-7xl">{article.title}</h1>
        <p className="mt-6 font-serif text-xl italic text-umber">{article.dek}</p>
      </Reveal>
      <Reveal delay={120}>
        <div className="my-12">
          <Plate kind="detail" ratio="16/8" toneIndex={2} bare />
        </div>
      </Reveal>
      <div className="space-y-7 leading-[1.85] text-espresso/85">
        {article.body.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85]" : ""}>{p}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-16 border-t hairline pt-10">
        <p className="label mb-6 text-umber">Keep reading</p>
        {others.map((o) => (
          <Link key={o.slug} href={`/journal/${o.slug}`} className="group block border-b hairline py-4">
            <span className="font-serif text-2xl transition-colors group-hover:text-brass">{o.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
