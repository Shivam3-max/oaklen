"use client";

import { useState } from "react";

export default function RewardForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!form.name || !form.phone) {
      setError("Please add your name and phone.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "reward", name: form.name, phone: form.phone, note: form.email ? `Email: ${form.email}` : undefined }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  if (sent) {
    return (
      <div className="mt-10 border border-brass bg-bone/60 p-10 text-center">
        <p className="serif-display text-4xl">You’re in, {form.name.split(" ")[0]}.</p>
        <p className="mt-3 text-sm text-umber">Welcome to Oaklen Rewards. Our team will reach out with the details soon.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-7 sm:grid-cols-2">
      <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="sm:col-span-2" />
      {error && <p className="text-xs text-[#8a3a2a] sm:col-span-2">{error}</p>}
      <button onClick={submit} disabled={busy} className="btn-solid justify-center disabled:opacity-50 sm:col-span-2">
        {busy ? "Joining…" : "Join Oaklen Rewards"}
      </button>
    </div>
  );
}
