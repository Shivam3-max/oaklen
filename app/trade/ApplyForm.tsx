"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApplyForm() {
  const [form, setForm] = useState({ name: "", firm: "", tier: "trade", email: "", phone: "" });
  const [result, setResult] = useState<{ code: string; rate: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  if (result) {
    return (
      <div className="mt-10 border border-brass bg-bone/60 p-10 text-center">
        <p className="label text-umber">Welcome to the house. Your code:</p>
        <p className="serif-display mt-4 text-6xl tracking-wide text-brass">{result.code}</p>
        <p className="mt-4 text-sm text-umber">
          Your link — <span className="text-espresso">oaklen.in/r/{result.code}</span> · earning {result.rate}% from today.
        </p>
        <Link href="/trade/dashboard" className="btn-solid mt-8">Open your dashboard</Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-7 sm:grid-cols-2">
      <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Firm / studio (optional)" value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} />
      <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <div className="sm:col-span-2">
        <p className="label mb-4 text-[10px] text-umber">I am joining as</p>
        <div className="flex flex-wrap gap-3">
          {[
            ["trade", "Architect / Designer — 10%"],
            ["build", "Builder / Contractor — 7%"],
            ["circle", "Friend of the house — 5%"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setForm({ ...form, tier: id })}
              className={`border px-5 py-3 text-xs tracking-wide transition-all ${
                form.tier === id ? "border-brass bg-bone text-espresso" : "hairline text-umber hover:border-espresso/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-[#8a3a2a] sm:col-span-2">{error}</p>}
      <button onClick={submit} disabled={busy} className="btn-solid justify-center disabled:opacity-50 sm:col-span-2">
        {busy ? "Minting your code…" : "Apply & get my code"}
      </button>
    </div>
  );
}
