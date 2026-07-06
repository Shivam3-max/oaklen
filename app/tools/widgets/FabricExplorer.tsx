"use client";

import { useState } from "react";
import { FABRICS } from "@/data/products";

export default function FabricExplorer() {
  const [active, setActive] = useState(FABRICS[0]);
  const [family, setFamily] = useState<string | null>(null);
  const [ordered, setOrdered] = useState(false);

  const families = Array.from(new Set(FABRICS.map((f) => f.family)));
  const shown = family ? FABRICS.filter((f) => f.family === family) : FABRICS;

  return (
    <div className="border hairline bg-bone/50 p-7">
      <div className="grain relative mb-6 h-36 overflow-hidden" style={{ background: active.tone }}>
        <p className="label absolute bottom-3 left-3 z-[2] text-[9px] text-espresso/60">
          {active.name} · {active.family}
        </p>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setFamily(null)} className={`label text-[9px] ${!family ? "text-brass" : "text-umber"}`}>All</button>
        {families.map((f) => (
          <button key={f} onClick={() => setFamily(f)} className={`label text-[9px] ${family === f ? "text-brass" : "text-umber"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {shown.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f)}
            aria-label={f.name}
            className={`h-9 w-9 rounded-full border-2 transition-transform ${active.id === f.id ? "scale-110 border-brass" : "border-espresso/10 hover:scale-105"}`}
            style={{ background: f.tone }}
          />
        ))}
      </div>
      <button
        onClick={() => { setOrdered(true); setTimeout(() => setOrdered(false), 2200); }}
        className="btn-line mt-7 w-full justify-center !py-3"
      >
        {ordered ? "Kit on its way ✓" : "Order free swatch kit"}
      </button>
    </div>
  );
}
