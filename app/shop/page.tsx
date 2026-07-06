import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { CATEGORIES, Category, Style } from "@/data/products";
import { listProducts } from "@/lib/store";

export const metadata = { title: "The Collection — Oaklen" };
export const dynamic = "force-dynamic";

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; style?: string }>;
}) {
  const params = await searchParams;
  const category = params.category as Category | undefined;
  const style = params.style as Style | undefined;

  const PRODUCTS = await listProducts();
  const items = PRODUCTS.filter(
    (p) => (!category || p.category === category) && (!style || p.style === style)
  );

  const link = (c?: Category, s?: Style) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (s) q.set("style", s);
    const qs = q.toString();
    return "/shop" + (qs ? `?${qs}` : "");
  };

  const catLabel = category ? CATEGORIES.find((c) => c.id === category)?.label : "Everything";

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-36 lg:px-12">
      <Reveal>
        <p className="label mb-4 text-brass">The Collection</p>
        <h1 className="serif-display text-6xl lg:text-8xl">
          {catLabel}
          {style && <span className="italic text-walnut"> · {style}</span>}
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-y hairline py-5">
          <div className="flex flex-wrap gap-6">
            <Link href={link(undefined, style)} className={`label transition-colors hover:text-brass ${!category ? "text-brass" : "text-espresso/60"}`}>
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={link(c.id, style)} className={`label transition-colors hover:text-brass ${category === c.id ? "text-brass" : "text-espresso/60"}`}>
                {c.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-6">
            {(["modern", "classic"] as Style[]).map((s) => (
              <Link
                key={s}
                href={link(category, style === s ? undefined : s)}
                className={`label transition-colors hover:text-brass ${style === s ? "text-brass" : "text-espresso/60"}`}
              >
                {s}{style === s ? " ✕" : ""}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="label mt-8 text-umber">{items.length} pieces · each made to order</p>

      <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 70}>
            <ProductCard product={p} toneIndex={i} />
          </Reveal>
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-16 font-serif text-2xl text-umber">Nothing in this corner yet — try another room.</p>
      )}
    </div>
  );
}
