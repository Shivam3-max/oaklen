"use client";

import type { AdminData, Act, Enquiry } from "../types";

const ENQUIRY_FLOW: Enquiry["status"][] = ["new", "contacted", "closed"];
const KIND_LABEL: Record<string, string> = { consultation: "Design consultation", "swatch-kit": "Swatch kit", reward: "Rewards sign-up" };

export default function InboxTab({ data, act }: { data: AdminData; act: Act }) {
  return (
    <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="label mb-6 text-umber">Enquiries — {data.enquiries.length}</p>
        {data.enquiries.length === 0 && (
          <p className="font-serif text-2xl text-umber">The inbox is quiet.</p>
        )}
        <div className="space-y-4">
          {data.enquiries.map((e) => (
            <div key={e.id} className="border hairline p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <p className="font-serif text-xl">{e.name}</p>
                  <span className="label text-[9px] text-brass">{KIND_LABEL[e.kind]}</span>
                </div>
                <p className="label text-[9px] text-umber">
                  {e.id} · {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
              <p className="mt-2 text-sm">{e.phone}</p>
              {e.note && <p className="mt-2 text-sm italic text-umber">“{e.note}”</p>}
              <div className="mt-4 flex gap-2">
                {ENQUIRY_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => act({ action: "enquiry-status", id: e.id, status: s })}
                    disabled={e.status === s}
                    className={`border px-3 py-1.5 text-[10px] tracking-wide transition-all ${
                      e.status === s ? "border-brass bg-bone text-espresso" : "hairline text-umber hover:border-espresso/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="label mb-6 text-umber">The Ledger — {data.subscribers.length} subscribers</p>
        {data.subscribers.length === 0 ? (
          <p className="text-sm text-umber">No subscribers yet — the footer form feeds this list.</p>
        ) : (
          <div className="border-t hairline">
            {data.subscribers.map((s) => (
              <div key={s.email} className="flex items-baseline justify-between border-b hairline py-3">
                <p className="text-sm">{s.email}</p>
                <p className="label text-[9px] text-umber">
                  {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
