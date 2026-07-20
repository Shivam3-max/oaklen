import Link from "next/link";
import Plate from "./Plate";
import { Product, formatINR } from "@/data/products";

export default function ProductCard({ product, toneIndex = 0 }: { product: Product; toneIndex?: number }) {
  return (
    <Link href={`/product/${product.slug}`} data-cursor="view" className="group block">
      <div className="overflow-hidden">
        <div className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]">
          <Plate kind={product.silhouette} label={product.name} plate={product.plate} toneIndex={toneIndex} src={product.images?.[0]} alt={`${product.name} — ${product.line}`} />
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-serif text-xl leading-tight">
            {product.name}
            <span className="ml-2 text-sm italic text-umber">{product.style}</span>
          </p>
          <p className="mt-1 text-[13px] text-umber">{product.line}</p>
        </div>
        <p className="whitespace-nowrap text-sm">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
}
