"use client";

import Link from "next/link";
import { useState } from "react";
import Plate from "../Plate";

// Two full-height photographic panes that widen on hover. Copy now sits in
// white over a scrim rather than in brown over the plate, so the panes read
// correctly once real photography is dropped in.
export default function SplitWorlds({ modernImage, classicImage }: { modernImage?: string; classicImage?: string }) {
  const [side, setSide] = useState<"modern" | "classic" | null>(null);

  const pane = (which: "modern" | "classic") => {
    const isActive = side === which;
    const isMuted = side !== null && !isActive;
    return (
      <Link
        href={`/shop?style=${which}`}
        data-cursor="view"
        onMouseEnter={() => setSide(which)}
        onMouseLeave={() => setSide(null)}
        className="group relative block overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ flexGrow: isActive ? 1.6 : 1, opacity: isMuted ? 0.7 : 1 }}
      >
        <Plate
          kind={which === "modern" ? "sofa-curved" : "sofa-chester"}
          ratio="auto"
          toneIndex={which === "modern" ? 1 : 4}
          bare
          soft
          className="tile-img h-full min-h-[420px] lg:min-h-[600px]"
          src={which === "modern" ? modernImage : classicImage}
          alt={which === "modern" ? "Modern furniture" : "Classic furniture"}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.34) 48%, rgba(10,10,10,0.10) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[3] flex flex-col items-start justify-end p-8 lg:p-14">
          <p className="label mb-4 text-clay">{which === "modern" ? "The quiet line" : "The long memory"}</p>
          <p className="section-title text-4xl text-white lg:text-6xl">{which}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            {which === "modern"
              ? "Low profiles, soft geometry, nothing that shouts."
              : "Turned wood, hand-set buttons, silhouettes with a lineage."}
          </p>
          <span className="label mt-7 border-b border-white/45 pb-1 text-[10px] text-white transition-colors group-hover:border-clay group-hover:text-clay">
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
