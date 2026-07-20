"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Plate from "@/components/Plate";
import { useCart } from "@/components/CartContext";
import { FABRICS, formatINR } from "@/data/products";

const SILHOUETTES = [
  { id: "sofa", label: "Aria — straight", base: 168000, slug: "aria-three-seater" },
  { id: "sofa-curved", label: "Ondas — curved", base: 214000, slug: "ondas-curved-sofa" },
  { id: "sofa-chester", label: "Bramble — chesterfield", base: 242000, slug: "bramble-chesterfield" },
  { id: "sectional", label: "Meridian — L-shape", base: 296000, slug: "meridian-sectional" },
] as const;

const SIZES = [
  { id: "two", label: "Two-seater", mult: 0.82 },
  { id: "three", label: "Three-seater", mult: 1 },
  { id: "grand", label: "Grand four", mult: 1.24 },
];

const LEGS = [
  { id: "shadow", label: "Shadow plinth", add: 0 },
  { id: "oak", label: "Turned oak", add: 6000 },
  { id: "brass", label: "Burnished brass", add: 14000 },
];

const FABRIC_ADD: Record<string, number> = { Boucle: 12000, Linen: 6000, Velvet: 16000, Leather: 38000, Cotton: 0 };

export default function Configurator() {
  const { add } = useCart();
  const router = useRouter();
  const [sil, setSil] = useState(0);
  const [size, setSize] = useState(1);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [legs, setLegs] = useState(0);

  const price = useMemo(() => {
    const base = SILHOUETTES[sil].base * SIZES[size].mult + FABRIC_ADD[fabric.family] + LEGS[legs].add;
    return Math.round(base / 500) * 500;
  }, [sil, size, fabric, legs]);

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">Tool 01 — The bench</p>
      <h1 className="serif-display text-6xl lg:text-7xl">Build your sofa.</h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <Plate kind={SILHOUETTES[sil].id} ratio="5/4" bare toneIndex={2} />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 transition-colors duration-500"
              style={{ background: `linear-gradient(to top, ${fabric.tone}, transparent)` }}
            />
            <p className="label absolute bottom-4 left-4 z-[2] text-[10px] text-umber">
              {SILHOUETTES[sil].label} · {SIZES[size].label} · {fabric.name} · {LEGS[legs].label}
            </p>
          </div>
          <p className="mt-4 text-xs text-umber">
            Line drawing for now — your configuration is photographed at the atelier once photography lands.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <p className="label mb-4 text-umber">01 — Silhouette</p>
            <div className="grid grid-cols-2 gap-3">
              {SILHOUETTES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSil(i)}
                  className={`border p-4 text-left text-sm transition-all ${i === sil ? "border-brass bg-bone/70" : "hairline hover:border-espresso/40"}`}
                >
                  {s.label}
                  <span className="mt-1 block text-xs text-umber">from {formatINR(s.base)}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="label mb-4 text-umber">02 — Size</p>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSize(i)}
                  className={`border px-5 py-3 text-xs tracking-wide transition-all ${i === size ? "border-brass bg-bone/70" : "hairline hover:border-espresso/40"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="label mb-4 text-umber">03 — Fabric — <span className="text-espresso">{fabric.name}</span></p>
            <div className="flex flex-wrap gap-3">
              {FABRICS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFabric(f)}
                  aria-label={f.name}
                  className={`h-11 w-11 rounded-full border-2 transition-all ${fabric.id === f.id ? "scale-110 border-brass" : "border-transparent hover:border-espresso/30"}`}
                  style={{ background: f.tone }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-umber">{fabric.family} {FABRIC_ADD[fabric.family] > 0 ? `adds ${formatINR(FABRIC_ADD[fabric.family])}` : "at no extra cost"}</p>
          </section>

          <section>
            <p className="label mb-4 text-umber">04 — Legs</p>
            <div className="flex flex-wrap gap-3">
              {LEGS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setLegs(i)}
                  className={`border px-5 py-3 text-xs tracking-wide transition-all ${i === legs ? "border-brass bg-bone/70" : "hairline hover:border-espresso/40"}`}
                >
                  {l.label}{l.add > 0 ? ` +${formatINR(l.add)}` : ""}
                </button>
              ))}
            </div>
          </section>

          <div className="border hairline bg-bone/60 p-7">
            <div className="flex items-baseline justify-between">
              <p className="label text-umber">Your build</p>
              <p className="serif-display text-4xl">{formatINR(price)}</p>
            </div>
            <p className="mt-2 text-xs text-umber">No payment online — book with your contact details.</p>
            <button
              className="btn-solid mt-6 w-full justify-center"
              onClick={() => {
                add(SILHOUETTES[sil].slug, fabric.id);
                router.push("/checkout");
              }}
            >
              Book this build
            </button>
            <p className="mt-3 text-center text-[10px] text-umber">
              Adds the base piece to your booking — our team confirms size &amp; legs before build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
