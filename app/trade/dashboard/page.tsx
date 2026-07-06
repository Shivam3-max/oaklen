"use client";

import { useState } from "react";
import { formatINR } from "@/data/products";

interface PartnerView {
  code: string;
  name: string;
  firm?: string;
  tier: string;
  rate: number;
  clicks: number;
  referrals: { orderId: string; orderValue: number; commission: number; status: string; date: string }[];
}

const TIER_LABEL: Record<string, string> = { trade: "Oaklen Trade", build: "Oaklen Build", circle: "Oaklen Circle" };

export default function Dashboard() {
  const [code, setCode] = useState("");
  const [partner, setPartner] = useState<PartnerView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const login = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/partners?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPartner(data.partner);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  if (!partner) {
    return (
      <div className="mx-auto max-w-xl px-6 pb-28 pt-40 lg:px-0">
        <p className="label mb-4 text-brass">Partner dashboard</p>
        <h1 className="serif-display text-6xl">Your ledger.</h1>
        <p className="mt-4 text-sm text-umber">Enter your partner code. (Try the demo code <button onClick={() => setCode("ARJUN10")} className="text-brass underline underline-offset-4">ARJUN10</button>.)</p>
        <div className="mt-10 flex items-end gap-4">
          <input
            placeholder="PARTNER CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="uppercase tracking-[0.2em]"
          />
          <button onClick={login} disabled={busy} className="label border-b border-espresso pb-2.5 hover:text-brass disabled:opacity-40">
            {busy ? "…" : "Open"}
          </button>
        </div>
        {error && <p className="mt-4 text-xs text-[#8a3a2a]">{error}</p>}
      </div>
    );
  }

  const pending = partner.referrals.filter((r) => r.status === "pending").reduce((s, r) => s + r.commission, 0);
  const confirmed = partner.referrals.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commission, 0);
  const paid = partner.referrals.filter((r) => r.status === "paid").reduce((s, r) => s + r.commission, 0);
  const link = `oaklen.in/r/${partner.code}`;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label mb-3 text-brass">{TIER_LABEL[partner.tier]} · {partner.rate}%</p>
          <h1 className="serif-display text-6xl">{partner.name.split(" ")[0]}&apos;s ledger</h1>
          {partner.firm && <p className="mt-2 text-sm text-umber">{partner.firm}</p>}
        </div>
        <button onClick={() => setPartner(null)} className="label text-[10px] text-umber hover:text-brass">
          Sign out
        </button>
      </div>

      <div className="mt-12 border hairline bg-bone/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label mb-1 text-[10px] text-umber">Your link — clients who click are yours for 30 days</p>
            <p className="font-serif text-2xl">{link}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm text-umber">{partner.clicks} clicks</p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText("https://" + link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="btn-line !py-3"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-umber">Clients can also just say <span className="text-espresso">“{partner.code}”</span> at checkout — spoken referrals count too.</p>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border hairline bg-espresso/10 sm:grid-cols-3">
        {[
          ["Pending", pending, "awaiting delivery"],
          ["Confirmed", confirmed, "pays out next cycle"],
          ["Paid to date", paid, "all settled"],
        ].map(([t, v, d]) => (
          <div key={t as string} className="bg-ivory p-8">
            <p className="label text-[10px] text-umber">{t}</p>
            <p className="serif-display mt-3 text-4xl">{formatINR(v as number)}</p>
            <p className="mt-1 text-xs text-umber">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <p className="label mb-6 text-umber">Referred commissions</p>
        {partner.referrals.length === 0 ? (
          <p className="font-serif text-xl text-umber">No referrals yet — share your link and this ledger fills itself.</p>
        ) : (
          <div className="border-t hairline">
            {partner.referrals.map((r) => (
              <div key={r.orderId} className="flex flex-wrap items-baseline justify-between gap-3 border-b hairline py-5">
                <div className="flex items-baseline gap-6">
                  <p className="font-serif text-lg">{r.orderId}</p>
                  <p className="text-xs text-umber">
                    {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-baseline gap-8">
                  <p className="text-sm text-umber">order {formatINR(r.orderValue)}</p>
                  <p className="font-serif text-lg">{formatINR(r.commission)}</p>
                  <span
                    className={`label text-[9px] ${
                      r.status === "paid" ? "text-walnut" : r.status === "confirmed" ? "text-brass" : "text-umber"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
