"use client";

import { useMemo } from "react";
import { formatINR } from "@/data/products";
import type { AdminData } from "../types";
import { TIER_LABEL } from "../types";

export default function OverviewTab({ data }: { data: AdminData }) {
  const { orders, partners, products, enquiries, subscribers } = data;

  const stats = useMemo(() => {
    const orderValue = orders.reduce((s, o) => s + o.subtotal, 0);
    const collected = orders.reduce((s, o) => s + o.paidNow, 0);
    const outstanding = orders.reduce((s, o) => s + o.balanceDue, 0);
    const allRefs = partners.flatMap((p) => p.referrals);
    const owed = allRefs.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.commission, 0);
    const onBench = orders.filter((o) => o.status !== "delivered").length;
    return { orderValue, collected, outstanding, owed, onBench, referred: orders.filter((o) => o.refCode).length };
  }, [orders, partners]);

  const active = products.filter((p) => p.active).length;
  const newEnq = enquiries.filter((e) => e.status === "new").length;

  const cards: [string, string, string][] = [
    ["Order value", formatINR(stats.orderValue), `${orders.length} orders · ${stats.onBench} on the bench`],
    ["Collected", formatINR(stats.collected), "tokens + full payments"],
    ["Due on delivery", formatINR(stats.outstanding), "outstanding balances"],
    ["Commissions owed", formatINR(stats.owed), "confirmed, next payout cycle"],
    ["Referred orders", String(stats.referred), `of ${orders.length} total`],
    ["Partners", String(partners.length), partners.map((p) => TIER_LABEL[p.tier]).join(" · ") || "—"],
    ["Catalogue", String(products.length), `${active} live · ${products.length - active} hidden`],
    ["Enquiries", String(enquiries.length), newEnq > 0 ? `${newEnq} awaiting a call` : "all handled"],
    ["The Ledger", String(subscribers.length), "newsletter subscribers"],
  ];

  return (
    <>
      <div className="mt-12 grid gap-px overflow-hidden border hairline bg-espresso/10 sm:grid-cols-3">
        {cards.map(([t, v, d]) => (
          <div key={t} className="bg-ivory p-8">
            <p className="label text-[10px] text-umber">{t}</p>
            <p className="serif-display mt-3 text-4xl">{v}</p>
            <p className="mt-1 text-xs text-umber">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-umber">
        Delivering an order automatically confirms its partner commission. Mark commissions paid from the Partners tab after each payout run.
      </p>
    </>
  );
}
