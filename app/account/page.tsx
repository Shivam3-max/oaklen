"use client";

import { useState } from "react";
import { formatINR } from "@/data/products";

interface OrderView {
  id: string;
  items: { slug: string; name: string; line: string; qty: number; price: number; fabric?: string }[];
  subtotal: number;
  status: string;
  createdAt: string;
}

const STATUS_STEPS = ["new", "in-atelier", "delivered"];

export default function AccountPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderView[] | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async () => {
    setBusy(true);
    const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">Your account</p>
      <h1 className="serif-display text-6xl">Bookings</h1>
      <p className="mt-4 max-w-md text-sm text-umber">
        Enter the phone number you booked with — we&apos;ll pull up everything for you.
      </p>

      <div className="mt-10 flex max-w-md items-end gap-4">
        <input
          placeholder="Phone number"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
        />
        <button onClick={lookup} disabled={busy} className="label border-b border-espresso pb-2.5 hover:text-brass disabled:opacity-40">
          {busy ? "…" : "Find"}
        </button>
      </div>

      {orders !== null && (
        <div className="mt-14 space-y-8">
          {orders.length === 0 && (
            <p className="font-serif text-2xl text-umber">No bookings under that number yet.</p>
          )}
          {orders.map((o) => {
            const stepIndex = STATUS_STEPS.indexOf(o.status);
            return (
              <div key={o.id} className="border hairline p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-serif text-2xl">{o.id}</p>
                  <p className="label text-[10px] text-umber">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-0">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${i <= stepIndex ? "bg-brass" : "bg-espresso/15"}`} />
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`h-px flex-1 ${i < stepIndex ? "bg-brass" : "bg-espresso/15"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  {["Booked", "In the atelier", "Delivered"].map((s) => (
                    <span key={s} className="label text-[9px] text-umber">{s}</span>
                  ))}
                </div>
                <div className="mt-6 space-y-2 border-t hairline pt-5 text-sm">
                  {o.items.map((it) => (
                    <div key={it.slug} className="flex justify-between">
                      <span>{it.name} × {it.qty}{it.fabric ? ` · ${it.fabric}` : ""}</span>
                      <span>{formatINR(it.price * it.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t hairline pt-3 font-serif">
                    <span>Total value</span><span>{formatINR(o.subtotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
