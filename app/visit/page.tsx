"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";

export default function VisitPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", about: "" });

  const book = async () => {
    if (!form.name || !form.phone || busy) return;
    setBusy(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "consultation", name: form.name, phone: form.phone, note: form.about }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">Visit · Consult</p>
          <h1 className="serif-display max-w-4xl text-6xl lg:text-8xl">
            Come sit <span className="italic text-walnut">on things.</span>
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-14 px-6 py-16 lg:grid-cols-2 lg:px-12">
        <div>
          <Reveal variant="img">
            <Plate kind="workshop" ratio="4/3" plate={50} label="The showroom, Kirti Nagar" toneIndex={1} />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="label mb-3 text-umber">The showroom</p>
                <p className="text-sm leading-relaxed">
                  14/2 Furniture Block, Kirti Nagar<br />New Delhi 110015
                </p>
                <p className="mt-3 text-sm text-umber">Tue–Sun · 10:30 — 19:30</p>
              </div>
              <div>
                <p className="label mb-3 text-umber">The concierge</p>
                <p className="text-sm leading-relaxed">
                  +91 98765 43210<br />atelier@oaklen.in
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="label mt-3 inline-block text-[10px] text-brass underline underline-offset-4"
                >
                  WhatsApp the concierge
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="border hairline bg-bone/50 p-10">
            <p className="label mb-3 text-brass">Design consultation</p>
            <h2 className="serif-display text-4xl">An hour with a designer, on us.</h2>
            <p className="mt-4 text-sm leading-relaxed text-umber">
              Bring a floor plan or just phone photos. We&apos;ll sketch the room, place the pieces, and send you home
              with a plan — whether or not you commission a thing.
            </p>
            {sent ? (
              <div className="mt-10 border border-brass bg-ivory p-8 text-center">
                <p className="font-serif text-2xl">Booked, {form.name.split(" ")[0] || "friend"}.</p>
                <p className="mt-2 text-sm text-umber">The concierge will call within a day to fix the hour.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <textarea
                  placeholder="Tell us about the room (optional)"
                  rows={3}
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                />
                <button onClick={book} disabled={busy} className="btn-solid w-full justify-center disabled:opacity-50">
                  {busy ? "Booking…" : "Request the hour"}
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
