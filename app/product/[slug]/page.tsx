import { notFound } from "next/navigation";
import { getStoredProduct, listProducts } from "@/lib/store";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoredProduct(slug);
  if (!product) notFound();

  const all = await listProducts();
  const related = all.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <div className="pt-24">
      <ProductDetail product={product} />
      <section className="mx-auto max-w-[1500px] border-t hairline px-6 py-24 lg:px-12">
        <Reveal>
          <p className="label mb-10 text-umber">Keeps good company with</p>
        </Reveal>
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard product={p} toneIndex={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
