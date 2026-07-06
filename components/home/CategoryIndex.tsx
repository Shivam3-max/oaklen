"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Plate from "../Plate";
import { CATEGORIES } from "@/data/products";

const KINDS = ["sofa", "bed", "dining", "pillow"] as const;

export default function CategoryIndex() {
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setActive(null)}
    >
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.id}
          href={`/shop?category=${c.id}`}
          onMouseEnter={() => setActive(i)}
          className="group relative z-[2] flex items-baseline justify-between gap-6 border-t hairline py-9 transition-colors duration-500 last:border-b hover:bg-bone/60 lg:py-12"
        >
          <div className="flex items-baseline gap-6 pl-1 lg:gap-12">
            <span className="label text-brass">{c.index}</span>
            <span className="serif-display text-5xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-4 lg:text-8xl">
              {c.label}
            </span>
          </div>
          <div className="flex items-center gap-8 pr-1">
            <span className="hidden text-sm text-umber md:block">{c.blurb}</span>
            <span className="label hidden text-espresso/50 transition-colors group-hover:text-brass sm:block">
              Explore →
            </span>
          </div>
        </Link>
      ))}
      {active !== null && (
        <div
          className="pointer-events-none absolute z-[3] hidden w-64 -translate-x-1/2 -translate-y-1/2 rotate-2 shadow-[0_30px_60px_rgba(43,33,23,0.18)] lg:block"
          style={{ left: pos.x, top: pos.y }}
        >
          <Plate kind={KINDS[active]} ratio="4/5" toneIndex={active + 1} bare />
        </div>
      )}
    </div>
  );
}
