"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

const METRO_PREFIX = ["11", "12", "20", "40", "41", "56", "60", "70"];

export default function DeliveryEstimator({ products: PRODUCTS }: { products: Product[] }) {
  const [pin, setPin] = useState("");
  const [slug, setSlug] = useState(PRODUCTS[0]?.slug ?? "");
  const [result, setResult] = useState<{ line1: string; line2: string } | null>(null);

  const check = () => {
    if (!/^\d{6}$/.test(pin)) {
      setResult({ line1: "Enter a 6-digit PIN code.", line2: "" });
      return;
    }
    const p = PRODUCTS.find((x) => x.slug === slug);
    if (!p) return;
    const metro = METRO_PREFIX.includes(pin.slice(0, 2));
    const days = p.leadDays + (metro ? 4 : 9);
    const eta = new Date();
    eta.setDate(eta.getDate() + days);
    setResult({
      line1: eta.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
      line2: `${p.leadDays} days on the bench + ${metro ? "4 days white-glove delivery with assembly" : "9 days doorstep delivery"}.`,
    });
  };

  return (
    <div className="border hairline bg-bone/50 p-7">
      <p className="label mb-3 text-[10px] text-umber">The piece</p>
      <select value={slug} onChange={(e) => setSlug(e.target.value)} className="mb-6">
        {PRODUCTS.map((p) => (
          <option key={p.slug} value={p.slug}>{p.name} — {p.line}</option>
        ))}
      </select>
      <p className="label mb-3 text-[10px] text-umber">Deliver to</p>
      <div className="flex items-end gap-4">
        <input
          placeholder="PIN code"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <button onClick={check} className="label border-b border-espresso pb-2.5 hover:text-brass">Check</button>
      </div>
      {result && (
        <div className="mt-7 border-t hairline pt-6">
          <p className="label text-[10px] text-umber">Arrives by</p>
          <p className="serif-display mt-1 text-3xl">{result.line1}</p>
          {result.line2 && <p className="mt-3 text-xs text-umber">{result.line2}</p>}
        </div>
      )}
    </div>
  );
}
