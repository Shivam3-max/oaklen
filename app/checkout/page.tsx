"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { fabricById, formatINR, tokenAmount } from "@/data/products";
import { BRAND } from "@/data/brand";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { lines, subtotal, clear, product } = useCart();
  const router = useRouter();
  const [mode, setMode] = useState<"token" | "full">("token");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", pin: "" });
  const [refCode, setRefCode] = useState("");
  const [refFromCookie, setRefFromCookie] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)oaklen_ref=([^;]+)/);
    if (m) {
      setRefCode(decodeURIComponent(m[1]));
      setRefFromCookie(true);
    }
  }, []);

  const payNow = mode === "full" ? subtotal : tokenAmount(subtotal);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const cartItems = () =>
    lines.map((l) => ({ slug: l.slug, qty: l.qty, fabric: l.fabric ? fabricById(l.fabric)?.name : undefined }));

  // Places the order on the server (optionally with a verified Razorpay result),
  // then goes to the success page.
  const submitOrder = async (payment?: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems(), paymentMode: mode, customer: form, refCode: refCode.trim() || undefined, ...payment }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Something went wrong");
    clear();
    router.push(`/checkout/success?order=${data.id}`);
  };

  const placeOrder = async () => {
    setError(null);
    if (!form.name || !/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10)) || !form.address || !/^\d{6}$/.test(form.pin)) {
      setError("Fill your name, a 10-digit phone, address and 6-digit PIN.");
      return;
    }
    setBusy(true);
    try {
      // ask the server what the payable amount is and whether payments are live
      const initRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems(), paymentMode: mode }),
      });
      const init = await initRes.json();
      if (!initRes.ok) throw new Error(init.error ?? "Could not start payment");

      if (!init.configured) {
        // demo mode — no gateway, record the order directly
        await submitOrder();
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Couldn’t load the payment window. Check your connection.");

      const rzp = new window.Razorpay({
        key: init.keyId,
        order_id: init.rzpOrderId,
        amount: init.amount,
        currency: "INR",
        name: BRAND.name,
        description: mode === "full" ? "Full payment" : "Reservation token",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#2B2117" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await submitOrder({
              razorpayOrderId: r.razorpay_order_id,
              razorpayPaymentId: r.razorpay_payment_id,
              razorpaySignature: r.razorpay_signature,
            });
          } catch (e) {
            setError((e as Error).message);
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. Your card was not charged — try again when ready.");
            setBusy(false);
          },
        },
      } as Record<string, unknown>);
      rzp.open();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center lg:px-12">
        <h1 className="serif-display text-5xl">Nothing to reserve yet.</h1>
        <Link href="/shop" className="btn-line mt-10">To the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">The last step</p>
      <h1 className="serif-display text-6xl">Reserve</h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section>
            <p className="label mb-6 text-umber">01 — Where does it live?</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <input placeholder="Full name" value={form.name} onChange={set("name")} />
              <input placeholder="Phone (10 digits)" inputMode="tel" value={form.phone} onChange={set("phone")} />
              <input placeholder="Email" type="email" value={form.email} onChange={set("email")} className="sm:col-span-2" />
              <textarea placeholder="Delivery address" rows={2} value={form.address} onChange={set("address")} className="sm:col-span-2" />
              <input placeholder="PIN code" inputMode="numeric" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
            </div>
          </section>

          <section>
            <p className="label mb-6 text-umber">02 — How would you like to pay?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setMode("token")}
                className={`border p-6 text-left transition-all ${mode === "token" ? "border-brass bg-bone/70" : "hairline hover:border-espresso/40"}`}
              >
                <p className="font-serif text-xl">Token reserve</p>
                <p className="mt-1 text-xs text-umber">15% now, balance on delivery</p>
                <p className="mt-4 font-serif text-2xl">{formatINR(tokenAmount(subtotal))}</p>
              </button>
              <button
                onClick={() => setMode("full")}
                className={`border p-6 text-left transition-all ${mode === "full" ? "border-brass bg-bone/70" : "hairline hover:border-espresso/40"}`}
              >
                <p className="font-serif text-xl">Pay in full</p>
                <p className="mt-1 text-xs text-umber">One payment, done</p>
                <p className="mt-4 font-serif text-2xl">{formatINR(subtotal)}</p>
              </button>
            </div>
          </section>

          <section>
            <p className="label mb-6 text-umber">03 — Referred by someone?</p>
            <input
              placeholder="Partner code (optional)"
              value={refCode}
              onChange={(e) => { setRefCode(e.target.value.toUpperCase()); setRefFromCookie(false); }}
              className="max-w-sm uppercase"
            />
            {refFromCookie && refCode && (
              <p className="mt-2 text-xs text-walnut">Applied from your referral link — code {refCode}.</p>
            )}
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
            <div className="flex justify-between border-t hairline pt-4"><span>Total value</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between font-serif text-xl">
              <span>Payable now</span><span>{formatINR(payNow)}</span>
            </div>
            {mode === "token" && (
              <div className="flex justify-between text-umber"><span>On delivery</span><span>{formatINR(subtotal - payNow)}</span></div>
            )}
          </div>
          {error && <p className="mt-5 text-xs text-[#8a3a2a]">{error}</p>}
          <button onClick={placeOrder} disabled={busy} className="btn-solid mt-8 w-full justify-center disabled:opacity-50">
            {busy ? "Placing…" : mode === "token" ? "Pay token & reserve" : "Pay & reserve"}
          </button>
          <p className="mt-4 text-center text-[10px] leading-relaxed text-umber">
            Secure payment by Razorpay. Prices are inclusive of GST. You&apos;ll receive a confirmation by email.
          </p>
        </aside>
      </div>
    </div>
  );
}
