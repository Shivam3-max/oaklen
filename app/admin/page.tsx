"use client";

import { useState } from "react";
import type { AdminData } from "./types";
import OverviewTab from "./tabs/OverviewTab";
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import InboxTab from "./tabs/InboxTab";
import MediaTab from "./tabs/MediaTab";

const TABS = ["overview", "bookings", "products", "media", "inbox"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<AdminData | null>(null);

  const refresh = async (k = key) => {
    const res = await fetch("/api/admin", { headers: { "x-admin-key": k } });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error);
    setData(d);
  };

  const login = async () => {
    setError(null);
    setBusy(true);
    try {
      await refresh(key);
      setAuthed(true);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  const act = async (body: Record<string, unknown>): Promise<string | null> => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    await refresh();
    return res.ok ? null : (d.error as string);
  };

  if (!authed || !data) {
    return (
      <div className="mx-auto max-w-md px-6 pb-28 pt-44 lg:px-0">
        <p className="label mb-4 text-brass">The back office</p>
        <h1 className="serif-display text-6xl">Admin.</h1>
        <p className="mt-4 text-sm text-umber">Staff only. Enter the house key.</p>
        <div className="mt-10 flex items-end gap-4">
          <input
            type="password"
            placeholder="House key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button onClick={login} disabled={busy} className="label border-b border-espresso pb-2.5 hover:text-brass disabled:opacity-40">
            {busy ? "…" : "Enter"}
          </button>
        </div>
        {error && <p className="mt-4 text-xs text-[#8a3a2a]">{error}</p>}
      </div>
    );
  }

  const newEnquiries = data.enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label mb-3 text-brass">The back office</p>
          <h1 className="serif-display text-6xl">The house ledger</h1>
        </div>
        <div className="flex flex-wrap gap-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`label transition-colors hover:text-brass ${tab === t ? "text-brass" : "text-espresso/50"}`}
            >
              {t}
              {t === "inbox" && newEnquiries > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[9px] text-ivory">
                  {newEnquiries}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {data.dbConnected === false && (
        <p className="label mt-6 border border-brass bg-bone/60 px-4 py-3 text-[10px] text-walnut">
          No database connected — changes here are not being saved. Set DATABASE_URL to save your products, images and bookings.
        </p>
      )}

      {tab === "overview" && <OverviewTab data={data} />}
      {tab === "bookings" && <OrdersTab data={data} act={act} />}
      {tab === "products" && <ProductsTab data={data} act={act} />}
      {tab === "media" && <MediaTab data={data} act={act} />}
      {tab === "inbox" && <InboxTab data={data} act={act} />}
    </div>
  );
}
