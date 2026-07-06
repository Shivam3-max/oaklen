"use client";

import { useState } from "react";
import { formatINR } from "@/data/products";
import type { AdminData, Act, Order } from "../types";
import { STATUS_LABEL } from "../types";

const ORDER_FLOW: Order["status"][] = ["reserved", "in-atelier", "delivered"];

export default function OrdersTab({ data, act }: { data: AdminData; act: Act }) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const orders = data.orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.refCode ?? "").toLowerCase().includes(q))
  );

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-6 border-y hairline py-4">
        <div className="flex flex-wrap gap-5">
          {(["all", ...ORDER_FLOW] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`label transition-colors hover:text-brass ${filter === s ? "text-brass" : "text-espresso/50"}`}
            >
              {s === "all" ? `All (${data.orders.length})` : `${STATUS_LABEL[s]} (${data.orders.filter((o) => o.status === s).length})`}
            </button>
          ))}
        </div>
        <input
          placeholder="Search id, name, phone, code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-60 !py-1.5 text-sm"
        />
      </div>

      {orders.length === 0 && <p className="mt-10 font-serif text-2xl text-umber">Nothing here.</p>}

      <div className="mt-8 space-y-6">
        {orders.map((o) => (
          <div key={o.id} className="border hairline p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-5">
                <p className="font-serif text-2xl">{o.id}</p>
                <span className={`label text-[9px] ${o.status === "delivered" ? "text-walnut" : o.status === "in-atelier" ? "text-brass" : "text-umber"}`}>
                  {STATUS_LABEL[o.status]}
                </span>
                {o.refCode && <span className="label text-[9px] text-brass">via {o.refCode}</span>}
              </div>
              <p className="label text-[10px] text-umber">
                {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="mt-4 grid gap-6 text-sm md:grid-cols-[1.4fr_1fr_auto]">
              <div className="space-y-1.5">
                {o.items.map((it) => (
                  <p key={it.slug}>
                    {it.name} — {it.line} × {it.qty}
                    {it.fabric && <span className="text-umber"> · {it.fabric}</span>}
                  </p>
                ))}
                <p className="pt-2 text-xs text-umber">
                  {o.customer.name} · {o.customer.phone} · {o.customer.address}, PIN {o.customer.pin}
                </p>
              </div>
              <div className="text-xs text-umber">
                <p>Value {formatINR(o.subtotal)}</p>
                <p>Paid {formatINR(o.paidNow)} ({o.paymentMode})</p>
                {o.balanceDue > 0 && <p className="text-walnut">Due {formatINR(o.balanceDue)}</p>}
              </div>
              <div className="flex items-start gap-2">
                {ORDER_FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => act({ action: "order-status", id: o.id, status: s })}
                    disabled={o.status === s}
                    className={`border px-3 py-2 text-[10px] tracking-wide transition-all ${
                      o.status === s ? "border-brass bg-bone text-espresso" : "hairline text-umber hover:border-espresso/40"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
