"use client";

import Link from "next/link";
import { useState } from "react";
import Plate from "../Plate";
import { Product, formatINR } from "@/data/products";

const HOTSPOTS = [
  { slug: "aria-three-seater", x: 32, y: 62 },
  { slug: "pebble-centre-table", x: 55, y: 78 },
  { slug: "meadow-pillow-set", x: 40, y: 52 },
  { slug: "atlas-marble-centre", x: 76, y: 66 },
];

export default function ShoppableRoom({ products }: { products: Product[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="relative">
      <Plate kind="room" ratio="16/8" toneIndex={1} plate={21} label="The Ivory Room" />
      {HOTSPOTS.map((h) => {
        const p = products.find((x) => x.slug === h.slug);
        if (!p) return null;
        const isOpen = open === h.slug;
        return (
          <div key={h.slug} className="absolute z-[3]" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <button
              aria-label={`View ${p.name}`}
              onClick={() => setOpen(isOpen ? null : h.slug)}
              className={`flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ${
                isOpen ? "border-brass bg-brass" : "border-espresso/50 bg-ivory/80 hover:border-brass"
              }`}
            >
              <span className={`block h-1.5 w-1.5 rounded-full ${isOpen ? "bg-ivory" : "bg-espresso"}`} />
            </button>
            {isOpen && (
              <Link
                href={`/product/${p.slug}`}
                className="absolute left-4 top-4 z-[4] block w-52 border hairline bg-ivory p-4 shadow-[0_24px_48px_rgba(43,33,23,0.16)]"
              >
                <p className="font-serif text-lg leading-tight">{p.name}</p>
                <p className="mt-0.5 text-xs text-umber">{p.line}</p>
                <p className="mt-2 flex items-center justify-between text-sm">
                  {formatINR(p.price)}
                  <span className="label text-[9px] text-brass">View →</span>
                </p>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
