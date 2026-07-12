"use client";

import Link from "next/link";
import { useState } from "react";
import Plate from "../Plate";

export default function SplitWorlds({ modernImage, classicImage }: { modernImage?: string; classicImage?: string }) {
  const [side, setSide] = useState<"modern" | "classic" | null>(null);

  const pane = (which: "modern" | "classic") => {
    const isActive = side === which;
    const isMuted = side !== null && !isActive;
    return (
      <Link
        href={`/shop?style=${which}`}
        onMouseEnter={() => setSide(which)}
        onMouseLeave={() => setSide(null)}
        className="relative block overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ flexGrow: isActive ? 1.6 : 1, opacity: isMuted ? 0.55 : 1 }}
      >
        <Plate
          kind={which === "modern" ? "sofa-curved" : "sofa-chester"}
          ratio="auto"
          toneIndex={which === "modern" ? 2 : 4}
          bare
          className="h-full min-h-[380px] lg:min-h-[560px]"
          src={which === "modern" ? modernImage : classicImage}
          alt={which === "modern" ? "Modern furniture" : "Classic furniture"}
        />
        <div className="absolute inset-0 z-[2] flex flex-col items-start justify-end p-8 lg:p-14">
          <p className="label mb-3 text-brass">{which === "modern" ? "The quiet line" : "The long memory"}</p>
          <p className="serif-display text-5xl capitalize lg:text-7xl">{which}</p>
          <p className="mt-4 max-w-xs text-sm text-umber">
            {which === "modern"
              ? "Low profiles, soft geometry, nothing that shouts."
              : "Turned wood, hand-set buttons, silhouettes with a lineage."}
          </p>
          <span className="label mt-6 border-b border-espresso/40 pb-1 transition-colors group-hover:border-brass">
            Enter →
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-1 lg:flex-row">
      {pane("modern")}
      {pane("classic")}
    </div>
  );
}
