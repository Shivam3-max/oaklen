"use client";

import { formatINR } from "@/data/products";
import type { AdminData, Act } from "../types";
import { TIER_LABEL } from "../types";

export default function PartnersTab({ data, act }: { data: AdminData; act: Act }) {
  return (
    <div className="mt-12 space-y-6">
      {data.partners.map((p) => {
        const pending = p.referrals.filter((r) => r.status === "pending").reduce((s, r) => s + r.commission, 0);
        const confirmed = p.referrals.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commission, 0);
        return (
          <div key={p.code} className="border hairline p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-4">
                <p className="font-serif text-2xl">{p.name}</p>
                <span className="label text-[9px] text-brass">{p.code} · {TIER_LABEL[p.tier]} {p.rate}%</span>
                {p.firm && <span className="text-xs text-umber">{p.firm}</span>}
              </div>
              <p className="text-xs text-umber">{p.clicks} clicks · {p.email} · {p.phone}</p>
            </div>
            {p.referrals.length > 0 ? (
              <div className="mt-5 border-t hairline">
                {p.referrals.map((r) => (
                  <div key={r.orderId} className="flex flex-wrap items-center justify-between gap-3 border-b hairline py-3.5">
                    <p className="text-sm">
                      {r.orderId} <span className="text-umber">· order {formatINR(r.orderValue)}</span>
                    </p>
                    <div className="flex items-center gap-5">
                      <p className="font-serif">{formatINR(r.commission)}</p>
                      <span className={`label text-[9px] ${r.status === "paid" ? "text-walnut" : r.status === "confirmed" ? "text-brass" : "text-umber"}`}>
                        {r.status}
                      </span>
                      {r.status === "confirmed" && (
                        <button
                          onClick={() => act({ action: "referral-status", code: p.code, orderId: r.orderId, status: "paid" })}
                          className="label border-b border-espresso pb-0.5 text-[9px] hover:text-brass"
                        >
                          Mark paid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {(pending > 0 || confirmed > 0) && (
                  <p className="pt-3 text-xs text-umber">
                    {pending > 0 && <>Pending {formatINR(pending)}</>}
                    {pending > 0 && confirmed > 0 && " · "}
                    {confirmed > 0 && <span className="text-brass">Owed {formatINR(confirmed)}</span>}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-xs text-umber">No referrals yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
