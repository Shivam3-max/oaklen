"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { fabricById, formatINR } from "@/data/products";

export default function CheckoutPage() {
  const { lines, subtotal, clear, product } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", pin: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const placeBooking = async () => {
    setError(null);
    if (!form.name || !/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10)) || !form.address || !/^\d{6}$/.test(form.pin)) {
      setError("Fill your name, a 10-digit phone, address and 6-digit PIN.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty, fabric: l.fabric ? fabricById(l.fabric)?.name : undefined })),
          customer: { name: form.name, phone: form.phone, email: form.email, address: form.address, pin: form.pin },
          note: form.note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      clear();
      router.push(`/checkout/success?order=${data.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center lg:px-12">
        <h1 className="serif-display text-5xl">Nothing to book yet.</h1>
        <Link href="/shop" className="btn-line mt-10">To the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">The last step</p>
      <h1 className="serif-display text-6xl">Book your pieces</h1>
      <p className="mt-4 max-w-lg text-sm text-umber">
        No payment online — just leave your details and our team will call you to confirm and arrange delivery.
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section>
            <p className="label mb-6 text-umber">01 — Where does it live?</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <input placeholder="Full name" value={form.name} onChange={set("name")} />
              <input placeholder="Phone (10 digits)" inputMode="tel" value={form.phone} onChange={set("phone")} />
              <input placeholder="Email (optional)" type="email" value={form.email} onChange={set("email")} className="sm:col-span-2" />
              <textarea placeholder="Delivery address" rows={2} value={form.address} onChange={set("address")} className="sm:col-span-2" />
              <input placeholder="PIN code" inputMode="numeric" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
            </div>
          </section>

          <section>
            <p className="label mb-6 text-umber">02 — Anything we should know?</p>
            <textarea placeholder="Notes for our team (optional) — timing, fabric questions, anything." rows={3} value={form.note} onChange={set("note")} />
          </section>
        </div>

        <aside className="h-fit border hairline bg-bone/60 p-8">
          <p className="label mb-6 text-umber">Your pieces</p>
          <div className="space-y-4 text-sm">
            {lines.map((l) => {
              const p = product(l.slug);
              if (!p) return null;
              return (
                <div key={l.slug + (l.fabric ?? "")} className="flex justify-between gap-4">
                  <span>
                    {p.name} × {l.qty}
                    {l.fabric && <span className="block text-xs text-umber">{fabricById(l.fabric)?.name}</span>}
                  </span>
                  <span>{formatINR(p.price * l.qty)}</span>
                </div>
              );
            })}
            <div className="flex justify-between border-t hairline pt-4 font-serif text-lg">
              <span>Total value</span><span>{formatINR(subtotal)}</span>
            </div>
          </div>
          {error && <p className="mt-5 text-xs text-[#8a3a2a]">{error}</p>}
          <button onClick={placeBooking} disabled={busy} className="btn-solid mt-8 w-full justify-center disabled:opacity-50">
            {busy ? "Booking…" : "Confirm booking"}
          </button>
          <p className="mt-4 text-center text-[10px] leading-relaxed text-umber">
            You won’t be charged online. We’ll call to confirm the details and delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
