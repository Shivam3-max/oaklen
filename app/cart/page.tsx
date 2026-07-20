"use client";

import Link from "next/link";
import Plate from "@/components/Plate";
import { useCart } from "@/components/CartContext";
import { fabricById, formatINR } from "@/data/products";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, product } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">Your reservation</p>
      <h1 className="serif-display text-6xl">Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-16">
          <p className="font-serif text-2xl text-umber">Nothing on the bench yet.</p>
          <Link href="/shop" className="btn-line mt-8">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {lines.map((l) => {
              const p = product(l.slug);
              if (!p) return null;
              return (
                <div key={l.slug + (l.fabric ?? "")} className="flex gap-6 border-t hairline py-8 last:border-b">
                  <div className="w-28 shrink-0">
                    <Plate kind={p.silhouette} ratio="1/1" toneIndex={p.plate} bare />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl">{p.name}</p>
                        <p className="text-xs text-umber">{p.line}</p>
                        {l.fabric && <p className="mt-1 text-xs text-walnut">{fabricById(l.fabric)?.name}</p>}
                      </div>
                      <p className="text-sm">{formatINR(p.price * l.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 border hairline px-3 py-1">
                        <button onClick={() => setQty(l.slug, l.qty - 1)} className="text-lg text-umber hover:text-brass">−</button>
                        <span className="w-4 text-center text-sm">{l.qty}</span>
                        <button onClick={() => setQty(l.slug, l.qty + 1)} className="text-lg text-umber hover:text-brass">+</button>
                      </div>
                      <button onClick={() => remove(l.slug)} className="label text-[10px] text-umber hover:text-brass">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit border hairline bg-bone/60 p-8">
            <p className="label mb-6 text-umber">Summary</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-umber"><span>Delivery &amp; assembly</span><span>On the house</span></div>
              <div className="flex justify-between border-t hairline pt-3 font-serif text-lg">
                <span>Total</span><span>{formatINR(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-solid mt-8 w-full justify-center">
              Proceed to book
            </Link>
            <p className="mt-4 text-center text-[11px] text-umber">No payment online — just your contact details</p>
          </aside>
        </div>
      )}
    </div>
  );
}
